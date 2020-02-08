import React from "react";

import "./inputs.css";

const LoginInputs = props => {
  const [inputState, setInputState] = React.useState({
    email: "",
    password: ""
  });

  const submitForm = e => {
    e.preventDefault();
    props.handleSubmit(inputState);
  };

  return (
    <div>
      <form onSubmit={e => submitForm(e)} className="mt-4 mb-4">
        <div className="form-group">
          <input
            data-test="input-email"
            className="form-control form-control-lg input-group mb-n2"
            type="text"
            placeholder="Email"
            name="email"
            value={inputState.email}
            onChange={e =>
              setInputState({ ...inputState, email: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <input
            data-test="input-password"
            className="form-control form-control-lg input-group"
            type="text"
            placeholder="Password"
            name="password"
            value={inputState.password}
            onChange={e =>
              setInputState({ ...inputState, password: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg login-buttons">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginInputs;
