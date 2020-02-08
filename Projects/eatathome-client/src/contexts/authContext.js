import React from "react";

import * as AuthReducer from "../reducers/authReducer";
import * as Actions from "../actions/actions";

import { AuthContextRoutes } from "../routes/routes";
export const AuthContext = React.createContext();

export const AuthContextState = () => {
  const [stateAuthReducer, dispatchAuthReducer] = React.useReducer(
    AuthReducer.AuthReducer,
    AuthReducer.initialState
  );
  const handleSignUpSuccess = () => {
    dispatchAuthReducer(Actions.signup_success());
  };

  const handleSignUpFailure = message => {
    dispatchAuthReducer(Actions.signup_failure(message));
  };

  const handleSignInSuccess = () => {
    dispatchAuthReducer(Actions.signin_success());
  };

  const handleSignInFailure = message => {
    dispatchAuthReducer(Actions.signin_failure(message));
  };

  return (
    <div>
      <AuthContext.Provider
        value={{
          auth: stateAuthReducer.auth,
          authError: stateAuthReducer.error,
          signUp: () => handleSignUpSuccess(),
          signUpError: data => handleSignUpFailure(data),
          signIn: () => handleSignInSuccess(),
          signInError: data => handleSignInFailure(data)
        }}
      >
        <AuthContextRoutes />
      </AuthContext.Provider>
    </div>
  );
};
