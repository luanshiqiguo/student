/**
 * Created by coder on 2017/2/20.
 */
import React,{Component,PropTypes} from 'react'
import {View,Image,Text,TouchableNativeFeedback,StyleSheet,Alert,Platform,ToastAndroid,ScrollView} from 'react-native'
import {checkUpdate, downloadUpdate, switchVersion, switchVersionLater} from 'react-native-update'
import _updateConfig from '../../update.json'
import {connect} from 'react-redux'
import {ACTION_SIGN_OUT} from '../store/action'
import {Icon} from 'react-native-elements'
import StNavHead from '../StNavHead'
import {HostPost} from '../ajax/index'
import {ROUTE_SIGN_IN,ROUTE_CHANGE_PASSWORD,ROUTE_FEEDBACK,ROUTE_ABOUT,ROUTE_EMAIL,ROUTE_USER_INFO,ROUTE_CHANGE_LOG} from '../const/StRoute'
import StCatchError from '../StCatchError'

const {appKey} = _updateConfig[Platform.OS];

export const doUpdate = info => {
	downloadUpdate(info).then(hash => {
		Alert.alert('提示', '下载完毕,是否重启应用?', [
			{text: '是', onPress: ()=>{switchVersion(hash);}},
			{text: '否',},
			{text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
		]);
	}).catch(err => {
		Alert.alert('提示', '更新失败.');
	});
};

class StMeMenuItem extends Component{
	static propTypes = {
		title:PropTypes.string.isRequired,
		icon:PropTypes.string.isRequired,
		onLink:PropTypes.func.isRequired,
	};

	render(){
		const {title,icon,onLink} = this.props;
		return(
				<TouchableNativeFeedback onPress={onLink}>
				<View style={{flexDirection:'row',height:55,backgroundColor:'#fff'}}>
					<View style={{flex:1,justifyContent:'center'}}>
						<Icon name={icon} size={28} color={'#5e6977'}/>
					</View>
					<View style={{flexDirection:'row',borderTopWidth:1,flex:6,borderTopColor:'#eee',justifyContent:'space-between',paddingRight:10,alignItems:'center'}}>
						<Text style={{fontSize:16,color:'#5e6977',height:50,textAlignVertical:'center'}}>{title}</Text>
						<Icon name='navigate-next' size={20} color={'#5e6977'}/>
					</View>

				</View>
				</TouchableNativeFeedback>
		);
	}
}

class StMe extends Component{
	static propTypes = {
		navigator:PropTypes.object.isRequired,
		userInfo:PropTypes.object.isRequired,
	};

	handleLogout = () => {
		Alert.alert(
			'退出提示',
			'您确认退出当前账号吗？',
			[
				{text: '取消', onPress: () => {}},
				{text: '确认', onPress: () => {
					const token = this.props.token;
					HostPost('/sign-out',{token:token},true);
					this.props.signOut();
					this.props.navigator.replace(ROUTE_SIGN_IN);
				}},
			]
		);
	};

	handleChangePassword = () => {
		this.props.navigator.push(ROUTE_CHANGE_PASSWORD);
	};

	handleFeedback = () => {
		this.props.navigator.push(ROUTE_FEEDBACK);
	};

	handleChangeLog = () => {
		this.props.navigator.push(ROUTE_CHANGE_LOG);
	};

	handleAbout = () => {
		this.props.navigator.push(ROUTE_ABOUT);
	};

	handleInfo = () => {
		this.props.navigator.push(ROUTE_USER_INFO);
	};

	checkUpdateApp = () => {
		checkUpdate(appKey).then(info => {
			if (info.expired) {
				Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
					{text: '确定', onPress: ()=>{}},
				]);
			} else if (info.upToDate) {
				Alert.alert('提示', '您的应用版本已是最新.');
			} else {
				Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
					{text: '是', onPress: ()=>{doUpdate(info)}},
					{text: '否',},
				]);
			}
		}).catch((error) => {
			Alert.alert('提示', '更新失败.');
		});
	};

	render(){
		const {userInfo} = this.props;
		return (
			<View style={{backgroundColor:'#f4f4f4',flex:1}}>
				<StNavHead title="我的"/>
				<ScrollView>
					<TouchableNativeFeedback onPress={this.handleInfo}>
						<View style={{height:80,flexDirection:'row',backgroundColor:'#fff'}}>
								<Image
									style={styles.style_image}
									source={require('../../img/logo123.png')}/>
								<View style={{marginTop:20,marginLeft:20}}>
									<Text style={{fontSize:16,color:'#5e6977'}}>{userInfo['name']}</Text>
									<Text style={{fontSize:10,color:'#6f7a88',marginTop:10}}>查看/编辑个人信息</Text>
								</View>
						</View>
					</TouchableNativeFeedback>
					<View style={{height:10}}/>
					<StMeMenuItem title="修改密码" icon="lock-outline" onLink={this.handleChangePassword}/>
					<StMeMenuItem title="意见反馈" icon="chat-bubble-outline" onLink={this.handleFeedback}/>
					<StMeMenuItem title="更新日志" icon="event-note" onLink={this.handleChangeLog}/>
					<StMeMenuItem title="检查更新" icon="autorenew" onLink={this.checkUpdateApp}/>
					<StMeMenuItem title="关于" icon="info-outline" onLink={this.handleAbout}/>
					<View style={{height:40}}/>
					<StMeMenuItem title="退出登录" icon="power-settings-new" onLink={this.handleLogout}/>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	style_image:{
		borderRadius:35,
		height:60,
		width:60,
		marginLeft:10,
		alignSelf:'center',
	},
});


const mapStateToProps = (state) => {
	return {
		userInfo : state['auth']['userInfo'],
		token:state['auth']['token']
	};
};

const mapDispatchToProps = {
	signOut:() => {
		return {
			type:ACTION_SIGN_OUT
		}
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StMe);