/**
 * Created by ASUS on 2017/9/19.
 */
import {ACTION_DELETE_QUESTION_HISTORY} from './action'
import initState from './state'
import {REHYDRATE} from 'redux-persist/constants'

export default (state = initState.question,action) => {
    switch (action.type){
        case ACTION_DELETE_QUESTION_HISTORY:{
                return {historyList:[]};
            }
        case REHYDRATE:
            const incoming = action.payload.myReducer;
            if (incoming) return {...state, ...incoming, specialKey: processSpecial(incoming.specialKey)};
            return state;
        default:
            return state;
    }

}
