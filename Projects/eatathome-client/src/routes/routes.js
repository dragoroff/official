import React from "react";
import { Route } from "react-router-dom";

import Main from "../views/MainPage";
import Cook from "../views/Cook";
import Food from "../views/Food";
import SubsForm from "../views/Feedback";

export const Routes = () => (
  <div>
    <Route path="/cook" component={Cook} />
    <Route path="/food" component={Food} />
    <Route path="/subscribe-form/:obj" component={SubsForm} />
  </div>
);

export const AuthContextRoutes = () => (
  <div>
    <Route exact path="/" component={Main} />
  </div>
);
