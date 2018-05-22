/**
 * Created by abing on 2017/10/26.
 */
import {ToastAndroid} from 'react-native'

export default (error) => {

	let errorMessage = '网络错误，请稍后再试';

	if(error === 'refresh failed'){
		errorMessage = '验证信息刷新失败，请重新登录'
	}else if(error === 'not found token'){
		errorMessage = '登录信息过期，请重新登录'
	}else if(error === 'refreshing token'){
		errorMessage = '网络繁忙请稍后再试或重新登录'
	}else if(error === 'The token has been blacklisted'){
		errorMessage = '身份信息过期，请重新登录'
	}

	ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
}
