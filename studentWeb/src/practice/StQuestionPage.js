/**
 * Created by coder on 2017/3/14.
 */
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {notification,Button,Input} from 'antd'
import {ACTION_UPDATE_TASK_LISTS,ACTION_UPDATE_TASK} from '../store/action'
import {HostPost} from '../ajax'
import {stringLength} from '../common/StStringLength'
import StChoiceQuestionEdit from './StChoiceQuestionEdit'
import StChoiceQuestionStatic from './StChoiceQuestionStatic'
import {TASK_STATE_FINISH,TASK_STATE_EXPIRE,TASK_STATE_DOING} from '../common/constDefine'

import {disorder} from '../common/StDisorder'

const minNumOfWords = 100;

class StQuestionPage extends Component{
	constructor(props){
		super(props);

		this.task = {
			taskId:parseInt(props.routeParams.taskId),
			taskType:parseInt(props.routeParams.taskType),
		};

		this.state = {
			loading:true,
			error:false,
			task:{},
			questions:[],
			choice:{},
			orders:null,
			startDate:new Date(),
			experience:'',
			publicAnswerTime:null,
		}
	}

	getTaskState = (data) =>{
		if(data.content){
			return TASK_STATE_FINISH;
		}
		return data.expire ? TASK_STATE_EXPIRE : TASK_STATE_DOING;
	};

	fetch = (params = {}) => {
		HostPost('/get-task-content',{...params},true).then(({json}) => {
			if(json.error === 0){
				json.questions.map((item) => {
					const question = JSON.parse(item.content);
					item.question = question.question;
					item.options = question.options;
				});

				if(json.publicAnswerTime){
					this.setState({publicAnswerTime:json.publicAnswerTime});
				}

				if(params.withTask){
					this.setState({task:json.task,questions:json.questions,loading:false});
				} else {
					this.setState({questions:json.questions,loading:false});
				}

				const task = json.task ? json.task : this.state.task;
				this.notifyReorderQuestions(this.props.userInfo,json.questions,task);
			} else {
				throw json;
			}
		}).catch((error) => {
			this.setState({loading:false});
			// console.log(error);
			notification.error({
				message: '温馨提示',
				description: '获取用户数据失败.',
			});
		});
	};

	getTaskData = (taskType) => {
		const {taskPreview,taskHomework,taskExperiment} = this.props;
		switch (taskType){
			case 1:return taskPreview;
			case 2:return taskHomework;
			case 3:return taskExperiment;
			default:return false;
		}
	};

	getTaskString = (taskType) => {
		switch (taskType){
			case 1:return '课前预习';
			case 2:return '课后作业';
			case 3:return '实验练习';
		}
	};

	setTaskDataItem = (taskList) => {
		const {taskId} = this.task;
		for(let i in taskList){
			if(taskList[i].id === taskId){
				this.setState({task:taskList[i]});
				return true;
			}
		}
		return false;
	};

	componentDidMount() {
		const {taskId,taskType} = this.task;
		const taskList = this.getTaskData(taskType);
		if(taskList === false){
			this.setState({error:true,loading:false});
		} else if(!taskList){
			this.fetch({taskId,withTask:true})
		} else {
			if(!this.setTaskDataItem(taskList)){
				this.setState({error:true,loading:false});
			} else {
				this.fetch({taskId});
			}
		}
	}

	notifyReorderQuestions = (userInfo,questions,task) => {
		const {orders} = this.state;
		if(!questions.length || !userInfo || orders){
			return;
		}

		let randomStartLoc=null;
		if(task && task.content){
			randomStartLoc = JSON.parse(task.content).randomStartLoc;
		}

		this.setState({orders : disorder(questions.length, userInfo.random,randomStartLoc)});
	};

	componentWillReceiveProps(nextProps){
		this.notifyReorderQuestions(nextProps.userInfo,this.state.questions,this.state.task);
	}

	handleChangeChoice = (index,e) => {
		this.setState({choice:Object.assign(this.state.choice,{[index]:e.target.value})});
	};

	handleSubmit = () => {
		const {taskId,taskType} = this.task;
		const {questions,choice,orders,experience} = this.state;

		for(let i in questions){
			if(choice[questions[i].id] === undefined){
				notification.error({
					message: '温馨提示',
					description: '还有题目没有作答.',
				});
				return;
			}
		}

		if(stringLength(experience)<minNumOfWords){
			notification.error({
				message: '温馨提示',
				description: '学习心得字数不足.',
			});
			return;
		}

		const content = JSON.stringify({content:choice,randomStartLoc:orders.randomStartLoc});
		const time = this.consumeTime();
		HostPost('/add-task-report',{taskId,content,type:taskType,time,experience},true).then(({json}) => {
			if (json.error===0){
				this.props.updateTask({
					taskId,
					content,
					type:taskType,
					score:json.score,
					experience:experience,
					experienceScore:null,
				});

				notification.success({
					message: '温馨提示',
					description: '任务提交成功.',
				});

				this.goBack();
			}else {
				throw json;
			}
		}).catch((error) => {
			// console.log(error);
			notification.error({
				message: '温馨提示',
				description: '任务提交失败.',
			});
		})
	};

