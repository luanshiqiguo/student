/**
 * Created by coder on 2017/3/6.
 */
import React,{Component} from 'react'
import { Router, Route,  hashHistory ,IndexRedirect} from 'react-router'

import App from '../App';
import StPractice from '../practice/StPractice'
import StQuestionPage from '../practice/StQuestionPage'
import StSummary from '../summary/StSummary'
import StMe from '../me/StMe'
import StsmartQA from '../smartQA/StSmartQA'
import StForgetPassword from '../unauth/StForgetPassword'
import StResetPassword from '../unauth/StResetPassword'
import StChangeLog from '../unauth/StChangeLog'


import StSignIn from '../unauth/StSignIn'
import Test from './Test'



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
		const token = localStorage.getItem('token');
		const rememberMe = JSON.parse(localStorage.getItem('rememberMe'));
		this.indexRedirectUrl = token&&rememberMe ? 'practice' : 'sign-in';
	}

	render(){
		return (
			<Router history={hashHistory}>
				<Route path="/" component={App}>
					<IndexRedirect to={this.indexRedirectUrl} />
					<Route path="practice" component={StPractice} onEnter={this.requireAccess}/>
					<Route path="practice/question/:taskId/:taskType" component={StQuestionPage} onEnter={this.requireAccess}/>
					<Route path="summary" component={StSummary} onEnter={this.requireAccess}/>
					{/*<Route path="student-detail/:userId" component={StStudentDetail} onEnter={this.requireAccess}/>*/}
					<Route
						path="achievement"
						getComponent={(location,callback) => {
							require.ensure([], function (require) {
								callback(null, require('../achievement/StAchievement').default);
							}, 'StAchievement');
						}}
						onEnter={this.requireAccess}
					/>

					<Route path="me" component={StMe} onEnter={this.requireAccess} />
					<Route path="smartQA" component={StsmartQA} onEnter={this.requireAccess} />
					<Route path="test" component={Test}/>
					<Route path="sign-in" component={StSignIn} />
					<Route path="forget-password" component={StForgetPassword} />
					<Route path="reset-password(/:stuId/:token)" component={StResetPassword} />
					<Route path="change-log" component={StChangeLog} />
				</Route>
			</Router>
		);
	}
}