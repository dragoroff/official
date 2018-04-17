import { productConstants } from '../_constants';


export function productStock(state = {}, action) {
    switch (action.type) {
        case productConstants.ADD_REQUEST:
            return { adding: true };
        case productConstants.ADD_SUCCESS:
            return { added: true };
        case productConstants.ADD_FAILURE:
            return {};
        default:
            return state
    }
}