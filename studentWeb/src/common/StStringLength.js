/**
 * Created by abing on 2017/8/30.
 */
//计算去掉空格后的字符串的长度
export const stringLength = (str) => {
	return str.replace(/\s/g,'').length;
};