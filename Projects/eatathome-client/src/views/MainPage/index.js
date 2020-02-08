import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { serverPath } from "../../config";
import video from "../../assets/main-video.mp4";
import ModalWindow from "../../components/Modal";

import { AuthContext } from "../../contexts/authContext";
import "./index.css";

const MainPage = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [signIn, setSignIn] = React.useState(false);
  const context = React.useContext(AuthContext);

  console.log(context.auth);
  let background;
  if (window.innerWidth >= 800) {
    background = (
      <video autoPlay muted loop playsInline className="mainBack">
        <source data-test="main-background" src={video} />
      </video>
    );
  } else {
    background = (
      <img
        data-test="main-background"
        className="mainBack"
        src="https://res.cloudinary.com/eat-at-home/image/upload/c_scale,h_720/v1580154724/mainPage/sharing-cherry-tomatoes.jpg"
        alt=""
      />
    );
  }

  const handleSubmitForm = async data => {
    if (data.email && data.password) {
      console.log("data", data.email);
    }
    if (data.client) {
      console.log("GOOGLE API DATA", data);
      const regStatus = signIn ? "signin" : "signup";
      const res = await axios
        .post(`${serverPath}/auth/${data.client}/${regStatus}`, {
          code: data.code
        })
        .catch(err => console.log(err));

      console.log(res);
    }
  };

  return (
    <div data-test="component-main">
      {background}

      <div className="content">
        <div className="row justify-content-center">
          <ModalWindow
            signIn={signIn}
            changeSignIn={setSignIn}
            onSubmit={handleSubmitForm}
            show={modalShow}
            onHide={() => setModalShow(false)}
          />

          <div className="col-sm-4 col-lg-4 mt-4">
            <Link to="/cook">
              <button
                data-test="main-button"
                className="btn btn-lg btn-secondary main-button"
              >
                I love to cook
              </button>
            </Link>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2">
            <img
              className="logo"
              src="https://res.cloudinary.com/eat-at-home/image/upload/v1580201752/logo/logo_transparent_iilra4.png"
              alt=""
            />
            <div>
              <button
                id="login-btn"
                className="btn btn-outline-light"
                onClick={() => setModalShow(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
          <div className="col-sm-4 col-lg-4 mt-4">
            <Link to="/food">
              <button
                data-test="main-button"
                className="btn btn-lg btn-secondary main-button"
              >
                I love to eat
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
