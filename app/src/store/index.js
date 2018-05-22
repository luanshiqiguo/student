/**
 * Created by coder on 2017/2/22.
 */
import {applyMiddleware,createStore,combineReducers,compose} from 'redux'
import thunk from 'redux-thunk';
import authReducer from './authReducer'
import taskReducer from './taskReducer'
import questionReducer from './questionReducer'
import createLogger from 'redux-logger';
import {persistStore, autoRehydrate} from 'redux-persist'
import {AsyncStorage} from 'react-native'

const middlewares = [thunk];
let logger = createLogger({
	collapsed: true,
	duration: true,
});
middlewares.push(logger);


const rootReducer = combineReducers({
	auth:authReducer,
	task:taskReducer,
	// question:questionReducer,
});

const store = createStore(
	rootReducer,
	undefined,
	compose(
		applyMiddleware(...middlewares),
		autoRehydrate()
	),
);

persistStore(store,{storage: AsyncStorage});

export default store;