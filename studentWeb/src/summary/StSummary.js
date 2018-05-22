/**
 * Created by coder on 2017/3/14.
 */
import React,{Component} from 'react'
import {notification} from 'antd'
import {connect} from 'react-redux'
import {HostPost} from '../ajax'
import {ACTION_UPDATE_TASK_LISTS} from '../store/action'
import StSummaryTable from './StSummaryTable'

import './StSummary.css'

class StSummary extends Component{

	constructor(props){
		super(props);
		this.state={
			loading:true,
		}
	}

	componentDidMount(){
		const {taskSummary} = this.props;
		if(!taskSummary){
			HostPost('/get-task-list-ex',{taskTypes:[4]},true).then(({json}) => {
				if(json.error === 0){
					let data = {'taskSummary':json.list};
					this.props.updateTaskLists(data);
					this.setState({loading:false});
				} else {
					this.setState({loading:true});
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
		}else {
			this.setState({loading:false});
		}
	}

	render(){
		const {taskSummary} = this.props;
		const {loading} = this.state;

		return (
			<div className="StSummary-content">
				<h1>每周总结</h1>
				<StSummaryTable data={taskSummary} loading={loading}/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return{
		taskSummary:state.task.taskSummary,
	}
};

const mapDispatchToProps = {
	updateTaskLists:(info) => {
		return {
			type:ACTION_UPDATE_TASK_LISTS,
			payload:info
		}
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StSummary)