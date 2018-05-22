/**
 * Created by coder on 2017/3/13.
 */
import React,{Component,PropTypes} from 'react'
import {Button,notification} from 'antd'
import {HostPost} from '../ajax'
import StChoiceQuestion from '../question/StChoiceQuestion'

export default class StTaskDetail extends Component{
	static propTypes = {
		location : PropTypes.object.isRequired,
		routeParams : PropTypes.object.isRequired,
		router : PropTypes.object.isRequired,
	};

	constructor(props){
		super(props);
		this.state = {
			questions:[],
		};
	}

	getTaskInfo = () => {
		return this.props.location.query;
	};

	componentDidMount(){
		const taskId = parseInt(this.props.routeParams.taskId);
		HostPost('/get-task-content-with-answer',{taskId:taskId},true).then(({json}) => {
			if(json.error === 0){
				json.content.map((item) => {
					const tmp = JSON.parse(item.content);
					item.question = tmp.question;
					item.options = tmp.options;
				});
				this.setState({questions:json.content});
			} else {
				throw json;
			}
		}).catch((error) => {
			// console.log(error);
			notification.error({
				message: '温馨提示',
				description: '获取数据失败.',
			});
		});
	}

	render() {
		const {title,target} = this.getTaskInfo();
		const {questions} = this.state;

		return (
			<div className="main-box" style={{padding:'30px 20px'}}>
				<h1>
					<Button shape="circle" icon="arrow-left" type="primary" size="large" style={{marginLeft:'30px',marginRight:"20px",verticalAlign:'middle'}} onClick={this.props.router.goBack}/>
					{title}
					<small>{target}</small>
				</h1>
				<div>
					{
						questions.map((item,index) => {
							return (
								<StChoiceQuestion key={index} question={item.question} options={item.options} answer={item.answers} index={index} />
							);
						})
					}
				</div>
			</div>
		);
	}
}