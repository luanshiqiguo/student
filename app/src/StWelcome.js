/**
 * Created by abing on 2017/4/26.
 */

import React,{Component} from 'react';
import {ToastAndroid} from 'react-native';
import {connect} from 'react-redux';
import {ACTION_UPDATE_TASK_LISTS} from './store/action'
import {ROUTE_SIGN_IN,ROUTE_MAIN} from './const/StRoute'
import {HostPost} from './ajax/index'
import {TASK_STATE_INDEX} from './const/StTaskType'
import SplashScreen from 'react-native-splash-screen'
import StCatchError from './StCatchError'

class StWelcome extends Component{
	componentDidMount(){
		this.goToNext();
	}

	componentDidUpdate(){
		this.goToNext();
	}

	showErrorMessage = (errorMessage) => {
		ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
	};

	goToNext = () => {
		const {init,login} = this.props.auth;
		if(init){
			const nextRoute = login ? ROUTE_MAIN : ROUTE_SIGN_IN;
			if (login){
				//1,2,3,4表示四种任务类型
				HostPost('/get-task-list-ex',{taskTypes:[1,2,3,4]},true).then(({json}) => {
					if (json.error===0){
						let tasks = {
							[TASK_STATE_INDEX[1]]:[],
							[TASK_STATE_INDEX[2]]:[],
							[TASK_STATE_INDEX[3]]:[],
							[TASK_STATE_INDEX[4]]:[],
						};

						json.list.map((item) => {
							tasks[TASK_STATE_INDEX[item.type]].push(item);
						});

						this.props.updateTaskLists(tasks)
					}else {
						this.showErrorMessage(json.error);
					}
				}).catch((error) => {
					StCatchError(error);
				});
			}

			this.props.navigator.replace(nextRoute);

			setTimeout(()=>{
				SplashScreen.hide();
			},1500);
		}
	};

	render() {
		return null;
	}
}

const mapStateToProps = (state) => {
	return {
		auth : state['auth']
	};
};

const mapDispatchToProps = {
	updateTaskLists:(info) => {
		return {
			type:ACTION_UPDATE_TASK_LISTS,
			payload:info
		}
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StWelcome);