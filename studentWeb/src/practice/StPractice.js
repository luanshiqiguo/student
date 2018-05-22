/**
 * Created by coder on 2017/3/7.
 */
import React,{Component} from 'react'
import {Tabs,notification} from 'antd'
import {connect} from 'react-redux'
import {HostPost} from '../ajax'
import StPracticeTable from './StPracticeTable'
import {ACTION_UPDATE_TASK_LISTS} from '../store/action'
import {TASK_STATE_INDEX} from '../common/constDefine'

const TabPane = Tabs.TabPane;
const TAB_PREVIEW = '1';
const TAB_HOMEWORK = '2';
const TAB_EXPERIMENT = '3';



class StPractice extends Component{
	constructor(props){
		super(props);

		this.state = {
			loading:true,
			selectTab:TAB_PREVIEW,
		}
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
		const {taskPreview,taskHomework,taskExperiment} = this.props;
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

		if(taskTypes.length > 0){
			this.fetch({taskTypes});
		} else {
			this.setState({loading:false});
		}
	}

	handleChangeTabs = (key) => {
		this.setState({selectTab:key});
	};

	//切换到TAB_TASK_DETAIL标签页
	handleTaskDetail = (record,index,state) => {
		this.props.router.push('/practice/question/'+record.id + '/' + record.type);
	};

	render() {
		const {taskPreview,taskHomework,taskExperiment} = this.props;
		const {loading,selectTab} = this.state;
		return (
			<div className="main-box" style={{padding:'30px 20px'}}>
				<h1>习题练习</h1>
				<Tabs activeKey={selectTab} onChange={this.handleChangeTabs}>
					<TabPane tab="课前预习" key={TAB_PREVIEW}>
						<StPracticeTable loading={loading} data={taskPreview} onDetail={this.handleTaskDetail}/>
					</TabPane>
					<TabPane tab="课后作业" key={TAB_HOMEWORK}>
						<StPracticeTable loading={loading} data={taskHomework} onDetail={this.handleTaskDetail}/>
					</TabPane>
					<TabPane tab="实验练习" key={TAB_EXPERIMENT}>
						<StPracticeTable loading={loading} data={taskExperiment} onDetail={this.handleTaskDetail}/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		taskPreview:state.task.taskPreview,
		taskHomework:state.task.taskHomework,
		taskExperiment:state.task.taskExperiment,
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

export default connect(mapStateToProps,mapDispatchToProps)(StPractice);