/**
 * Created by abing on 2017/3/23.
 */

import React,{Component} from 'react'
import {Form,Icon,Input,Button,notification} from 'antd'
import { hashHistory } from 'react-router'

import {HostPost} from '../ajax/index'
import './StSignIn.css'

const FormItem = Form.Item;


export default class StForgetPassword extends Component{

	constructor(props){
		super(props);
		this.state={
			loading:false,
			stuId:'',
			email:'',
			emailErrorMessage:'',
			stuIdErrorMessage:'',
		}
	}

	handleChangeStuId = (e) => {
		this.setState({stuId:e.target.value});
	};

	handleChangeEmail = (e) => {
		this.setState({email:e.target.value});
	};

	openNotification = (type,description) => {
		notification[type]({
			message: '温馨提示:',
			description: description,
			duration: 10,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const {stuId,email,emailErrorMessage,stuIdErrorMessage} = this.state;
		if(!stuId.length){
			this.setState({stuIdErrorMessage:'请输入账号'});
			return;
		}

		if(stuIdErrorMessage.length){
			this.setState({stuIdErrorMessage:''});
		}

		if(!email.length){
			this.setState({emailErrorMessage:'请输入邮箱'});
			return;
		}

		let emailReg = /^([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(!emailReg.test(email)){
			this.setState({emailErrorMessage:'邮箱格式不正确'});
			return;
		}

		if(emailErrorMessage.length){
			this.setState({emailErrorMessage:''});
		}

		this.setState({loading:true});

		HostPost('/forget-password',{stuId,email},false).then(({json})=>{
			if(json.error===0){
				this.openNotification('success','提交成功，邮件已发送至您的邮箱，请注意查收！');
				hashHistory.push('/sign-in');
			}else if(json.error==='map_error') {
				this.openNotification('error','您提交的邮箱与账号不对应，请再次检查！');
				this.setState({loading:false});
			}else if(json.error==='invalid_stuId') {
				this.openNotification('error','无效的账号，请再次检查！');
				this.setState({loading:false});
			}else {
				this.openNotification('error','提交失败！');
				this.setState({loading:false});
			}
		}).catch(()=>{
			this.openNotification('error','网络错误！');
			this.setState({loading:false});
		});
	};

	render(){
		const{stuId,email,stuIdErrorMessage,emailErrorMessage,loading} = this.state;

		return(
			<Form onSubmit={this.handleSubmit} className="login-form">
				<h1 style={{textAlign:'center'}}>忘记密码</h1>
				<FormItem validateStatus={stuIdErrorMessage.length ? 'error' : null} help={stuIdErrorMessage}>
					<Input addonBefore={<Icon type="user" />} placeholder="账号" value={stuId} onChange={this.handleChangeStuId}/>
				</FormItem>
				<FormItem validateStatus={emailErrorMessage.length ? 'error' : null} help={emailErrorMessage}>
					<Input addonBefore={<Icon type="mail" />}  placeholder="邮箱" value={email} onChange={this.handleChangeEmail}/>
				</FormItem>
				<FormItem>
					<Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
						发送重置密码邮件
					</Button>
				</FormItem>
			</Form>
		)
	}
}