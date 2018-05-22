/**
 * Created by abing on 2017/3/23.
 */

import React,{Component} from 'react'
import {Form,Icon,Input,notification,message,Button} from 'antd'
import {HostPost} from '../ajax/index'
import { hashHistory } from 'react-router'


import './StSignIn.css'

const FormItem = Form.Item;


export default class StResetPassword extends Component{

	constructor(props){
		super(props);
		this.state={
			loading:false,
			newPassword:'',
			newPassword2:'',
			errorMessage1:'',
			errorMessage2:''
		}
	}

	openNotification = (type,description) => {
		notification[type]({
			message: '温馨提示:',
			description: description,
			duration: 10,
		});
	};

	handleChangeNewPassword1 = (e) => {
		this.setState({newPassword:e.target.value});
	};

	handleChangeNewPassword2 = (e) => {
		this.setState({newPassword2:e.target.value});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const {newPassword,newPassword2,errorMessage1,errorMessage2} = this.state;
		if(!newPassword.trim()){
			this.setState({errorMessage1:'不可为空！'});
			return;
		}

		if(errorMessage1){
			this.setState({errorMessage1:''});
		}

		if(!newPassword2.trim()){
			this.setState({errorMessage2:'不可为空！'});
			return;
		}

		if (errorMessage2){
			this.setState({errorMessage2:''});
		}

		if (newPassword!==newPassword2){
			message.error('两次密码不一致');
			return;
		}

		const {stuId,token} = this.props.location.query;

		this.setState({loading:token});

		HostPost('/reset-password',{stuId,token,newPassword},false).then(({json}) => {
			if(json.error===0){
				this.openNotification('success','恭喜您！设置成功');
				hashHistory.push('/sign-in');
			}else if(json.error==='bad_token'){
				this.openNotification('error','参数无效，设置失败');
				this.setState({loading:false});
			}else {
				this.openNotification('error','设置失败');
				this.setState({loading:false});
			}
		}).catch((error) => {
			this.openNotification('error','网络错误！');
			this.setState({loading:false});
		})

	};

	render(){

		const {newPassword,newPassword2,errorMessage1,errorMessage2,loading} = this.state;

		return(
			<Form onSubmit={this.handleSubmit} className="login-form">
				<h1 style={{textAlign:'center'}}>重置密码</h1>
				<FormItem validateStatus={errorMessage1.length ? 'error' : null} help={errorMessage1}>
					<Input addonBefore={<Icon type="lock" />}
					       placeholder="请输入新密码"
					       type='password'
					       value={newPassword}
					       onChange={this.handleChangeNewPassword1}
					/>
				</FormItem>
				<FormItem validateStatus={errorMessage2.length ? 'error' : null} help={errorMessage2}>
					<Input addonBefore={<Icon type="lock" />}
					       placeholder="请再次输入新密码"
					       type='password'
					       value={newPassword2}
					       onChange={this.handleChangeNewPassword2}
					/>
				</FormItem>
				<FormItem>
					<Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
						提交
					</Button>
				</FormItem>
			</Form>
		)
	}
}