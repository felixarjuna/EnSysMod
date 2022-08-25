import React from "react";

function Homepage() {
  return (
    <div className="homepage">
      <div className="masthead">
        <div className="masthead-content text-white">
          <div className="container-fluid px-4 px-lg-0">
            <h1 className="lh-1 mb-4">Welcome to EnSysMod!</h1>
            <p className="mb-5">
              EnSysMod is an Energy System Modeling Web Application that allows
              you to model and optimize various Energy Systems across the world.
            </p>
            <form id="contactForm" action="/webapp" method="GET">
              <div className="row input-group-newsletter">
                <div className="col-auto">
                  <button
                    className="btn btn-dark"
                    id="submitButton"
                    type="submit"
                  >
                    WebApp
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="social-icons">
        <div className="d-flex flex-row flex-lg-column justify-content-center align-items-center h-100 mt-3 mt-lg-0">
          <a
            className="btn btn-dark m-3"
            target="_blank"
            href="https://www.linkedin.com/company/fh-aachen-institut-nowum-energy/about/"
            rel="noreferrer"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            className="btn btn-dark m-3"
            target="_blank"
            href="https://www.linkedin.com/company/fh-aachen-institut-nowum-energy/about/"
            rel="noreferrer"
          >
            <i className="fas fa-globe"></i>
          </a>
          <a
            className="btn btn-dark m-3"
            target="_blank"
            href="https://www.instagram.com/fh.aachen.energietechnik/?hl=en"
            rel="noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
