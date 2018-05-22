/**
 * Created by coder on 2017/2/27.
 */
import React,{Component} from 'react'
import {View,TextInput,Text,StyleSheet,TouchableNativeFeedback,BackAndroid,ToastAndroid} from 'react-native'
import StNavHead from '../StNavHead'
import {HostPost} from '../ajax/index'
import StButton from '../ui/StButton'
import {regExp} from '../const/StRegExp'
import StCatchError from '../StCatchError'

export default class StChangePassword extends Component{
	constructor(props){
		super(props);
		this.state = {
			srcPassword:'',
			newPassword:'',
			newPassword2:'',
			disabled:true
		}
	}

	componentWillMount() {
		BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
	}

	componentWillUnmount(){
		BackAndroid.removeEventListener('hardwareBackPress',this.handleBack);
	}

	handleSrcPasswordChange = (text) => {
		const inputValue = text.replace(regExp, '');
		this.setState({srcPassword:inputValue});
		const {newPassword,newPassword2} = this.state;
		if (inputValue&&newPassword&&newPassword2){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	handleNewPasswordChange = (text) => {
		const inputValue = text.replace(regExp, '');
		this.setState({newPassword:inputValue});
		const {srcPassword,newPassword2} = this.state;
		if (inputValue&&srcPassword&&newPassword2){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	handleNewPassword2Change = (text) => {
		const inputValue = text.replace(regExp, '');
		this.setState({newPassword2:inputValue});
		const {srcPassword,newPassword} = this.state;
		if (inputValue&&srcPassword&&newPassword){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	handleSubmit = () => {
		const {srcPassword,newPassword,newPassword2} = this.state;
		if(!srcPassword.length){
			this.showErrorMessage('原始密码不能为空');
			return;
		}

		if(!newPassword.length){
			this.showErrorMessage('新密码不能为空');
			return;
		}

		if(newPassword.length <6){
			this.showErrorMessage('新密码长度至少6位');
			return;
		}

		if(newPassword !== newPassword2){
			this.showErrorMessage('新密码两次输入不一致');
			return;
		}

		if(srcPassword===newPassword){
			this.showErrorMessage('新密码不能与原始密码相同');
			return;
		}

		this.setState({disabled:true});

		HostPost('/change-password',{srcPassword,newPassword},true).then(({json}) => {
			if(json.error === 0){
				this.showErrorMessage('修改密码成功');
				this.handleBack();
			} else if(json.error === 'bad_src_password'){
				this.showErrorMessage('原始密码错误');
				this.setState({disabled:false});
			}{
				this.showErrorMessage('修改密码失败');
				this.setState({disabled:false});
			}
		}).catch((error) => {
			StCatchError(error);
			this.setState({disabled:false});
		});
	};

	handleBack = () => {
		this.props.navigator.pop();
		return true;
	};

	showErrorMessage = (errorMessage) => {
		ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
	};

	render(){
		const {disabled,srcPassword,newPassword,newPassword2} = this.state;

		return (
			<View style={{flex:1,backgroundColor:'#f4f4f4'}}>
				<StNavHead title="修改密码" back={this.handleBack}/>

				<View style={{height:20}} />
				<TextInput
					style={styles.stylePasswordInput}
					onChangeText={this.handleSrcPasswordChange}
					underlineColorAndroid={'transparent'}
					placeholder="原密码"
					secureTextEntry={true}
					textAlign="center"
				    value={srcPassword}
				/>

				<View style={{height:30}} />
				<TextInput
					style={styles.stylePasswordInput}
					onChangeText={this.handleNewPasswordChange}
					underlineColorAndroid={'transparent'}
					placeholder="新密码"
					secureTextEntry={true}
					textAlign="center"
				    value={newPassword}
				/>
				<View style={{height:2}} />
				<TextInput
					style={styles.stylePasswordInput}
					onChangeText={this.handleNewPassword2Change}
					underlineColorAndroid={'transparent'}
					placeholder="确认新密码"
					secureTextEntry={true}
					textAlign="center"
				    value={newPassword2}
				/>

				<StButton title={'提交'} onPress={this.handleSubmit} disabled={disabled} />

			</View>
		);
	}
}

const styles = StyleSheet.create({


	stylePasswordInput:{
		backgroundColor:'#fff',
		height:45,
	},
	styleViewCommit:{
		marginTop:15,
		marginLeft:10,
		marginRight:10,
		height:35,
		borderRadius:5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorMessage:{
		marginTop:10,
		color:'red',
		fontSize:12,
	}
});