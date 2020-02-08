import React from "react";
import { Link } from "react-router-dom";

import "./index.css";

import cookVideo from "../../assets/cook/cooking.mp4";

const CookComponent = () => {
  let background;
  if (window.innerWidth >= 800) {
    background = (
      <video autoPlay muted loop playsInline className="cookBack">
        <source data-test="cook-background" src={cookVideo} />
      </video>
    );
  } else {
    background = (
      <img
        data-test="cook-background"
        className="cookBack"
        src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_720/v1580204764/cooking/cook-background.jpg"
        alt=""
      />
    );
  }

  return (
    <div className="component-cook" data-test="component-cook">
      <div>
        <Link to="/">
          <img
            data-test="logo"
            id="logo"
            src="https://res.cloudinary.com/eat-at-home/image/upload/v1580201752/logo/logo_transparent_iilra4.png"
            alt="eatathome"
          />
        </Link>
      </div>

      {background}

      <div id="head-title" className="display-4">
        Make a hobbie your income
      </div>

      <div>
        <Link to="/subscribe-form/host">
          <button
            data-test="cook-button"
            id="button-cook"
            className="btn btn-primary btn-lg"
          >
            It maybe interesting to me
          </button>
        </Link>
      </div>

      <div className="container-fluid px-4 cook">
        <div className="mt-5 mb-5" id="advantages-section">
          <h1 className="title">Be the first to discover EatAtHome</h1>

          <div className="row">
            <div className="col-sm-4 col-lg-4 mt-4">
              <div className="card shadow rounded advan-card">
                <div className="row no-gutters">
                  <div className="col-md-4">
                    <img
                      src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,w_720/v1580201799/cooking/advan-first-cook_mam5r3.jpg"
                      className="card-img"
                      alt="soup"
                    />
                  </div>

                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title pt-4">
                        Make your food famous all over the world
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4 col-lg-4 mt-4">
              <div className="card shadow rounded advan-card">
                <div className="row no-gutters">
                  <div className="col-md-4">
                    <img
                      src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,w_720/v1580201798/cooking/advan-sec-cook_z6wvl2.jpg"
                      className="card-img"
                      alt="money"
                    />
                  </div>

                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title pt-4">
                        Earn money for your hobbie
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4 col-lg-4 mt-4">
              <div className="card shadow rounded advan-card">
                <div className="row no-gutters">
                  <div className="col-md-4">
                    <img
                      src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,w_720/v1580201798/cooking/advan-third-cook_joqsle.jpg"
                      className="card-img"
                      alt="people"
                    />
                  </div>

                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title pt-4">
                        Meet interesting people
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="work-scheme-section" className="section">
          <h1 className="title">How does it work</h1>

          <div className="row mb-5">
            <div className="col-lg-2 col-md-2 col-sm-1 mt-4 mr-5 scheme-card">
              <div className="card shadow rounded">
                <img
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580201795/cooking/steps-one-cook_ysvvyp.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="granny-cooks"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 1</h5>
                  <p className="card-text pt-4">
                    You place your well-known dumplings on EatAtHome.com
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-2 col-sm-1 mt-4 mr-5 scheme-card">
              <div className="card shadow rounded">
                <img
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580201790/cooking/steps-two-cook_znextl.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="food order"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 2</h5>
                  <p className="card-text pt-4">
                    You are getting an order from our favourite guests
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-2 col-sm-1 mt-4 mr-5 scheme-card">
              <div className="card shadow rounded">
                <img
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580222748/cooking/steps-three-cook.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="serve food"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 3</h5>
                  <p className="card-text pt-4">
                    You are preparing your famous best dish to go or serving
                    dinner
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-2 col-sm-1 mt-4 mr-5 scheme-card">
              <div className="card shadow rounded ">
                <img
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580201795/cooking/steps-four-cook_qxwbua.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="dinner"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 4</h5>
                  <p className="card-text pt-4">
                    Our guests grab the food or you have dinner together
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-2 col-sm-1 mt-4 scheme-card">
              <div className="card shadow rounded ">
                <img
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580201793/cooking/steps-five-cook_f07ply.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="happiness"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 5</h5>
                  <p className="card-text pt-4">
                    You are getting reward and unforgettable emotions!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="final-section" className="display-4 mb-5">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-md-6 col-lg-6 col-sm-8">
            <p>
              If you love to cook and want to share your love with others join
              us and become part of the food revolution!
            </p>

            <Link to="/subscribe-form/host">
              <button
                data-test="cook-button"
                id="button-cook-end"
                className="btn btn-primary btn-lg"
              >
                It maybe interesting to me
              </button>
            </Link>
          </div>
          <div className="col-3"></div>
        </div>
      </div>
    </div>
  );
};

export default CookComponent;
