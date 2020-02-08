import React from "react";

import "./index.css";

const successBox = () => {
  return (
    <div id="success-box" className="card rounded mt-5">
      <div className="card-body">
        <div className="mb-4 text-center">
          <i id="success-icon" className="fa fa-check-circle"></i>
        </div>
        <p className="lead">We'll get in touch with you as soon as possible.</p>
      </div>
    </div>
  );
};

export default successBox;
