/**
 * Created by abing on 2017/3/22.
 */
import React,{Component} from 'react'
import {View,Text,TextInput,BackAndroid,StyleSheet,ToastAndroid} from 'react-native'
import StNavHead from '../StNavHead'
import {HostPost} from '../ajax/index'
import StButton from '../ui/StButton'
import {connect} from 'react-redux'
import {ACTION_UPDATE_INFO} from '../store/action'
import StCatchError from '../StCatchError'


class StChangeEmail extends Component{

	constructor(props){
		super(props);
		this.state = {
			password:'',
			newEmail:'',
			disabled:true
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

	handlePasswordChange = (text) => {
		this.setState({password:text});
		const{newEmail} = this.state;
		if(text&&newEmail){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	handleNewEmailChange = (text) => {
		this.setState({newEmail:text});
		const{password} = this.state;
		if(text&&password){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	handleSubmit = () => {
		const{password,newEmail} = this.state;
		if(!password.length){
			this.showErrorMessage('密码不可为空！');
			return;
		}

		if(!newEmail.length){
			this.showErrorMessage('邮箱不可为空！');
		}

		let emailReg = /^([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(!emailReg.test(newEmail)){
			this.showErrorMessage('邮箱格式错误！');
			return;
		}

		this.setState({disabled:true});

		HostPost('/change-email',{password,newEmail},true).then(({json}) => {
			if(json.error===0){
				this.showErrorMessage('邮箱修改成功！');
				this.handleBack();
				this.props.updateInfo({email:newEmail});
			}else if(json.error==='bad_password'){
				this.showErrorMessage('密码错误！');
				this.setState({disabled:false});
			}else {
				this.showErrorMessage('很抱歉！修改失败');
				this.setState({disabled:false});
			}
		}).catch((error)=>{
			StCatchError(error);
			this.setState({disabled:false});
		})
	};

	showErrorMessage = (errorMessage) => {
		ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
	};

	render(){
		const {disabled} = this.state;

		return (
			<View style={{flex:1,backgroundColor:'#f4f4f4'}}>
				<StNavHead title="修改邮箱" back={this.handleBack}/>

				<View style={{height:20}} />
				<TextInput
					style={styles.stylePasswordInput}
					onChangeText={this.handlePasswordChange}
					underlineColorAndroid={'transparent'}
					placeholder="请输入密码"
					secureTextEntry={true}
					textAlign="center"
				/>

				<View style={{height:30}} />
				<TextInput
					style={styles.stylePasswordInput}
					onChangeText={this.handleNewEmailChange}
					underlineColorAndroid={'transparent'}
					placeholder="新邮箱"
					textAlign="center"
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

});

const mapDispatchToProps = {
	updateInfo:(info) => {
		return {
			type:ACTION_UPDATE_INFO,
			payload:info
		}
	}
};

export default connect(null,mapDispatchToProps)(StChangeEmail);