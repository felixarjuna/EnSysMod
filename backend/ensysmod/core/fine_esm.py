import os
from datetime import datetime
from typing import Any, Dict, List, Union

import pandas as pd
from FINE import EnergySystemModel, Storage, Sink, Transmission, Conversion, Source, writeOptimizationOutputToExcel
from sqlalchemy.orm import Session

from ensysmod import crud
from ensysmod.model import EnergyModel, EnergyComponent, EnergySource, EnergySink, EnergyConversion, EnergyStorage, \
    EnergyTransmission, EnergyModelParameter, EnergyModelParameterOperation, EnergyModelParameterAttribute

# Dictionary that contains internal and fine model parameter names
param_mapper: Dict[str, str] = {
    'yearly_limit': 'yearlyLimit',
}


def generate_esm_from_model(db: Session, model: EnergyModel) -> EnergySystemModel:
    """
    Generate an ESM from a given EnergyModel.

    :param db: Database session
    :param model: EnergyModel
    :return: ESM
    """
    regions = model.dataset.regions
    region_ids = [region.id for region in regions]
    commodities = model.dataset.commodities
    esm_data = {
        "hoursPerTimeStep": model.dataset.hours_per_time_step,
        "numberOfTimeSteps": model.dataset.number_of_time_steps,
        "costUnit": model.dataset.cost_unit,
        "lengthUnit": model.dataset.length_unit,
        "locations": set(region.name for region in regions),
        "commodities": set(commodity.name for commodity in commodities),
        "commodityUnitsDict": {commodity.name: commodity.unit for commodity in model.dataset.commodities},
    }

    esM = EnergySystemModel(verboseLogLevel=0, **esm_data)

    # Add all sources
    for source in model.dataset.sources:
        add_source(esM, db, source, region_ids, model.parameters)

    # Add all sinks
    for sink in model.dataset.sinks:
        add_sink(esM, db, sink, region_ids, model.parameters)

    # Add all conversions
    for conversion in model.dataset.conversions:
        add_conversion(esM, db, conversion, region_ids, model.parameters)

    # Add all storages
    for storage in model.dataset.storages:
        add_storage(esM, db, storage, region_ids, model.parameters)

    # Add all transmissions
    for transmission in model.dataset.transmissions:
        add_transmission(esM, db, transmission, region_ids, model.parameters)

    return esM


def add_source(esM: EnergySystemModel, db: Session, source: EnergySource, region_ids: List[int],
               custom_parameters: List[EnergyModelParameter]) -> None:
    esm_source = component_to_dict(db, source.component, region_ids)
    esm_source["commodity"] = source.commodity.name
    if source.commodity_cost is not None:
        esm_source["commodityCost"] = source.commodity_cost
    esm_source = override_parameters(esm_source, custom_parameters)
    esM.add(Source(esM=esM, **esm_source))


def add_sink(esM: EnergySystemModel, db: Session, sink: EnergySink, region_ids: List[int],
             custom_parameters: List[EnergyModelParameter]) -> None:
    esm_sink = component_to_dict(db, sink.component, region_ids)
    esm_sink["commodity"] = sink.commodity.name
    esm_sink = override_parameters(esm_sink, custom_parameters)
    esM.add(Sink(esM=esM, **esm_sink))


def add_conversion(esM: EnergySystemModel, db: Session, conversion: EnergyConversion, region_ids: List[int],
                   custom_parameters: List[EnergyModelParameter]) -> None:
    esm_conversion = component_to_dict(db, conversion.component, region_ids)
    esm_conversion["physicalUnit"] = conversion.commodity_unit.unit
    esm_conversion["commodityConversionFactors"] = {x.commodity.name: x.conversion_factor for x in
                                                    conversion.conversion_factors}
    esm_conversion = override_parameters(esm_conversion, custom_parameters)
    esM.add(Conversion(esM=esM, **esm_conversion))


def add_storage(esM: EnergySystemModel, db: Session, storage: EnergyStorage, region_ids: List[int],
                custom_parameters: List[EnergyModelParameter]) -> None:
    esm_storage = component_to_dict(db, storage.component, region_ids)
    esm_storage["commodity"] = storage.commodity.name
    if storage.charge_efficiency is not None:
        esm_storage["chargeEfficiency"] = storage.charge_efficiency
    if storage.discharge_efficiency is not None:
        esm_storage["dischargeEfficiency"] = storage.discharge_efficiency
    if storage.self_discharge is not None:
        esm_storage["selfDischarge"] = storage.self_discharge
    if storage.cyclic_lifetime is not None:
        esm_storage["cyclicLifetime"] = storage.cyclic_lifetime
    if storage.charge_rate is not None:
        esm_storage["chargeRate"] = storage.charge_rate
    if storage.discharge_rate is not None:
        esm_storage["dischargeRate"] = storage.discharge_rate
    if storage.state_of_charge_min is not None:
        esm_storage["stateOfChargeMin"] = storage.state_of_charge_min
    if storage.state_of_charge_max is not None:
        esm_storage["stateOfChargeMax"] = storage.state_of_charge_max
    esm_storage = override_parameters(esm_storage, custom_parameters)
    esM.add(Storage(esM=esM, **esm_storage))


