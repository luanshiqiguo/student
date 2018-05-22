/**
 * Created by coder on 2017/2/22.
 */
import {ACTION_SIGN_IN,ACTION_SIGN_OUT,ACTION_FRESH_TOKEN,ACTION_UPDATE_INFO} from './action'
import initState from './state'
import {REHYDRATE} from 'redux-persist/constants'

export default (state = initState.auth,action) => {
	switch (action.type){
		case ACTION_SIGN_IN:
			return {init:true,login:true,userInfo:action.payload.userInfo,token:action.payload.token};
		case ACTION_SIGN_OUT:
			return {init:true,login:false,userInfo:{},token:''};
		case ACTION_FRESH_TOKEN:
			return Object.assign({},state,{token:action.payload});
		case ACTION_UPDATE_INFO:
			const userInfo = Object.assign({},state.userInfo,action.payload);
			return Object.assign({},state,{userInfo});
		case REHYDRATE:
			const incoming = action.payload.myReducer;
			if (incoming) return {...state, ...incoming, specialKey: processSpecial(incoming.specialKey)};
			return Object.assign({},action.payload.auth,{init:true});
		default:
			return state;
	}

}
