/**
 * Created by coder on 2017/2/19.
 */
import React,{Component} from 'react'
import {Navigator,Platform,Alert,StatusBar,View} from 'react-native'
import {isFirstTime, isRolledBack, checkUpdate, markSuccess} from 'react-native-update';
import {connect} from 'react-redux'

import {ROUTE_WELCOME,ROUTE_SIGN_IN,ROUTE_MAIN,ROUTE_CHANGE_PASSWORD,ROUTE_FORGET_PASSWORD,ROUTE_FEEDBACK,ROUTE_ABOUT,ROUTE_QUESTION_PAGE,ROUTE_SUMMARY_PAGE,ROUTE_TEST,ROUTE_EMAIL,ROUTE_USER_INFO,ROUTE_CHANGE_LOG,ROUTE_ANSWER_PAGE,ROUTE_SEARCH_PAGE} from './const/StRoute'

import StWelcome from './StWelcome'
import StSignIn from './StSignIn'
import StMain from './StMain'
import _updateConfig from '../update.json';
import {doUpdate} from './me/StMe'
import StChangePassword from './me/StChangePassword'
import StForgetPassword from './StForgetPassword'
import StFeedback from './me/StFeedback'
import StChangeEmail from './me/StChangeEmail'
import StAbout from './me/StAbout'
import StUserInfo from './me/StUserInfo'
import StQuestionPage from './practice/StQuestionPage'
import StSummaryPage from './summary/StSummaryPage'
import StTest from './StTest'
import StChangeLog from './me/StChangeLog'
import StSearchPage from  './questionAnswer/StSearchPage'

const {appKey} = _updateConfig[Platform.OS];

class StNavigator extends Component{
	constructor(props){
		super(props);
	}

	componentWillMount(){
		if (isFirstTime) {
			markSuccess();
		}

		if (isRolledBack) {
			Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
		}

		checkUpdate(appKey).then(info => {
			if(info.update) {
				Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
					{text: '是', onPress: ()=>{doUpdate(info)}},
					{text: '否',},
				]);
			}
		}).catch(err => {});
	}

	render() {
		return (
			<View style={{flex:1}}>
				<StatusBar
					backgroundColor='rgba(0,0,0,0)'
					barStyle="light-content"
					translucent ={true}
				/>
				<Navigator
					initialRoute={ROUTE_WELCOME}
					configureScene={(route) => {
						return Navigator.SceneConfigs.FloatFromBottomAndroid;
					}}
					renderScene={this.renderScene}
				/>
			</View>
		);
	}

	renderScene = (route,navigator) => {
		if (route.name === ROUTE_WELCOME.name){
			return (
				<StWelcome navigator={navigator}/>
			);
		} else if (route.name === ROUTE_SIGN_IN.name){
			return (
				<StSignIn navigator={navigator}/>
			);
		} else if(route.name === ROUTE_MAIN.name){
			return (
				<StMain navigator={navigator} />
			);
		} else if(route.name === ROUTE_CHANGE_PASSWORD.name){
			return (
				<StChangePassword navigator={navigator} />
			);
		} else if(route.name === ROUTE_FORGET_PASSWORD.name){
			return (
				<StForgetPassword navigator={navigator} />
			);
		} else if(route.name === ROUTE_FEEDBACK.name){
			return (
				<StFeedback navigator={navigator} />
			);
		} else if(route.name === ROUTE_USER_INFO.name){
			return (
				<StUserInfo navigator={navigator} />
			);
		} else if(route.name === ROUTE_EMAIL.name){
			return (
				<StChangeEmail navigator={navigator} />
			);
		} else if(route.name === ROUTE_CHANGE_LOG.name){
			return (
				<StChangeLog navigator={navigator}/>
			);
		}  else if(route.name === ROUTE_ABOUT.name){
			return (
				<StAbout navigator={navigator}/>
			);
		} else if(route.name === ROUTE_QUESTION_PAGE.name){
			return (
				<StQuestionPage navigator={navigator} data={route.data} title={route.title}/>
			);
		} else if(route.name === ROUTE_SUMMARY_PAGE.name){
			return (
				<StSummaryPage navigator={navigator} data={route.data}/>
			);
		} else if(route.name === ROUTE_TEST.name){
			return (
				<StTest />
			);
		} else if(route.name === ROUTE_SEARCH_PAGE.name){
			return (
				<StSearchPage navigator={navigator} data={route.data?route.data:false}/>
			);
		}
		return (
			<StSignIn navigator={navigator}/>
		);
	};
}

const mapStateToProps = (state) => {
	return {
		auth : state['auth']
	};
};

export default connect(mapStateToProps)(StNavigator);