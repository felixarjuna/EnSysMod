Just another energy system modeling tool made by Institut NOWUM-Energy - FH Aachen.

This project provides a REST API for modeling an energy system. 
It allows you to store multiple datasets in a database and generate multiple simulations from each dataset.

Our documentation is available [here](https://nowum.github.io/EnSysMod/).

# Getting Started
Requirements:
- [Git](https://git-scm.com/downloads)
- [Python 3.6+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/)
- [GUROBI](https://www.gurobi.com/downloads) or [GLPK](https://www.gnu.org/software/glpk/glpk.html)


Clone this repository:
```bash
git clone https://github.com/felixarjuna/EnSysMod.git
```


## Back End
### Installation
Open Terminal and type following command
```bash
cd ensysmod/backend  # Change directory to frontend directory
```

Install requirements:
```bash
sh scripts/install.sh
```

Run the back end server:
```bash
sh scripts/run.sh
```

Start using the REST API by visiting http://localhost:8080/docs/

## Front End
### Installation
Open Terminal and type following command
```
cd ensysmod/frontend  # Change directory to frontend directory
```

Install the packages and start the web server
```
npm i   # npm install
npm start # run web app
```
