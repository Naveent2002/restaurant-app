import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { menuReducer, cartReducer, orderReducer } from './reducers';

const rootReducer = combineReducers({
  menu: menuReducer,
  cart: cartReducer,
  orders: orderReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;