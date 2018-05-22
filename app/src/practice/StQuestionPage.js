/**
 * Created by coder on 2017/2/27.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text,BackAndroid,ToastAndroid,TextInput} from 'react-native'
import {connect} from 'react-redux'
import StNavHead from '../StNavHead'
import StQuestion from './StQuestion'
import {HostPost} from '../ajax/index'
import StButton from '../ui/StButton'
import {disorder} from './StDisorder'
import {stringLength} from '../const/StStringLength'
import {ACTION_UPDATE_TASK} from '../store/action'
import {TASK_STATE_FINISH,TASK_STATE_EXPIRE,TASK_STATE_DOING} from '../const/StTaskState'
import {regExp} from '../const/StRegExp'
import StLoadPage from '../ui/StLoadPage'
import StCatchError from '../StCatchError'


const minNumOfWords = 100;      //心得最少字数

/**
 * 用于显示选择题页面，有三种task用到，课前预习，课后作业，实验练习
 */

class StQuestionPage extends Component{
	static propTypes = {
		data:PropTypes.object.isRequired,
		title:PropTypes.string.isRequired
	};

	constructor(props){
		super(props);

		let answers = {content:[],randomStartLoc:null};
		if(this.getTaskState() == TASK_STATE_FINISH) {
			answers = JSON.parse(props.data.content);
		}

		this.state = {
			title:this.props.title,
			content:null,
			index:0,
			orders:null,
			answers:answers,
			startDate:new Date(),
			experience:'',
			editExperience:false,
			submitDisabled:false,
			loadStatus:'loading',
			publicAnswerTime:null,
		};
	}

	handleBack = () => {
		this.props.navigator.pop();
		return true;
	};

	componentWillMount(){
		BackAndroid.addEventListener('hardwareBackPress',this.handleBack);
		/** 从问题库中获取具体的问题内容  */
		HostPost('/get-task-content',{taskId:this.props.data.id},true).then(({json}) => {
			if (json.error===0){
				if(json.publicAnswerTime){
					this.setState({publicAnswerTime:json.publicAnswerTime});
				}
				const questions = json.questions;
				const {orders,answers} = this.state;
				const userInfo = this.props.userInfo;
				const randomStartLoc = answers.randomStartLoc;
				if (!orders&&userInfo&&questions.length){
					this.setState({orders : disorder(questions.length, userInfo.random,randomStartLoc)});
				}
				this.setState({content:questions});
			}else {
				this.setState({loadStatus:'error'})
			}
		}).catch((error) => {
			this.setState({loadStatus:'error'});
			StCatchError(error);
		})
	}

	componentWillUnmount(){
		BackAndroid.removeEventListener('hardwareBackPress',this.handleBack);
	}

