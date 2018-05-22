/**
 * Created by coder on 2017/2/23.
 */
import {ACTION_UPDATE_TASK,ACTION_UPDATE_TASK_LISTS,ACTION_CLEAR_TASK_LISTS} from './action'
import {TASK_STATE_INDEX} from '../common/constDefine'
import initState from './state'


export default (state = initState.task,action) => {
	switch (action.type){
		case ACTION_UPDATE_TASK:{
			const oldTasks = state[TASK_STATE_INDEX[action.payload.type]];
			if(!oldTasks){
				return state;
			}
			const taskId = action.payload.taskId;
			const content = action.payload.content;
			const score = action.payload.score;
			const experience = action.payload.experience;
			const experienceScore = action.payload.experienceScore;
			let newTasks = oldTasks.slice();
			newTasks.map((task) => {
				if(task.id ===  taskId){
					task.content = content;
					task.score = score;
					task.experience = experience;
					task.experienceScore = experienceScore
				}
			});
			return Object.assign({},state,{[TASK_STATE_INDEX[action.payload.type]]:newTasks});
		}
		case ACTION_UPDATE_TASK_LISTS:{
			return Object.assign({},state,action.payload);
		}

		case ACTION_CLEAR_TASK_LISTS:{
			return {
				taskPreview:null,
				taskHomework:null,
				taskExperiment:null,
				taskSummary:null,
			};
		}

		default:
			return state;
	}

}