import React from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import SuccessBox from "./successBox";
import Form from "./form";
import { serverPath } from "../../config";

class FeedbackComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      error: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    const { obj } = this.props.match.params;
    const { firstName, lastName, email } = data;
    let { phone, country } = data;

    // we don't need the country code
    country = country.label;
    // convert phone number to string
    phone = phone.toString();

    return axios
      .post(`${serverPath}/api/landing/add-person`, {
        firstName,
        lastName,
        email,
        phone,
        country,
        obj
      })
      .then(() => this.setState(state => ({ ...state, success: true })))
      .catch(err =>
        this.setState(state => ({ ...state, error: err.response.data.data }))
      );
  }

  render() {
    let element;
    if (this.state.success) {
      element = <SuccessBox data-test="success-box" />;
    } else {
      element = (
        <Form
          data-test="component-form"
          error={this.state.error}
          onSubmit={this.handleSubmit}
        />
      );
    }
    return (
      <div data-test="component-feedback" className="component-feedback">
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

        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">{element}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default FeedbackComponent;