	goBack = () => {
		this.props.router.push('/practice');
	};

	//计时
	consumeTime = () => {
		const endDate = new Date();
		const startDate = this.state.startDate;

		const millisecond = endDate.getTime()-startDate.getTime();//毫秒

		return Math.round(millisecond / 1000);//秒
	};

	handleChangeExperience = (e) => {
		this.setState({experience:e.target.value})
	};

	render(){
		const {loading,error,task,questions,orders,experience,publicAnswerTime} = this.state;
		const taskState = this.getTaskState(task);

		let message = '';
		if(loading||!orders){message = 'loading';}
		if(error){message = '习题练习，加载的数据错误';}
		if(taskState === TASK_STATE_EXPIRE){message = '任务已经过期';}

		if(message){
			return (
				<div className="main-box"  style={{padding:'30px 20px'}}>
					{message}
				</div>
			);
		}

		let answers = {};
		if(taskState === TASK_STATE_FINISH){
			answers = JSON.parse(task.content).content;
		}

		return(
			<div className="main-box"  style={{padding:'30px 40px'}}>
				<h1 style={{fontSize:24}}>
					<Button shape="circle" icon="arrow-left" size="large" type="primary" style={{marginLeft:'20px',marginRight:'20px',verticalAlign:'middle'}} onClick={this.goBack}/>
					{this.getTaskString(task.type)}-{task.title}
					<small> {task.target}</small>
				</h1>
				<div style={{marginRight:'auto',marginLeft:'auto',width:'90%'}}>
					<div>
						{
							orders.questionOrder.map((item,index) => {
								return taskState === TASK_STATE_DOING ?
									(
										<StChoiceQuestionEdit
											question={questions[item].question}
											options={questions[item].options}
											questionId={questions[item].id}
											optionsOrder={orders.optionOrder[index]}
											index={index}
											key={index}
											onChange={this.handleChangeChoice}
										/>
									)
									:
									(
										<StChoiceQuestionStatic
											question={questions[item].question}
											options={questions[item].options}
											referenceAnswer={publicAnswerTime ? publicAnswerTime : questions[item].answers}
											optionsOrder={orders.optionOrder[index]}
											index={index}
											key={index}
											answer={answers[questions[item].id]}
										/>
									)
							})

						}
					</div>
					{
						taskState === TASK_STATE_DOING ?
							(
								<div>
									<div>
										<h3 style={{display:'inline'}}>心得体会:</h3>
										{
											minNumOfWords>stringLength(experience)?
												<span style={{float:'right'}}>还差<span style={{color:'red'}}>{minNumOfWords-stringLength(experience)}</span>字</span>
												:
												null
										}
									</div>
									<Input type="textarea"
									       placeholder="在此输入你的心得体会:（谈谈你的感悟；你对本次题目所涉及知识点的理解、掌握程度；本次题目的难易程度等等）"
									       autosize={{ minRows: 8}}
									       style={{marginTop:10,fontSize:15}}
									       onChange={this.handleChangeExperience}
									       value={experience}
									/>
								</div>
							)
							:
							(
								<div>
									<h3 >心得体会:</h3>
									<Input type="textarea"
									       style={{marginTop:10,fontSize:15}}
									       value={task.experience}
									       autosize={{ minRows: 5}}
									/>
								</div>
							)
					}
					{
						taskState === TASK_STATE_DOING ?
							(
								<div style={{marginTop:20,justifyContent:'center',display:'flex'}}>
									<Button onClick={this.goBack}>取消</Button>
									<Button type="primary" style={{marginLeft:20}}  onClick={this.handleSubmit}>提交</Button>
								</div>
							)
							:
							null
					}
				</div>
			</div>
		);
	}

}


const mapStateToProps = (state) => {
	return {
		taskPreview:state.task.taskPreview,
		taskHomework:state.task.taskHomework,
		taskExperiment:state.task.taskExperiment,
		userInfo:state.auth.userInfo,
	};
};

const mapDispatchToProps = {
	updateTaskLists:(info) => {
		return {
			type:ACTION_UPDATE_TASK_LISTS,
			payload:info
		}
	},
	updateTask:(info) => {
		return {
			type:ACTION_UPDATE_TASK,
			payload:info
		}
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StQuestionPage);