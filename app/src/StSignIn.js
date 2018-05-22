/**
 * Created by coder on 2017/2/19.
 */
import React,{Component} from 'react'
import {View,Text,TextInput,Image,StyleSheet,TouchableNativeFeedback, BackAndroid,ToastAndroid } from 'react-native'
import {connect} from 'react-redux'
import {ACTION_SIGN_IN} from '../src/store/action'
import {ACTION_UPDATE_TASK_LISTS} from './store/action'
import {TASK_STATE_INDEX} from './const/StTaskType'
import {HostPost} from './ajax/index'
import {ROUTE_MAIN,ROUTE_FORGET_PASSWORD} from './const/StRoute'
import StButton from './ui/StButton'
import StCatchError from './StCatchError'

class StSignIn extends Component{
	constructor(props){
		super(props);
		this.state = {
			stuId:'',
			password:'',
			disabled: true,
			waitSec:0,
		}
	}

	/*按两下back键退出程序（android）*/
	handleBack = () => {
		if(this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()){
			return false;
		}

		this.lastBackPressed = Date.now();
		ToastAndroid.show('在按一次退出应用',ToastAndroid.SHORT);
		return true;
	};

	componentWillMount() {
		BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
	}

	componentWillUnmount() {
		BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
	}

	handleUsernameChange = (text) => {
		this.setState({stuId:text});
		const {password} = this.state;
		if(text&&password){
			this.setState({disabled:false})
		}else {
			this.setState({disabled:true})
		}
	};

	handlePasswordChange = (text) => {
		this.setState({password:text});
		const {stuId} = this.state;
		if(text&&stuId){
			this.setState({disabled:false})
		}else {
			this.setState({disabled:true})
		}
	};

	handleLogin = () => {
		const {stuId,password} = this.state;
		if(!stuId.length){
			this.showErrorMessage('用户名不能为空');
			return;
		}

		if(!password.length){
			this.showErrorMessage('密码不能为空');
			return;
		}

		this.setState({disabled:true});

		HostPost('/sign-in',{stuId,password})
			.then(({json,header}) => {
				if(json.error === 0){
					this.props.signIn(json);
					this.props.navigator.replace(ROUTE_MAIN);
					//1,2,3,4表示四种任务类型
					HostPost('/get-task-list-ex',{taskTypes:[1,2,3,4]},true).then(({json}) => {
						if (json.error===0){
							let tasks = {
								[TASK_STATE_INDEX[1]]:[],
								[TASK_STATE_INDEX[2]]:[],
								[TASK_STATE_INDEX[3]]:[],
								[TASK_STATE_INDEX[4]]:[],
							};

							json.list.map((item) => {
								tasks[TASK_STATE_INDEX[item.type]].push(item);
							});

							this.props.updateTaskLists(tasks)
						}else {
							this.showErrorMessage(json.error);
						}
					}).catch((error) => {
						StCatchError(error);
					});
				} else {
					if(json.message === 'You have exceeded your rate limit.'){
						let waitSec = parseInt(header.get('retry-after'))+3;
						this.setState({waitSec:waitSec--});
						this.showErrorMessage('登录操作过于频繁，请稍后再试');
						const waitTimer = setInterval(() => {
							this.setState({waitSec:waitSec--});
							if(waitSec < 0){
								clearInterval(waitTimer);
							}
						},1000)
					} else {
						this.showErrorMessage('用户名或者密码错误');
					}
					this.setState({disabled:false});
				}
			})
			.catch(() => {
				this.showErrorMessage('网络错误！请稍后重试');
				this.setState({disabled:false});
			});
	};

	showErrorMessage = (errorMessage) => {
		ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
	};

	handleForgetPassword = () => {
		this.props.navigator.push(ROUTE_FORGET_PASSWORD);
	};

	render(){
		const {disabled,waitSec} = this.state;

		return (
			<View style={{backgroundColor:'#f4f4f4',flex:1,paddingTop:20}}>
				<Image
					style={styles.styleImage}
					source={require('../img/logo123.png')}/>
				<TextInput
					style={styles.styleUserInput}
					onChangeText={this.handleUsernameChange}
                    underlineColorAndroid={'transparent'}
					placeholder="学号"
				    textAlign="center"
				    autoFocus={true}
				    keyboardType='numeric'
				/>
				<View
					style={{height:1,backgroundColor:'#f4f4f4'}}
				/>
				<TextInput
					style={styles.stylePasswordInput}
					onChangeText={this.handlePasswordChange}
					underlineColorAndroid={'transparent'}
					placeholder="密码"
					secureTextEntry={true}
					textAlign="center"
				/>

				<StButton title={waitSec > 0 ? '登录( ' + waitSec + ' )': '登录'} onPress={this.handleLogin} disabled={disabled || waitSec > 0}/>
				<View style={{flexDirection:'row',justifyContent:'flex-end'}}>
					<Text style={{margin:20}} onPress={this.handleForgetPassword}>忘记密码？</Text>
				</View>

				<View style={{flex:1,flexDirection:'row',alignItems: 'flex-end',bottom:10,justifyContent:'center'}}>
					<Text style={{fontSize:8}} >Copyright © 2016 | app by lab1105</Text>
				</View>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	styleImage:{
		borderRadius:35,
		height:70,
		width:70,
		marginTop:40,
		alignSelf:'center',
	},
	styleUserInput:{
		backgroundColor:'#fff',
		marginTop:10,
		height:45,
	},
	stylePasswordInput:{
		backgroundColor:'#fff',
		height:45,
	},

});

const mapDispatchToProps = {
	signIn:(info) => {
		return {
			type:ACTION_SIGN_IN,
				payload:info
		}
	},
	updateTaskLists:(info) => {
		return {
			type:ACTION_UPDATE_TASK_LISTS,
			payload:info
		}
	}
};

export default connect(null,mapDispatchToProps)(StSignIn);
