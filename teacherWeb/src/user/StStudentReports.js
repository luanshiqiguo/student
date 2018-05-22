/**
 * Created by coder on 2017/3/7.
 */
import React,{Component,PropTypes} from 'react'
import {Table} from 'antd'
import {TASK_TYPE_PREVIEW,TASK_TYPE_HOMEWORK,TASK_TYPE_EXPERIMENT,TASK_TYPE_SUMMARY} from '../common/constDefine'

export default class StStudentReports extends Component{
	static propTypes = {
		loading:PropTypes.bool.isRequired,
		data:PropTypes.array.isRequired,
	};

	getColumns = () => {
		const {onDetail} = this.props;
		return [
			{
				title:'#',
				render:(text,record,index) => {
					return index + 1;
				},
			},
			{
				title:'任务名称',
				dataIndex:'title',
				key:'title',
			},
			{
				title:'目标',
				dataIndex:'target',
				key:'target',
			},
			{
				title:'第几周',
				dataIndex:'week',
				key:'week',
			},
			{
				title:'成绩',
				dataIndex:'score',
				key:'score',
				render:(text,record,index) => {
					return text ? text : 0;
				},
			},
			{
				title:'类型',
				dataIndex:'type',
				key:'type',
				render:(text,record,index) => {
					switch(record.type){
						case TASK_TYPE_PREVIEW:return '课前预习';
						case TASK_TYPE_HOMEWORK:return '课后作业';
						case TASK_TYPE_EXPERIMENT:return '实验练习';
						case TASK_TYPE_SUMMARY:return '每周总结';
					}
				},
			},
			{
				title:'完成情况',
				key:'finishState',
				render:(text,record,index) => {
					return record.finishTime ? '完成' : '未完成';
				},
			},
			{
				title:'答题耗时',
				key:'time',
				render:(text,record,index) => {
					if(record.time===null){
						return null;
					}else if (record.time<60){
						return record.time+'秒';
					}else {
						return parseInt(record.time/60) + '分' + record.time%60 + '秒';
					}
				},
			},
			{
				title:'提交时间',
				dataIndex:'finishTime',
				key:'finishTime',
				render:(text,record,index) => {
					return text ? text : '--';
				}
			},
			{
				title:'详情',
				render:(text,record,index) => {
					return record.finishTime ? (<a onClick={() => onDetail(record)} >详情</a>) : '--';
				}
			}
		];
	};

	render() {
		const {loading,data} = this.props;

		return (
			<div>
				<Table
					style={{padding:'10px 20px 30px 20px'}}
					columns={this.getColumns()}
					rowKey={record => record.id}
					dataSource={data}
					loading={loading}
					pagination={false}
				/>
			</div>
		);
	}
}