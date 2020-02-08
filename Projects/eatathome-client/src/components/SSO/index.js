import React from "react";
import PropTypes from "prop-types";
import GoogleLogin from "react-google-login";

import "./index.css";

// TODO: client id get from server in main component
const SsoComponent = props => {
  return (
    <div className="mt-4">
      <GoogleLogin
        clientId="506004349802-e753fahoomehu1c4ig3p0jnt3c6s98p0.apps.googleusercontent.com"
        buttonText="Login"
        accessType="offline"
        onSuccess={data => props.handleResponse({ ...data, client: "google" })}
        onFailure={data => props.handleResponse({ ...data, client: "google" })}
        render={renderProps => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="btn btn-outline-secondary btn-lg sso-buttons mb-1"
          >
            {props.text} with
            <img
              src="https://res.cloudinary.com/eat-at-home/image/upload/v1580325387/icons/gmail.ico"
              alt="gmail"
              style={{ marginLeft: 1 + "em" }}
            />
          </button>
        )}
      />
      <button
        className="btn btn-outline-secondary btn-lg sso-buttons mb-1"
        onClick={() => props.handleResponse({ client: "facebook" })}
      >
        {props.text} with
        <img
          src="https://res.cloudinary.com/eat-at-home/image/upload/v1580325695/icons/facebook.ico"
          alt="facebook"
          style={{ marginLeft: 1 + "em" }}
        />
      </button>
    </div>
  );
};

SsoComponent.propTypes = {
  text: PropTypes.string.isRequired,
  handleResponse: PropTypes.func.isRequired
};

export default SsoComponent;
