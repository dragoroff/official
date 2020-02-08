import * as ACTION_TYPES from "../actions/actionTypes";

export const initialState = {
  auth: false,
  error: null
};

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SIGNUP_SUCCESS:
      return {
        ...state,
        auth: true
      };
    case ACTION_TYPES.SIGNUP_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case ACTION_TYPES.SIGNIN_SUCCESS:
      return {
        ...state,
        auth: true
      };
    case ACTION_TYPES.SIGNIN_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};
