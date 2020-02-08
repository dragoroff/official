import * as ACTION_TYPES from "./actionTypes";

export const signup_success = () => {
  return {
    type: ACTION_TYPES.SIGNUP_SUCCESS
  };
};

export const signup_failure = message => {
  return {
    type: ACTION_TYPES.SIGNUP_FAILURE,
    payload: message
  };
};

export const signin_success = () => {
  return {
    type: ACTION_TYPES.SIGNIN_SUCCESS
  };
};

export const signin_failure = message => {
  return {
    type: ACTION_TYPES.SIGNIN_FAILURE,
    payload: message
  };
};
