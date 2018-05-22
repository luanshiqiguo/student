/**
 * Created by coder on 2017/3/7.
 */
import React,{Component} from 'react'
import {Rate,notification,Card} from 'antd'
import {HostPost} from '../ajax'
import './StStudentTaskDetail.css'
import StChoiceQuestion from '../question/StChoiceQuestion'
import {TASK_TYPE_SUMMARY} from '../common/constDefine'

class StShortQuestion extends Component{
	render(){
		const {content,selfScore,score} = this.props;
		return (
			<div className="short-question">
				<Card title="总结" extra={<h4>总结得分：{score}</h4>} style={{ width: '80%' ,marginBottom:20}}>
					{content}
				</Card>
				<h3 style={{display:'inline',marginLeft:20}}>自评分：</h3>
				<div style={{padding:'8px 10px',display:'inline'}}>
					<Rate value={selfScore} />
				</div>
			</div>
		);
	}
}

export default class StStudentTaskDetail extends Component{
	constructor(props){
		super(props);
		this.state = {
			currentTaskId:0,
			questions:null,
		};
	}

	fetch = () => {
		const {type} = this.props.record;
		const {taskId} = this.props;
		const {currentTaskId} = this.state;

		if(taskId === currentTaskId || type === TASK_TYPE_SUMMARY){
			return this.state.questions;
		}

		HostPost('/get-task-content',{taskId:taskId},true).then(({json}) => {
			if(json.error === 0){
				this.setState({questions:json.questions,currentTaskId:taskId});
			} else {
				throw json;
			}
		}).catch((error) => {
			console.log(error);
			notification.error({
				message: '温馨提示',
				description: '获取任务数据失败.',
			});
		});

		return null;
	};


	render() {
		const {currentTaskId} = this.state;
		const {title,target,content,type,score,experience,experienceScore} = this.props.record;
		const {taskId} = this.props;
		if(!currentTaskId && !taskId){
			return (<div>请先选择需要查看的任务...</div>);
		}

		let contentTags = null;
		if(type === TASK_TYPE_SUMMARY){
			//content 为taskreport表中content字段内容
			const answer = JSON.parse(content);
			return (
				<div className="task-detail">
					<h1>{title} <small>{target}</small></h1>
					<StShortQuestion content={answer.content} selfScore={answer.score} score={score}/>
				</div>
			);
		} else {
			const questions = this.fetch();
			if(!questions){
				return (
					<div className="task-detail">
						<div>正在加载中...</div>
					</div>
				);
			} else {
				contentTags = questions.map((item,index) => {
					//content 为taskreport表中content字段内容
					//item.content 为questionbank表中的content字段内容
					const question = JSON.parse(item.content);
					const answer = JSON.parse(content).content;
					return (
						<StChoiceQuestion key={index} index={index} answer={answer[item.id]} question={question.question} options={question.options} score={score}/>
					);
				});
				return (
					<div className="task-detail">
						<h1>{title} <small>{target}</small></h1>
						<Card title="选择题" extra={<h4>选择题得分：{score}</h4>} style={{ width: '70%' ,marginBottom:10}}>
							{contentTags}
						</Card>
						<Card title="心得体会" extra={<h4>心得体会评分：{experienceScore}</h4>} style={{ width: '70%' ,marginBottom:10}}>
							{experience}
						</Card>
					</div>
				);
			}
		}

	}
}