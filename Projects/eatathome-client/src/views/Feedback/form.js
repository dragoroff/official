import React from "react";

import Select from "react-select";
import countryList from "react-select-country-list";
import PropTypes from "prop-types";

import "./index.css";

const FormComponent = props => {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    country: null,
    phone: ""
  };

  const [state, setState] = React.useState(initialState);
  const handleInputChange = e =>
    setState({ ...state, [e.target.name]: e.target.value });

  const handleFormSubmit = e => {
    e.preventDefault();
    props.onSubmit(state);
  };

  return (
    <div
      data-test="component-form"
      id="subscribe-form"
      className="card rounded"
    >
      <div className="card-body">
        <div className="title">Join food revolution now!</div>
        {props.error ? (
          <div
            id="error-box"
            data-test="error-box"
            className="row lead text-danger mt-2"
          >
            <span className="col-lg-8">
              <i className="fa fa-times-circle-o" aria-hidden="true">
                <span style={{ marginLeft: 10 + "px" }}>{props.error}</span>
              </i>
            </span>
          </div>
        ) : null}
        <form onSubmit={e => handleFormSubmit(e)} data-test="main-form">
          <div className="form-group mt-5">
            <label>First Name</label>
            <input
              data-test="input-name"
              className="form-control form-control-lg"
              type="text"
              placeholder="e.g. John"
              name="firstName"
              value={state.firstName}
              onChange={e => handleInputChange(e)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              data-test="input-lastname"
              className="form-control form-control-lg"
              type="text"
              placeholder="e.g. Doe"
              name="lastName"
              value={state.lastName}
              onChange={e => handleInputChange(e)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Country</label>
            <Select
              data-test="select-country"
              options={countryList().getData()}
              value={state.country}
              onChange={e => setState({ ...state, country: e })}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              data-test="input-email"
              className="form-control form-control-lg"
              type="text"
              placeholder="e.g. johndoe@gmail.com"
              name="email"
              value={state.email}
              onChange={e => handleInputChange(e)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Phone Number</label>
            <input
              data-test="input-phone"
              className="form-control form-control-lg"
              type="number"
              placeholder="e.g. 777-777777"
              name="phone"
              value={state.phone}
              onChange={e => handleInputChange(e)}
              required
            />
          </div>
          <button
            id="form-button"
            data-test="form-button"
            type="submit"
            className="btn btn-danger btn-lg mt-3 float-right"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

FormComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default FormComponent;
