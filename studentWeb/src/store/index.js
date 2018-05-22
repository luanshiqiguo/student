/**
 * Created by crazycooler on 2017/3/5.
 */
import {applyMiddleware,createStore,combineReducers} from 'redux'
import thunk from 'redux-thunk';
import authReducer from './authReducer'
import taskReducer from './taskReducer'

const middlewares = [thunk];

const rootReducer = combineReducers({
	auth:authReducer,
	task:taskReducer
});

let createStStore = applyMiddleware(...middlewares)(createStore);

let store = null;
if(process.env.NODE_ENV === 'production'){
	store = createStStore(rootReducer);
} else {
	store = createStStore(rootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}

export default store;