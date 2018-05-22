/**
 * Created by coder on 2017/3/6.
 */
import React,{Component} from 'react'
import { Router, Route,  hashHistory ,IndexRedirect} from 'react-router'

import App from '../App';
import StStudentInfo from '../user/StStudentInfo'
import StTaskBank from '../task/StTaskBank'
import StQuestionBank from '../question/StQuestionBank'
import StTaskReport from '../report/StTaskReport'
import StSignIn from '../unauth/StSignIn'
import StForgetPassword from '../unauth/StForgetPassword'
import StResetPassword from '../unauth/StResetPassword'
import Test from './Test'
import StTaskEdit from '../task/StTaskEdit'
import StChangeLog from '../unauth/StChangeLog'
import StFeedback from '../user/StStudentFeedback'


import store from '../store'


import {HostPost} from '../ajax'
import {ACTION_SIGN_IN} from '../store/action'

export default class StRoute extends Component{

	requireAccess = () => {
		const login = store.getState().auth.login;
		if(login){
			return;
		}

		const userInfo = store.getState().auth.userInfo;
		if(!userInfo){
			HostPost('/user',{},true).then(({json}) => {
				if(json.error === 0){
					store.dispatch({type:ACTION_SIGN_IN,payload:json});
				} else {
					hashHistory.push('/sign-in');
				}
			}).catch((error) => {
				hashHistory.push('/sign-in');
			});
		}
	};

	componentWillMount(){
		console.log(this.indexRedirectUrl);

		const token = localStorage.getItem('token');
		const rememberMe = JSON.parse(localStorage.getItem('rememberMe'));
		console.log(token&&rememberMe);
		this.indexRedirectUrl = token&&rememberMe ? 'student-info' : 'sign-in';
	}

	render(){
		return (
			<Router history={hashHistory}>
				<Route path="/" component={App}>
					<IndexRedirect to={this.indexRedirectUrl} />
					<Route path="student-info" component={StStudentInfo} onEnter={this.requireAccess}/>
					{/*<Route path="student-detail/:userId" component={StStudentDetail} onEnter={this.requireAccess}/>*/}
					<Route
						path="student-detail/:userId"
						getComponent={(location,callback) => {
							require.ensure([], function (require) {
								callback(null, require('../user/StStudentDetail').default);
							}, 'StStudentDetail');
						}}
						onEnter={this.requireAccess}
					/>

					<Route path="task-bank" component={StTaskBank} onEnter={this.requireAccess} />
					<Route path="task-bank/detail/:taskId" component={StTaskBank} onEnter={this.requireAccess} />
					<Route path="task-bank/edit" component={StTaskEdit} onEnter={this.requireAccess} />
					<Route path="task-bank/create" component={StTaskEdit} onEnter={this.requireAccess} />

					<Route path="question-bank" component={StQuestionBank} onEnter={this.requireAccess}/>
					<Route path="task-report" component={StTaskReport} onEnter={this.requireAccess}/>
					<Route path="test" component={Test}/>
					<Route path="sign-in" component={StSignIn} />
					<Route path="forget-password" component={StForgetPassword} />
					<Route path="reset-password(/:stuId/:token)" component={StResetPassword} />
					<Route path="change-log" component={StChangeLog} />
					<Route path="feedback" component={StFeedback} />
				</Route>
			</Router>
		);
	}
}