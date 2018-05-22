/**
 * Created by coder on 2017/2/27.
 */
import React,{Component} from 'react'
import {View,Text,TextInput,StyleSheet,TouchableNativeFeedback,BackAndroid,ToastAndroid} from 'react-native'
import StNavHead from '../StNavHead'
import {HostPost} from '../ajax/index'
import StButton from '../ui/StButton'
import {regExp} from '../const/StRegExp'
import StCatchError from '../StCatchError'

export default class StFeedback extends Component{
	constructor(props){
		super(props);

		this.state = {
			feedback:'',
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

	handleFeedbackChange = (text) => {
		const inputValue = text.replace(regExp, '');
		this.setState({feedback:inputValue});
		if (inputValue){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	handleSubmit = () => {
		const {feedback} = this.state;

		if(!feedback.length){
			this.showErrorMessage('反馈意见不能为空！');
			return;
		}

		this.setState({disabled:true});

		HostPost('/feedback',{content:feedback,client:'app'},true).then(({json}) => {
			if(json.error === 0){
				this.showErrorMessage('提交成功！');
				this.handleBack();
			} else {
				this.showErrorMessage('提交失败！');
				this.setState({disabled:false});
			}
		}).catch((error) => {
			StCatchError(error);
			this.setState({disabled:false});
		});
	};

	showErrorMessage = (errorMessage) => {
		ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
	};

	render(){
		const {disabled,feedback} = this.state;

		return(
			<View style={{flex:1,backgroundColor:'#f4f4f4'}}>
				<StNavHead title="意见反馈" back={this.handleBack} />
				<TextInput
					style={styles.styleFeedbackInput}
					onChangeText={this.handleFeedbackChange}
					underlineColorAndroid={'transparent'}
					placeholder="请输入你的意见反馈"
					value={feedback}
					multiline={true}
				/>
				<StButton title={'提交'} disabled={disabled} onPress={this.handleSubmit} />
			</View>
		);
	}
}

const styles = StyleSheet.create({


	styleFeedbackInput:{
		backgroundColor:'#fff',
		height:250,
		marginTop:10,
		textAlign: "left",
		textAlignVertical: "top"
	},
	styleViewCommit:{
		marginTop:15,
		marginLeft:10,
		marginRight:10,
		backgroundColor:'#63B8FF',
		height:35,
		borderRadius:5,
		justifyContent: 'center',
		alignItems: 'center',
	}
});