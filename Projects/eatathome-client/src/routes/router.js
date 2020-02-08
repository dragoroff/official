import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { Routes } from "./routes";
import { AuthContextState as AuthRoutes } from "../contexts/authContext";

const CustomRouter = () => (
  <Router>
    <div>
      <AuthRoutes />
      <Routes />
    </div>
  </Router>
);

export default CustomRouter;