	handleNextQuestion = () => {
		const {content,index,answers,orders,experience} = this.state;
		const questionOrder = orders.questionOrder;
		const total = content.length;
		if(total > index + 1 && this.getTaskState() === TASK_STATE_DOING){
			if(answers.content[content[questionOrder[index]].id] === undefined){
				ToastAndroid.show('答完本题后才能跳转到下一题',ToastAndroid.SHORT);
				return;
			}
			this.setState({index:index+1});
		} else if(total == index + 1 && this.getTaskState() === TASK_STATE_DOING) {
			if(answers.content[content[questionOrder[index]].id] === undefined){
				ToastAndroid.show('本题还没有作答',ToastAndroid.SHORT);
				return;
			}
			this.setState({editExperience:true,index:index+1})
		} else if (total == index && this.getTaskState() === TASK_STATE_DOING) {
			if (stringLength(experience)<100){
				ToastAndroid.show('心得体会字数不足',ToastAndroid.SHORT);
				return;
			}
			this.handleSubmit();
		} else if (this.getTaskState() != TASK_STATE_DOING){        //查看状态不用检查是否已选择答案，直接跳转
			if(total > index + 1){
				this.setState({index:index+1});
			}else if(total == index + 1){
				this.setState({editExperience:true,index:index+1})
			}
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
		this.setState({submitDisabled:true});
		switch(this.getTaskState()){
			case TASK_STATE_EXPIRE:
				ToastAndroid.show('任务已经过期',ToastAndroid.SHORT);
				return;
			case TASK_STATE_FINISH:
				ToastAndroid.show('任务已经提交，不能重复提交',ToastAndroid.SHORT);
				return;
		}

		const {answers,experience} = this.state;

		const taskId = this.props.data.id;
		const type = this.props.data.type;
		const time = this.consumeTime();
		const content = JSON.stringify({...answers});

		HostPost('/add-task-report',{taskId,content,type,time,experience},true).then(({json}) => {
			if (json.error===0){
				this.props.updateTask({
					taskId,
					content,
					type,
					score:json.score,
					experience,
				});

				ToastAndroid.show('提交成功',ToastAndroid.SHORT);
				this.handleBack();
			}else {
				ToastAndroid.show('提交失败',ToastAndroid.SHORT);
				this.setState({submitDisabled:false});
			}
		}).catch((error) => {
			StCatchError(error);
			this.setState({submitDisabled:false});
		})

	};

	handlePreviousQuestion = () => {
		const {index,content} = this.state;
		const total = content.length;
		if(index == total){
			this.setState({editExperience:false,index:index-1});
		} else if(index === 0){
			ToastAndroid.show('已经是第一题了',ToastAndroid.SHORT);
		} else if(index > 0){
			this.setState({index:index-1});
		}
	};

	handleSelect = (answer) => {
		const {index,content,answers,orders} = this.state;
		const questionOrder = orders.questionOrder;
		const randomStartLoc = orders.randomStartLoc;
		let newAnswersContent = Object.assign({},answers.content,{[content[questionOrder[index]].id]:answer});
		// console.log(newAnswersContent);
		this.setState({answers:{content:newAnswersContent,randomStartLoc:randomStartLoc}});
	};

	//计时
	consumeTime = () => {
		const endDate = new Date();
		const startDate = this.state.startDate;

		const millisecond = endDate.getTime()-startDate.getTime();//毫秒

		return Math.round(millisecond / 1000);//秒
	};

	handleChangeExperience = (text) => {
		this.setState({experience:text.replace(regExp, '')});
	};

	render(){
		const {index,content,answers,orders,editExperience,experience,submitDisabled,loadStatus,title,publicAnswerTime} = this.state;
		const taskStatus = this.getTaskState();
		if(!content){
			return (
				<View style={{flex:1,backgroundColor:'#f4f4f4'}}>
					<StNavHead title={title} back={this.handleBack} />
					<StLoadPage loadStatus={loadStatus}/>
				</View>
			);
		}
		const total = content.length;
		return (
			<View style={{flex:1,backgroundColor:'#f4f4f4'}}>
				<StNavHead title={title} back={this.handleBack} />
				{
					editExperience?
						(
							this.getTaskState() === TASK_STATE_DOING?
								(
									<View>
										<TextInput placeholder='心得体会...'
										           multiline={true}
										           underlineColorAndroid="transparent"
										           value={experience}
										           onChangeText={this.handleChangeExperience}
										           style={{backgroundColor:'#fff', height:250 , textAlign: "left", textAlignVertical: "top",fontSize:18 , lineHeight:20 }}
										/>
										<Text style={{textAlign:'right',marginRight:5,marginBottom:10,fontSize:15,alignSelf:'flex-end',height:20}}>
											{
												minNumOfWords>stringLength(experience)>0?
													<Text>还差<Text style={{color:'red'}}>{minNumOfWords-stringLength(experience)}</Text>字</Text>
													:
													null
											}
										</Text>
										<Text style={{margin:10,marginBottom:5,fontSize:14}}>谈谈你的感悟；你对本次题目所涉及知识点的理解、掌握程度；本次题目的难易程度等等</Text>
									</View>
								)
								:
								(
									<View>
										<View style={{flexDirection:'row',justifyContent:'space-between'}}>
											<Text style={{margin:10,fontSize:20}}>心得体会：</Text>
										</View>
										<TextInput multiline={true}
										           underlineColorAndroid="transparent"
										           value={this.props.data.experience}
										           style={{backgroundColor:'#fff', height:300, textAlign: "left", textAlignVertical: "top"}}
										/>
									</View>
								)
						)
						:
						(
							<StQuestion index={index}
							            content={content}
							            select={this.handleSelect}
							            answer={answers.content[content[orders.questionOrder[index]].id]}
							            orders={orders}
							            referenceAnswer={publicAnswerTime ? publicAnswerTime : content[orders.questionOrder[index]].answers}
							            taskStatus={taskStatus}
							/>
						)
				}
				<View style={{flexDirection:'row'}}>
					<StButton onPress={this.handlePreviousQuestion}
					          title={
						          taskStatus===TASK_STATE_DOING?
							          '上一题'
							          :
							          '查看上一题'
					          }
					          style={{flex:1}}
					          disabled={submitDisabled}
					/>
					{
						taskStatus!==TASK_STATE_DOING && index==total?
							null
							:
							<StButton onPress={this.handleNextQuestion}
							          style={{flex:1}}
							          disabled={submitDisabled}
							          title={index+1 < total ?
								          taskStatus===TASK_STATE_DOING?
									          '下一题'
									          :
									          '查看下一题'
								          :
								          index+1 == total?
									          taskStatus===TASK_STATE_DOING?
										          '填写心得'
										          :
										          '查看心得'
									          :
									          '提交'
							          }
							/>
					}
				</View>
			</View>
		);
	}
}


const mapStateToProps = (state) => {
	return{
		userInfo:state['auth']['userInfo']
	}
};

const mapDispatchToProps = {
	updateTask:(info) => {
		return {
			type:ACTION_UPDATE_TASK,
			payload:info
		}
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StQuestionPage);