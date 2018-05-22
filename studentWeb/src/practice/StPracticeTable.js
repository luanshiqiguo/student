/**
 * Created by coder on 2017/3/7.
 */
import React,{Component,PropTypes} from 'react'
import {Table,Button} from 'antd'
import {TASK_STATE_FINISH,TASK_STATE_EXPIRE,TASK_STATE_DOING} from '../common/constDefine'

export default class StPracticeTable extends Component{
	static propTypes = {
		loading:PropTypes.bool.isRequired,
		data:PropTypes.array,
	};

	getTaskState = (data) =>{
		if(data.content){
			return TASK_STATE_FINISH;
		}
		return data.expire ? TASK_STATE_EXPIRE : TASK_STATE_DOING;
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
				title:'选择题正确数量',
				dataIndex:'score',
				key:'score',
				render:(text,record,index) => {
					return text !== null ? text : '--';
				},
			},
			{
				title:'开始时间',
				dataIndex:'startTime',
				key:'startTime',
			},
			{
				title:'截止时间',
				dataIndex:'deadLine',
				key:'deadLine',
			},
			{
				title:'答题',
				render:(text,record,index) => {
					const taskState = this.getTaskState(record);
					if(taskState === TASK_STATE_FINISH){
						return (
							<Button size="small" type="success" onClick={() => onDetail(record,index,taskState)}>完成</Button>
						);
					} else if(taskState === TASK_STATE_EXPIRE){
						return (
							<span style={{color:'red'}}>过期</span>
						);
					} else {
						return (
							<Button size="small" type="primary" onClick={() => onDetail(record,index,taskState)}>答题</Button>
						);
					}
				},
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