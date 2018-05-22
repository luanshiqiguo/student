/**
 * Created by coder on 2017/3/7.
 */
import React,{Component} from 'react'
import {Tabs,notification,Input,Button} from 'antd'

import {HostPost} from '../ajax'
import StStudentReports from './StStudentReports'
import StStudentCharts from './StStudentCharts'
import StStudentTaskDetail from './StStudentTaskDetail'

const TabPane = Tabs.TabPane;


const TAB_PREVIEW = '1';
const TAB_HOMEWORK = '2';
const TAB_EXPERIMENT = '3';
const TAB_SUMMARY = '4';
const TAB_CHART = '5';
const TAB_TASK_DETAIL = '6';
const TAB_CHANGE_EMAIL = '7';

class StChangeStudentEmail extends Component{
	constructor(props){
		super(props);
		this.state={
			stuId:this.props.stuId,
			keyword:null,
			email:null,
		}
	}

	changeKeyword = (e) => {
		this.setState({keyword:e.target.value})
	};

	changeEmail = (e) => {
		this.setState({email:e.target.value})
	};

	handleSubmit = () => {
		const {keyword,email,stuId} = this.state;
		if(stuId&&keyword&&email){
			HostPost('/change-student-email',{keyword,email,stuId},true).then(({json})=>{
				if(json.error == 0){
					//成功
					notification.success({
						message: '温馨提示',
						description: '修改成功',
					});
					this.setState({keyword:null,email:null})
				}else if(json.error == -1){
					//失败
					notification.error({
						message: '温馨提示',
						description: '口令错误',
					});
				}else{
					//失败
					notification.error({
						message: '温馨提示',
						description: '数据格式错误',
					});
				}
			}).catch((error) => {
				notification.error({
					message: '温馨提示',
					description: '网络错误',
				});
			});
		}else{
			notification.error({
				message: '温馨提示',
				description: '信息不完整',
			});
		}
	};

	render(){
		return(
			<div>
				<Input placeholder="口令" value={this.state.keyword} onChange={this.changeKeyword} style={{width:'45%'}}/>
				<Input placeholder="邮箱" value={this.state.email} onChange={this.changeEmail} style={{width:'45%'}}/>
				<Button type="primary" onClick={this.handleSubmit}>提交</Button>
			</div>
		)
	}
}


export default class StStudentDetail extends Component{
	constructor(props){
		super(props);

		this.state = {
			dataPreview:[],
			dataHomework:[],
			dataExperiment:[],
			dataSummary:[],
			studentInfo:{},
			loading:false,
			selectTab:TAB_PREVIEW,
			record:{},
		}
	}

	fetch = (params = {}) => {
		HostPost('/get-user-detail',{...params},true).then(({json}) => {
			if(json.error === 0){
				let task = [[],[],[],[]];

				json.tasks.map((item) => {
					task[item.type - 1].push(item);
				});

				let newState = {
					loading: false,
					dataPreview:task[0],
					dataHomework:task[1],
					dataExperiment:task[2],
					dataSummary:task[3],
					studentInfo:json.userInfo
				};
				this.setState(newState);
			} else {
				throw json;
			}
		}).catch((error) => {
			notification.error({
				message: '温馨提示',
				description: '获取用户数据失败.',
			});
		});
	};

	componentDidMount() {
		const {routeParams} = this.props;
		this.fetch({id:routeParams.userId});
	}

	handleChangeTabs = (key) => {
		this.setState({selectTab:key});
	};

	//切换到TAB_TASK_DETAIL标签页
	handleTaskDetail = (record) => {
		this.setState({selectTab:TAB_TASK_DETAIL,record});
	};

	render() {
		const {loading,dataPreview,dataHomework,dataExperiment,dataSummary,studentInfo,selectTab,record} = this.state;
		return (
			<div className="main-box" style={{padding:'30px 20px'}}>
				<h1>学习详情 <small>名字：{studentInfo.name}， 班级：{studentInfo.class}， 学号：{studentInfo.stuId}</small></h1>
				<Tabs activeKey={selectTab} onChange={this.handleChangeTabs}>
					<TabPane tab="课前预习" key={TAB_PREVIEW}>
						<StStudentReports loading={loading} data={dataPreview} onDetail={this.handleTaskDetail}/>
					</TabPane>
					<TabPane tab="课后作业" key={TAB_HOMEWORK}>
						<StStudentReports loading={loading} data={dataHomework} onDetail={this.handleTaskDetail}/>
					</TabPane>
					<TabPane tab="实验练习" key={TAB_EXPERIMENT}>
						<StStudentReports loading={loading} data={dataExperiment} onDetail={this.handleTaskDetail}/>
					</TabPane>
					<TabPane tab="每周总结" key={TAB_SUMMARY}>
						<StStudentReports loading={loading} data={dataSummary} onDetail={this.handleTaskDetail}/>
					</TabPane>
					<TabPane tab="完成统计" key={TAB_CHART}>
						<StStudentCharts dataPreview={dataPreview} dataHomework={dataHomework} dataExperiment={dataExperiment} dataSummary={dataSummary}/>
					</TabPane>
					<TabPane tab="任务详情" key={TAB_TASK_DETAIL}>
						<StStudentTaskDetail record={record} taskId={record.id}/>
					</TabPane>
					<TabPane tab="修改邮箱" key={TAB_CHANGE_EMAIL}>
						<StChangeStudentEmail stuId={studentInfo.stuId}/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}