/**
 * Created by abing on 2017/3/14.
 */
import React,{Component} from 'react'
import {Input,Row,Col,Button,AutoComplete,Icon,message,notification} from 'antd'
import {HostPost} from '../ajax'
import {connect} from 'react-redux'

import {ACTION_UPDATE_STU_INFO} from '../store/action'



const Option = AutoComplete.Option;


class StChangeEmail extends Component{
	constructor(props){
		super(props);
		this.state={
			loading:false,
			result:[],
			password:'',
			email:'',
		}
	}

	handleChangeEmail = (value) => {
		let result;
		if (!(value.trim()) || value.indexOf('@') >= 0) {
			result = [];
		} else {
			result = ['qq.com','163.com','gmail.com'].map(domain => `${value}@${domain}`);
		}
		this.setState({ result });
		this.setState({email:value});
	};

	handleChangePassword= (e) => {
		this.setState({password:e.target.value});
	};

	handleSubmit = () =>{
		const{password,email} = this.state;
		if(!password.length){
			message.error('密码不可为空！');
			return;
		}

		if(!email.length){
			message.error('邮箱不可为空！');
			return;
		}

		let emailReg = /^([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(!emailReg.test(email)){
			message.error('邮箱格式错误！');
			return;
		}

		const data = {
			password:password,
			newEmail:email,
		};

		this.setState({loading:true});

		HostPost('/change-email',{...data},true).then(({json})=>{
			if(json.error===0){
				this.setState({password:'',email:'',loading:false});
				this.props.updateStuInfo({email:data.newEmail});
				notification['success']({
					message: '温馨提示',
					description: '修改成功！',
				});
			}else if(json.error==='bad_password'){
				this.setState({loading:false});
				message.error('密码错误！修改失败');
			}else if(json.error==='bad_parameter'){
				this.setState({loading:false});
				notification['error']({
					message: '参数错误！修改失败',
				});
			}
		}).catch(() => {
			notification['error']({
				message: '网络错误！修改失败',
			});
			this.setState({loading:false});
		})
	};

	render(){
		const { result , password , email , loading} = this.state;
		const disabled = (password.trim()&&email.trim()) ? true : false;
		const children = result.map((email) => {
			return <Option key={email}>{email}</Option>;
		});

		return(
			<div>
				<div className="info-title"><Icon type="mail" /><span>修改邮箱</span></div>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>密码：</Col>
					<Col span={18} style={{fontSize:14}}>
						<Input style={{width:'80%'}} placeholder="密码" value={password} onChange={this.handleChangePassword}/>
					</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>新邮箱：</Col>
					<Col span={18} style={{fontSize:14}}>
						<AutoComplete style={{width:'80%'}} onChange={this.handleChangeEmail} placeholder="新邮箱" value={email}>
							{children}
						</AutoComplete>
					</Col>
				</Row>
				<div style={{padding:40,textAlign:'center'}}>
					{
						disabled?
							<Button type="primary" onClick={this.handleSubmit} loading={loading}>确认</Button>
							:
							<Button type="primary" disabled>确认</Button>
					}

				</div>
			</div>
		)
	}
}

const mapDispatchToProps = {
	updateStuInfo:(info) => {
		return {
			type:ACTION_UPDATE_STU_INFO,
			payload:info
		}
	},
};

export default connect(null,mapDispatchToProps)(StChangeEmail);