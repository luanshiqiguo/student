/**
 * Created by crazycooler on 2017/3/5.
 */
import React,{Component} from 'react'
import { Icon, Input,Button, Checkbox } from 'antd'
import {connect} from 'react-redux'
import { hashHistory , Link} from 'react-router'
import './StSignIn.css'
import {HostPost} from '../ajax'
import {ACTION_SIGN_IN} from '../store/action'


class StSignIn extends Component{
	constructor(props) {
		super(props);
		this.state = {
			email:'',
			password:'',
			remember:false,
			errorMessage:'',
			waitSec:0,
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const {errorMessage,email,password,remember} = this.state;
		if(!email.length){
			this.setState({errorMessage:'请输入邮箱'});
			return;
		}
		let emailReg = /^([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(!emailReg.test(email)){
			this.setState({errorMessage:'邮箱格式不正确'});
			return;
		}

		if(!password.length){
			this.setState({errorMessage:'请输入密码'});
			return;
		}

		if(errorMessage.length){
			this.setState({errorMessage:''});
		}

		HostPost('/sign-in-of-teacher',{email,password}).then(({json,header}) => {
			if(json.error === 0){
				localStorage.setItem('token',json.token);
				localStorage.setItem('rememberMe',remember);
				this.props.signIn(json);
				hashHistory.replace('/student-info');
			} else {
				if(json.message === 'You have exceeded your rate limit.'){
					let waitSec = parseInt(header.get('retry-after'))+3;
					this.setState({waitSec:waitSec--});
					this.setState({errorMessage:'登录操作过于频繁，请稍后再试'});
					const waitTimer = setInterval(() => {
						this.setState({waitSec:waitSec--});
						if(waitSec < 0){
							clearInterval(waitTimer);
						}
					},1000)
				} else {
					this.setState({errorMessage:'账号或者密码错误'});
				}

			}
		}).catch((error) => {
			this.setState({errorMessage:'网络错误！请稍后重试'});
			// console.log(error);
		});

	};

	handleChangeEmail = (e) => {
		this.setState({ email: e.target.value });
	};

	handleChangePassword = (e) => {
		this.setState({ password: e.target.value });
	};

	handleChangeRemember = (e) => {
		this.setState({remember:e.target.checked});
	};

	render(){
		const {email,password,errorMessage,waitSec} = this.state;

		return (
			<form onSubmit={this.handleSubmit} className="login-form">
				<div className="form-item">
					<Input size="large" addonBefore={<Icon type="user" />} placeholder="邮箱" value={email} onChange={this.handleChangeEmail}/>
				</div>
				<div className="form-item">
					<Input size="large" addonBefore={<Icon type="lock" />} type="password" placeholder="密码" value={password} onChange={this.handleChangePassword}/>
				</div>
				<span className="error-message">{errorMessage}</span>
				<div className="form-item" style={{paddingTop:'7px'}}>
					<Checkbox onChange={this.handleChangeRemember}>记住我</Checkbox>
					<Link to="/forget-password" className="login-form-forgot">忘记密码？</Link>
					<Button size="large" style={{marginTop:'7px'}} type="primary" htmlType="submit" className="login-form-button" disabled={waitSec > 0}>
						登录{waitSec>0 ? '( ' + waitSec + ' )' : ''}
					</Button>
				</div>
			</form>
		);
	}
}

const mapDispatchToProps = {
	signIn:(info) => {
		return {
			type:ACTION_SIGN_IN,
			payload:info,
		}
	}
};

export default connect(null,mapDispatchToProps)(StSignIn);