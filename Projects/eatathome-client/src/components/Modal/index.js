import React from "react";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

import LoginInputs from "../Inputs/loginInputs";
import SsoComponent from "../SSO";

import "./index.css";

const ModalWindow = props => {
  let title, toggleText, ssoBtnText;
  let { signIn, changeSignIn, ...elementProps } = props;

  if (signIn) {
    title = "Sign In";
    toggleText = { question: "You are still not with us?", link: "Sign Up" };
    ssoBtnText = "Sign In";
  } else {
    title = "Sign Up";
    toggleText = { question: "Already have account?", link: "Sign In" };
    ssoBtnText = "Sign Up";
  }

  const submitResults = data => {
    props.onSubmit(data);
  };

  return (
    <Modal
      {...elementProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row show-grid">
            <div className="col-sm-12 col-md-8">
              <LoginInputs handleResponse={submitResults} />
            </div>
            <hr />
            <div className="col-sm-12 col-md-8">
              <SsoComponent handleResponse={submitResults} text={ssoBtnText} />
            </div>
            <div className="col-sm-12 col-md-8 mt-4">
              <small className="form-text text-muted">
                {toggleText.question}
                <span
                  className="text-primary ml-2"
                  onClick={() => changeSignIn(!signIn)}
                >
                  <u style={{ cursor: "pointer" }}>{toggleText.link}</u>
                </span>
              </small>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={props.onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

ModalWindow.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  signIn: PropTypes.bool.isRequired,
  changeSignIn: PropTypes.func.isRequired
};

export default ModalWindow;
