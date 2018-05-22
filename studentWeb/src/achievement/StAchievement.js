/**
 * Created by coder on 2017/3/14.
 */
import React,{Component} from 'react'
import {notification} from 'antd'
import {connect} from 'react-redux'
import {ACTION_UPDATE_TASK_LISTS} from '../store/action'
import {HostPost} from '../ajax'
import StAchievementCharts from './StAchievementCharts'
import {TASK_STATE_INDEX} from '../common/constDefine'

class StAchievement extends Component{
	constructor(props){
		super(props);
		this.state = {
			loading:true,
		};
	}

	fetch = (params = {}) => {
		HostPost('/get-task-list-ex',{...params},true).then(({json}) => {
			if(json.error === 0){
				let task = [[],[],[],[]];
				json.list.map((item) => {
					task[item.type - 1].push(item);
				});

				let data = {};
				params.taskTypes.map((item) => {
					data[TASK_STATE_INDEX[item]] = task[item-1];
				});

				this.props.updateTaskLists(data);
				this.setState({loading:false});
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

	componentDidMount() {
		const {taskPreview,taskHomework,taskExperiment,taskSummary} = this.props;
		let taskTypes = [];
		if(!taskPreview){
			taskTypes.push(1);
		}
		if(!taskHomework){
			taskTypes.push(2);
		}
		if(!taskExperiment){
			taskTypes.push(3);
		}
		if(!taskSummary){
			taskTypes.push(4);
		}
		if(taskTypes.length > 0){
			this.fetch({taskTypes});
		} else {
			this.setState({loading:false});
		}
	}

	render(){
		const {loading} = this.state;
		const {taskPreview,taskHomework,taskExperiment,taskSummary} = this.props;

		return (
			<div className="main-box"  style={{padding:'30px 20px'}}>
				<h1>成就</h1>
				{
					loading ?
						<p>loading...</p>
						:
						<StAchievementCharts
							taskPreview={taskPreview}
							taskHomework={taskHomework}
							taskExperiment={taskExperiment}
							taskSummary={taskSummary}
						/>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		taskPreview:state.task.taskPreview,
		taskHomework:state.task.taskHomework,
		taskExperiment:state.task.taskExperiment,
		taskSummary:state.task.taskSummary,
	};
};

const mapDispatchToProps = {
	updateTaskLists:(info) => {
		return {
			type:ACTION_UPDATE_TASK_LISTS,
			payload:info
		}
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StAchievement);