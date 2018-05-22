/**
 * Created by abing on 2017/3/14.
 */
import React,{Component} from 'react'
import {Input,Row,Col,Button,message,notification,Icon} from 'antd'
import {HostPost} from '../ajax/index'


export default class StChangePassword extends Component{
	constructor(props){
		super(props);
		this.state={
			prePassword:'',
			newPassword:'',
			newPasswordConfirm:'',
			loading:false,
		}
	}

	handleChangePrePassword=(e)=>{
		this.setState({prePassword:e.target.value});
	};

	handleChangeNewPassword=(e)=>{
		this.setState({newPassword:e.target.value});
	};

	handleChangeNewPasswordConfirm=(e)=>{
		this.setState({newPasswordConfirm:e.target.value});
	};

	handleSubmitNewPassword = () => {
		const{prePassword,newPassword,newPasswordConfirm}=this.state;

		if(newPassword.trim().toString().split("").length<6){
			message.error('新密码位数过少');
			return;
		}

		if(newPassword!==newPasswordConfirm){
			message.error('两次新密码不一致');
			return;
		}

		if(prePassword===newPassword){
			message.error('原密码与新密码相同，不可修改！');
			return;
		}

		const data={
			srcPassword:prePassword.trim(),
			newPassword:newPassword.trim(),
		};

		this.setState({loading:true});
		HostPost('/change-password',{...data},true).then(({json})=>{
			switch (json.error){
				case 0:
					notification['success']({
						message: '温馨提示',
						description: '密码修改成功',
					});
					this.setState({
						prePassword:'',
						newPassword:'',
						newPasswordConfirm:'',
						loading:false
					});
					break;
				case 'bad_parameter':
					notification['warning']({
						message: '温馨提示',
						description: '参数错误！修改失败',
					});
					this.setState({loading:false});
					break;
				case 'bad_src_password':
					notification['error']({
						message: '温馨提示',
						description: '原密码错误！修改失败',
					});
					this.setState({loading:false});
					break;
			}
		}).catch((error)=>{
			this.setState({loading:false});
			notification['error']({
				message: '温馨提示',
				description: '网络错误，修改失败',
			});
		})
	};

	render(){
		const{prePassword,newPassword,newPasswordConfirm,loading}=this.state;
		const disabled = (prePassword.trim()&&newPassword.trim()&&newPasswordConfirm.trim()) ? true : false;
		return(
			<div>
				<div className="info-title"><Icon type="lock" /><span>修改密码</span></div>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>原密码：</Col>
					<Col span={18} style={{fontSize:14}}>
						<Input style={{width:'80%'}} placeholder="原密码" type="password" value={prePassword} onChange={this.handleChangePrePassword}/>
					</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>新密码：</Col>
					<Col span={18} style={{fontSize:14}}>
						<Input style={{width:'80%'}} placeholder="新密码(至少6位)" type="password" value={newPassword} onChange={this.handleChangeNewPassword}/>
					</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>确认新密码：</Col>
					<Col span={18} style={{fontSize:14}}>
						<Input style={{width:'80%'}} placeholder="确认新密码" type="password" value={newPasswordConfirm} onChange={this.handleChangeNewPasswordConfirm}/>
					</Col>
				</Row>
				<div style={{padding:40,textAlign:'center'}}>
					{
						disabled ?
							<Button type="primary" onClick={this.handleSubmitNewPassword} loading={loading}>确认</Button>
							:
							<Button type="primary" disabled>确认</Button>
					}
				</div>
			</div>
		)
	}
}