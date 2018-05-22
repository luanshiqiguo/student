/**
 * Created by coder on 2017/3/13.
 */
export const TASK_TYPE_PREVIEW = 1;
export const TASK_TYPE_HOMEWORK = 2;
export const TASK_TYPE_EXPERIMENT = 3;
export const TASK_TYPE_SUMMARY = 4;


export const TASK_STATE_FINISH = 0;
export const TASK_STATE_EXPIRE = 1;
export const TASK_STATE_DOING = 2;

export const TASK_STATE_INDEX = {
	[TASK_TYPE_PREVIEW] : 'taskPreview',
	[TASK_TYPE_HOMEWORK] : 'taskHomework',
	[TASK_TYPE_EXPERIMENT] : 'taskExperiment',
	[TASK_TYPE_SUMMARY] : 'taskSummary',
};