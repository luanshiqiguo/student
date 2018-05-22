/**
 * Created by coder on 2017/2/23.
 */
import {ACTION_UPDATE_TASK,ACTION_UPDATE_TASK_LISTS} from './action'
import {TASK_STATE_INDEX} from '../const/StTaskType'
import initState from './state'
import {REHYDRATE} from 'redux-persist/constants'

export default (state = initState.task,action) => {
	switch (action.type){
		case ACTION_UPDATE_TASK:{
			const oldTasks = state[TASK_STATE_INDEX[action.payload.type]];
			const taskId = action.payload.taskId;
			const content = action.payload.content;
			const score = action.payload.score;
			const experience = action.payload.experience;
			//对象切割
			let newTasks = oldTasks.slice();
			newTasks.map((task) => {
				if(task.id ===  taskId){
					task.content = content;
					task.score = score;
					task.experience = experience;
				}
			});
			//浅拷贝
			return Object.assign({},state,{[TASK_STATE_INDEX[action.payload.type]]:newTasks});
		}
		case ACTION_UPDATE_TASK_LISTS:{
			return Object.assign({},state,action.payload);
		}
		case REHYDRATE:
			const incoming = action.payload.myReducer;
			if (incoming) return {...state, ...incoming, specialKey: processSpecial(incoming.specialKey)};
			return state;
		default:
			return state;

	}

}