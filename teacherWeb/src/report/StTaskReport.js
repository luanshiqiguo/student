/**
 * Created by crazycooler on 2017/3/5.
 */
import React,{Component} from 'react'
import {Tabs} from 'antd'
import './StTaskReport.css'
import StTaskReportTable from './StTaskReportTable'
import StStudentTaskDetail from '../user/StStudentTaskDetail'
import {TASK_TYPE_PREVIEW,TASK_TYPE_HOMEWORK,TASK_TYPE_EXPERIMENT,TASK_TYPE_SUMMARY} from '../common/constDefine'

const TabPane = Tabs.TabPane;

const TAB_ALL = '1';
const TAB_PREVIEW = '2';
const TAB_HOMEWORK = '3';
const TAB_EXPERIMENT = '4';
const TAB_SUMMARY = '5';
const TAB_DETAIL = '6';


export default class StTaskReport extends Component{
	constructor(props){
		super(props);
		this.state = {
			record : {},
			selectTab:TAB_ALL,
		};
	}

	handleDetail = (record) => {
		this.setState({selectTab:'6',record});
	};

	handleChangeTabs = (key) => {
		this.setState({selectTab:key});
	};

	render(){
		const {record,selectTab} = this.state;

		return (
			<div className="main-box task-report" style={{padding:'30px 20px'}}>
				<h1>任务报告 <small style={{marginLeft:'20px'}}>可以再次查看学生提交的作业</small></h1>
				<Tabs tabPosition="left" activeKey={selectTab} onChange={this.handleChangeTabs}>
					<TabPane tab="全部报告" key={TAB_ALL} >
						<StTaskReportTable onDetail={this.handleDetail}/>
					</TabPane>
					<TabPane tab="课前预习" key={TAB_PREVIEW}>
						<StTaskReportTable taskType={TASK_TYPE_PREVIEW} onDetail={this.handleDetail}/>
					</TabPane>
					<TabPane tab="课后作业" key={TAB_HOMEWORK}>
						<StTaskReportTable taskType={TASK_TYPE_HOMEWORK} onDetail={this.handleDetail}/>
					</TabPane>
					<TabPane tab="实验练习" key={TAB_EXPERIMENT}>
						<StTaskReportTable taskType={TASK_TYPE_EXPERIMENT} onDetail={this.handleDetail}/>
					</TabPane>
					<TabPane tab="每周总结" key={TAB_SUMMARY}>
						<StTaskReportTable taskType={TASK_TYPE_SUMMARY} onDetail={this.handleDetail}/>
					</TabPane>
					<TabPane tab="作答详情" key={TAB_DETAIL}>
						<StStudentTaskDetail  record={record} taskId={record.taskId}/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}