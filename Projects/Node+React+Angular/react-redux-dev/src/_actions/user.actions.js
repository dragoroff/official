import { userConstants } from './../_constants/index';
import { userService } from './../_services';
import { alertActions } from './alert.actions';
import { history } from './../_helpers';

export const userActions = {
    login,
    logout,
    register
};

function login(username, password) {
    return async (dispatch) => {
        dispatch({ type: userConstants.LOGIN_REQUEST, user: username });
        try {
            let response = await userService.login(username, password);
            if (response.status == 200) {
                let token = "";
                for (var pair of response.headers.entries()) {
                    if (pair[0] == "xx-auth") {
                        token = pair[1];
                    }

                }
                if (!token) {
                    throw new Error();
                }
                
                let user = {
                    name: username,
                    token
                };
                dispatch({ type: userConstants.LOGIN_SUCCESS, user });
                history.push('/managmentSystem');
            }
            else {
                throw new Error();
            }
        }
        catch (e) {
            dispatch({ type: userConstants.LOGIN_FAILURE, error: "erorr " + e.toString() });
            dispatch(alertActions.error("erorr " + e.toString()));
        }
    };
}

function register(user) {
    return async (dispatch) => {
        dispatch({ type: userConstants.REGISTER_REQUEST, user });
        try {
            let response = await userService.register({ ...user });
            if (response.status == 201) {
                dispatch({ type: userConstants.REGISTER_SUCCESS, user });
                history.push('/managmentSystem/login');
                dispatch(alertActions.success('Registration successful'));
            }
            else {
                throw new Error();
            }
        }
        catch (e) {
            dispatch({ type: userConstants.REGISTER_FAILURE, error: e.toString() });
            dispatch(alertActions.error("erorr " + e.toString()));
        }
    };
}

function logout() {
    return { type: userConstants.LOGOUT };
}
