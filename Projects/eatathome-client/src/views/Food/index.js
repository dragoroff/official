import React from "react";
import { Link } from "react-router-dom";

import "./index.css";

import eatingVideo from "../../assets/food/eating.mp4";

const FoodComponent = () => {
  let background;
  if (window.innerWidth >= 800) {
    background = (
      <video autoPlay muted loop playsInline className="foodBack">
        <source data-test="food-background" src={eatingVideo} />
      </video>
    );
  } else {
    background = (
      <img
        data-test="food-background"
        className="foodBack"
        src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_720/v1580206500/food/food-background.jpg"
        alt=""
      />
    );
  }

  return (
    <div className="component-food" data-test="component-food">
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
        Discover culture through real local food
      </div>

      <div>
        <Link to="/subscribe-form/customer">
          <button
            data-test="food-button"
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
                      src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,w_720/v1580201831/food/food-advan-one_esxfcd.jpg"
                      className="card-img"
                      alt="homemade dish"
                    />
                  </div>

                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title pt-4">
                        Try homemade national food from local people
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
                      src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,w_720/v1580201830/food/food-advan-two_xmr4es.jpg"
                      className="card-img"
                      alt="dinner with locals"
                    />
                  </div>

                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title pt-4">
                        Feel the country by having dinner at home with locals
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
                      src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,w_720/v1580201831/food/food-advan-three_x1wd2f.jpg"
                      className="card-img"
                      alt="celebrating"
                    />
                  </div>

                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title pt-4">
                        Get unforgettable emotions from your holidays
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
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580201829/food/food-steps-one_d6clx8.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="signin"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 1</h5>
                  <p className="card-text pt-4">
                    Sign in on EatAtHome.com and the journey begins!
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-2 col-sm-1 mt-4 mr-5 scheme-card">
              <div className="card shadow rounded">
                <img
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580201830/food/food-steps-two_rajey4.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="local food"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 2</h5>
                  <p className="card-text pt-4">
                    Choose local food by distance or by rating and place an
                    order
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-2 col-sm-1 mt-4 mr-5 scheme-card">
              <div className="card shadow rounded">
                <img
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580201830/food/food-steps-three_hlwzkq.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="travelling"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 3</h5>
                  <p className="card-text pt-4">
                    While the food is cooking you can enjoy local attractions
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-2 col-sm-1 mt-4 mr-5 scheme-card">
              <div className="card shadow rounded ">
                <img
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580201828/food/food-steps-four_nnhxyc.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="family dinner"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 4</h5>
                  <p className="card-text pt-4">
                    Get the most out of your meal or dinner with the locals
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-2 col-sm-1 mt-4 scheme-card">
              <div className="card shadow rounded ">
                <img
                  src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_1080/v1580201828/food/food-steps-five_jckqwp.jpg"
                  className="card-img-top"
                  style={{ height: 30 + "rem" }}
                  alt="local drinks"
                />

                <div className="card-body">
                  <h5 className="card-title">Step 5</h5>
                  <p className="card-text pt-4">
                    As the result you discovered a country through real local
                    food
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
              If you like to travel and eat something special join us and become
              part of the food revolution!
            </p>

            <Link to="/subscribe-form/customer">
              <button
                data-test="food-button"
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

export default FoodComponent;