def add_transmission(esM: EnergySystemModel, db: Session, transmission: EnergyTransmission,
                     region_ids: List[int], custom_parameters: List[EnergyModelParameter]) -> None:
    esm_transmission = component_to_dict(db, transmission.component, region_ids)
    esm_transmission["commodity"] = transmission.commodity.name
    esm_transmission["distances"] = crud.energy_transmission_distance.get_dataframe(db, transmission.ref_component,
                                                                                    region_ids=region_ids)
    esm_transmission = override_parameters(esm_transmission, custom_parameters)
    esM.add(Transmission(esM=esM, **esm_transmission))


def component_to_dict(db: Session, component: EnergyComponent, region_ids: List[int]) -> Dict[str, Any]:
    component_data = {
        "name": component.name,
        "hasCapacityVariable": component.capacity_variable,
        "capacityVariableDomain": component.capacity_variable_domain.value.lower(),
        "capacityPerPlantUnit": component.capacity_per_plant_unit,
        "investPerCapacity": component.invest_per_capacity,
        "opexPerCapacity": component.opex_per_capacity,
        "interestRate": component.interest_rate,
        "economicLifetime": component.economic_lifetime,
    }
    if component.shared_potential_id is not None:
        component_data["sharedPotentialID"] = component.shared_potential_id

    if crud.capacity_max.has_data(db, component_id=component.id, region_ids=region_ids):
        component_data["capacityMax"] = df_or_s(crud.capacity_max.get_dataframe(db, component_id=component.id,
                                                                                region_ids=region_ids))

    if crud.capacity_fix.has_data(db, component_id=component.id, region_ids=region_ids):
        component_data["capacityFix"] = df_or_s(crud.capacity_fix.get_dataframe(db, component_id=component.id,
                                                                                region_ids=region_ids))

    if crud.operation_rate_max.has_data(db, component_id=component.id, region_ids=region_ids):
        component_data["operationRateMax"] = df_or_s(crud.operation_rate_max.get_dataframe(db,
                                                                                           component_id=component.id,
                                                                                           region_ids=region_ids))

    if crud.operation_rate_fix.has_data(db, component_id=component.id, region_ids=region_ids):
        component_data["operationRateFix"] = df_or_s(crud.operation_rate_fix.get_dataframe(db,
                                                                                           component_id=component.id,
                                                                                           region_ids=region_ids))

    return component_data


def override_parameters(component_dict: Dict, custom_parameters: List[EnergyModelParameter]) -> Dict:
    for custom_parameter in custom_parameters:
        if custom_parameter.component.name != component_dict["name"]:
            continue
        attribute_name = param_mapper[custom_parameter.attribute.name]
        if custom_parameter.operation == EnergyModelParameterOperation.add:
            component_dict[attribute_name] += custom_parameter.value
        elif custom_parameter.operation == EnergyModelParameterOperation.multiply:
            component_dict[attribute_name] *= custom_parameter.value
        elif custom_parameter.operation == EnergyModelParameterOperation.set:
            component_dict[attribute_name] = custom_parameter.value
        else:
            raise ValueError("Unknown operation: {}".format(custom_parameter.operation))
        if custom_parameter.attribute == EnergyModelParameterAttribute.yearly_limit:
            component_dict["commodityLimitID"] = "CO2"  # TODO: should be configurable
    return component_dict


def optimize_esm(esM: EnergySystemModel, output: str):
    """
    Optimize the energy system model.
    :param esM: Energy System Model to be optimized
    :param output: type of the output file. Either ['json', 'excel', or 'csv']
    """
    esM.cluster(numberOfTypicalPeriods=7)
    esM.optimize(timeSeriesAggregation=True)

    time_str = datetime.now().strftime("%Y%m%d%H%M%S")
    result_file_path = None
    if 'excel' in output:
        result_file_path = f"./tmp/result-{time_str}"
        # create folder ./tmp if it does not exist
        if not os.path.exists("./tmp"):
            os.makedirs("./tmp")
    if 'json' in output:
        result_file_path = f"./tmp/json-{time_str}"
        if not os.path.exists(result_file_path):
            os.makedirs(result_file_path)
    writeOptimizationOutputToExcel(esM=esM,
                                   outputFileName=result_file_path,
                                   optSumOutputLevel=2, optValOutputLevel=1,
                                   output=output)
    if output == 'excel':
        return result_file_path + ".xlsx"
    if output == 'json':
        return result_file_path


def export_data(export_folder: str):
    import zipfile
    # create zip file
    zip_file_path = os.path.join(export_folder, "result.zip")
    with zipfile.ZipFile(zip_file_path, 'w') as zip_file:
        for root, dirs, files in os.walk(export_folder):
            acr_path = os.path.relpath(root, export_folder)
            zip_file.write(root, acr_path)
            for file in files:
                # only copy .json files
                if file.endswith(".json"):
                    zip_file.write(os.path.join(root, file), arcname=os.path.join(acr_path, file))
    return zip_file_path


def df_or_s(dataframe: pd.DataFrame) -> Union[pd.DataFrame, pd.Series]:
    if dataframe.shape[0] == 1:
        return dataframe.squeeze(axis=0)
    else:
        return dataframe
