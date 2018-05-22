/**
 * Created by coder on 2017/2/28.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text,TextInput,StyleSheet,TouchableNativeFeedback,BackAndroid,ToastAndroid} from 'react-native'
import {connect} from 'react-redux'
import StNavHead from '../StNavHead'
import {HostPost} from '../ajax/index'
import Popup from 'react-native-popup'
import StSelfEvaluation from './StSelfEvaluation'
import {ACTION_UPDATE_TASK} from '../store/action'
import {TASK_STATE_FINISH,TASK_STATE_EXPIRE,TASK_STATE_DOING} from '../const/StTaskState'
import StButton from '../ui/StButton'
import {regExp} from '../const/StRegExp'
import StCatchError from '../StCatchError'

class StSummaryPage extends Component{
	static propTypes = {
		data:PropTypes.object.isRequired
	};

	constructor(props){
		super(props);

		let summary = '';
		let evaluation = 0;
		if(this.getTaskState() === TASK_STATE_FINISH){
			// console.log(props.data.content);
			let content = JSON.parse(props.data.content);
			summary = content.content;
			evaluation = content.score;
		}

		this.state = {
			summary:summary,
			evaluation:evaluation,
			disabled:true,
			startDate:new Date(),
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

	handleSummaryChange = (text) => {
		const inputValue = text.replace(regExp, '');
		this.setState({summary:inputValue});
		const {evaluation} = this.state;
		if(inputValue&&evaluation&&this.getTaskState()===TASK_STATE_DOING){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	getTaskState = () =>{
		const {data} = this.props;
		if(data.content){
			return TASK_STATE_FINISH;
		}
		return data.expire ? TASK_STATE_EXPIRE : TASK_STATE_DOING;
	};

	handleSubmit = () => {
		switch(this.getTaskState()){
			case TASK_STATE_EXPIRE:
				ToastAndroid.show('任务已经过期',ToastAndroid.SHORT);
				return;
			case TASK_STATE_FINISH:
				ToastAndroid.show('任务已经提交，不能重复提交',ToastAndroid.SHORT);
				return;
		}

		const taskId = this.props.data.id;
		const type = this.props.data.type;
		const time = this.consumeTime();

		const {summary,evaluation} = this.state;

		if(!summary.length){
			ToastAndroid.show('总结不能为空',ToastAndroid.SHORT);
			return;
		}

		if(evaluation <= 0){
			ToastAndroid.show('自我评价不能为空',ToastAndroid.SHORT);
			return;
		}

		this.setState({disabled:true});

		let submitContent = {
			content: summary,
			score: evaluation,
		};

		const content = JSON.stringify(submitContent);

		HostPost('/add-task-report',{taskId,type,content,time},true).then(({json}) => {
			if(json.error === 0){
				this.props.updateTask({
					taskId,
					content,
					type,
					score:0,
				});

				ToastAndroid.show('提交成功！',ToastAndroid.SHORT);
				this.handleBack();
			} else {
				// console.log(json);
				ToastAndroid.show('提交失败！',ToastAndroid.SHORT);
				this.setState({disabled:false});
			}
		}).catch((error) => {
			StCatchError(error);
			this.setState({disabled:false});
		});
	};

	handleEvaluationChange = (score) => {
		this.setState({evaluation:score});
		const {summary} = this.state;
		if(score&&summary&&this.getTaskState()===TASK_STATE_DOING){
			this.setState({disabled:false});
		}else {
			this.setState({disabled:true});
		}
	};

	//计时
	consumeTime = () => {
		const endDate = new Date();
		const startDate = this.state.startDate;

		const millisecond = endDate.getTime()-startDate.getTime();//毫秒

		return Math.round(millisecond / 1000);//秒
	};

	render(){
		const {summary,evaluation,disabled} = this.state;

		return(
			<View style={{flex:1,backgroundColor:'#f4f4f4'}}>
				<StNavHead title="每周总结" back={this.handleBack} />
				<TextInput
					style={styles.styleFeedbackInput}
					onChangeText={this.handleSummaryChange}
					underlineColorAndroid={'transparent'}
					placeholder="每周总结...(自己本周的感悟，学到了什么等等)"
					value={summary}
					multiline={true}
				/>
				<View style={{flexDirection:'row',marginLeft:10,marginTop:20,alignItems:'center'}}>
					<Text style={{fontSize:17}}>自我评价：</Text>
					<StSelfEvaluation onChange={this.handleEvaluationChange} style={{marginLeft:10}} score={evaluation}/>
				</View>
				{
					this.getTaskState()===TASK_STATE_DOING?
						<StButton title="提交" disabled={disabled} onPress={this.handleSubmit}/>
						:
						null
				}
				<Popup ref={popup => this.popup = popup } />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	styleFeedbackInput:{
		backgroundColor:'#fff',
		height:250,
		textAlign: "left",
		textAlignVertical: "top",
		fontSize:18
	}
});

const mapDispatchToProps = {
	updateTask:(info) => {
		return {
			type:ACTION_UPDATE_TASK,
			payload:info
		}
	}
};



export default connect(null,mapDispatchToProps)(StSummaryPage);