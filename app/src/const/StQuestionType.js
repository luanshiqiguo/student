/**
 * Created by ASUS on 2017/8/14.
 */
export const QUESTION_TYPE_QUESTION_ANSWER = 1;
export const QUESTION_TYPE_COMMON_QUESTION = 2;
export const QUESTION_TYPE_HISTORY_QUESTION = 3;

export const QUESTION_STATE_INDEX = {
    [QUESTION_TYPE_QUESTION_ANSWER] : 'questionAnswer',
    [QUESTION_TYPE_COMMON_QUESTION] : 'commonQuestion',
    [QUESTION_TYPE_HISTORY_QUESTION] : 'historyQuestion',
};