/**
 * Created by crazycooler on 2017/3/5.
 */
import {ACTION_SIGN_IN,ACTION_SIGN_OUT,ACTION_FRESH_TOKEN} from './action'
import initState from './state'

export default (state = initState.auth,action) => {
	switch (action.type){
		case ACTION_SIGN_IN:
			return {login:true,userInfo:action.payload.userInfo};
		case ACTION_SIGN_OUT:
			return {login:false,userInfo:null};
		case ACTION_FRESH_TOKEN:
			return Object.assign({},state,{token:action.payload});
		default:
			return state;
	}

}