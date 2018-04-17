import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { productStock } from './product.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  productStock,
  alert
});

export default rootReducer;