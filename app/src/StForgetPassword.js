/**
 * Created by abing on 2017/3/24.
 */

import React,{Component} from 'react'
import {View,TextInput,BackAndroid,ToastAndroid,StyleSheet} from 'react-native'

import StButton from './ui/StButton'
import {HostPost} from './ajax/index'
import StNavHead from './StNavHead'


export default class StForgetPassword extends Component{

	constructor(props){
		super(props);
		this.state={
			disabled:true,
			stuId:'',
			email:'',
		}
	}

	componentWillMount() {
		BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
	}

	componentWillUnmount(){
		BackAndroid.removeEventListener('hardwareBackPress',this.handleBack);
	}

	handleBack = () => {
		this.props.navigator.pop();
		return true;
	};

	showErrorMessage = (errorMessage) => {
		ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
	};

	handleStuIdChange = (text) => {
		this.setState({stuId:text});
		const {email} = this.state;
		if(text.trim()&&email.trim()){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	handleEmailChange = (text) => {
		this.setState({email:text});
		const {stuId} = this.state;
		if(text.trim()&&stuId.trim()){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	submit = () => {
		const {stuId,email} = this.state;
		if (!stuId.trim()){
			this.showErrorMessage('学号不可为空');
			return;
		}

		if (!email.trim()){
			this.showErrorMessage('邮箱不可为空');
			return;
		}

		let emailReg = /^([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(!emailReg.test(email)){
			this.showErrorMessage('邮箱格式错误！');
			return;
		}

		this.setState({disabled:true});

		HostPost('/forget-password',{stuId,email},false).then(({json}) => {
			if(json.error===0){
				this.showErrorMessage('提交成功，邮件已发送至您的邮箱，请注意查收！');
				this.props.navigator.pop();
			}else if(json.error==='map_error') {
				this.showErrorMessage('您提交的邮箱与学号不对应，请再次检查！');
				this.setState({disabled:false});
			}else if(json.error==='invalid_stuId') {
				this.showErrorMessage('无效的学号，请再次检查！');
				this.setState({disabled:false});
			}else {
				this.showErrorMessage('提交失败！');
				this.setState({disabled:false});
			}
		}).catch(()=>{
			this.showErrorMessage('网络错误！');
			this.setState({disabled:false});
		})
	};

	render(){
		const {disabled} = this.state;

		return(
			<View style={{backgroundColor:'#f4f4f4',flex:1}}>
				<StNavHead title='忘记密码' back={this.handleBack}/>
				<TextInput
					style={styles.styleUserInput}
					onChangeText={this.handleStuIdChange}
					underlineColorAndroid={'transparent'}
					placeholder="学号"
					textAlign="center"
					autoFocus={true}
				/>
				<View
					style={{height:1,backgroundColor:'#f4f4f4'}}
				/>
				<TextInput
					style={styles.styleEmailInput}
					onChangeText={this.handleEmailChange}
					underlineColorAndroid={'transparent'}
					placeholder="邮箱"
					textAlign="center"
				/>
				<StButton title='发送重置密码邮件' disabled={disabled} onPress={this.submit}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	styleUserInput:{
		backgroundColor:'#fff',
		marginTop:40,
		height:45,
	},
	styleEmailInput:{
		backgroundColor:'#fff',
		height:45,
	},
	styleBack:{
		marginTop:20,
		marginLeft:10,
		width:50,
	}
});