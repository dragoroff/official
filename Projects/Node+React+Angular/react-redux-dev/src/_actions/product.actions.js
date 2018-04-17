import { productConstants } from './../_constants/index';
import { productService } from './../_services';
import { alertActions } from './alert.actions';
import { history } from './../_helpers';

export const productActions = {add};

function add(product, token) {
    return async (dispatch) => {
        dispatch({ type: productConstants.ADD_REQUEST, product });
        try {
            let response = await productService.addProduct(product, token);
            if (response.status == 200) {
                dispatch({ type: productConstants.ADD_SUCCESS, product });
                history.push('/managmentSystem');
            }
            else {
                throw new Error();
            }
        }
        catch (e) {
            dispatch({ type: productConstants.ADD_FAILURE, error: "erorr " + e.toString() });
            dispatch(alertActions.error("erorr " + e.toString()));
        }
    };
}
