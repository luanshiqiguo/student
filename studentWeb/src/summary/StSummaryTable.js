/**
 * Created by abing on 2017/3/15.
 */
import React,{Component} from 'react'
import {Table,Button} from 'antd'
import {connect} from 'react-redux'
import {TASK_STATE_FINISH,TASK_STATE_EXPIRE,TASK_STATE_DOING} from '../common/constDefine'
import StSummaryModalEdit from './StSummaryModalEdit'
import StSummaryModalStatic from './StSummaryModalStatic'

export default class StSummaryTable extends Component{

	constructor(props){
		super(props);

		this.state={
			modalEditVisible:false,
			modalStaticVisible:false,
			record:null,
			index:null,
		}
	}

	showModalEdit=(record,index)=>{
		this.setState({modalEditVisible:true,record:record,index:index});
	};

	showModalStatic=(record)=>{
		this.setState({modalStaticVisible:true,record:record});
	};

	hiddenModalEdit=()=>{
		this.setState({modalEditVisible:false})
	};

	hiddenModalStatic=()=>{
		this.setState({modalStaticVisible:false})
	};

	getTaskState = (data) =>{
		if(data.content){
			return TASK_STATE_FINISH;
		}
		return data.expire ? TASK_STATE_EXPIRE : TASK_STATE_DOING;
	};

	getColumns = () => {
		return[
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
				key:'score',
				render:(text,record,index) => {
					return (record.score === null) && record.content ? '等待评阅' :record.scorel;
				}
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
				key: 'action',
				render:(text,record,index) => {
					const taskState = this.getTaskState(record);
					if(taskState === TASK_STATE_FINISH){
						return (
							<Button size="small" type="success" onClick={()=>this.showModalStatic(record)}>完成</Button>
						);
					} else if(taskState === TASK_STATE_EXPIRE){
						return (
							<span style={{color:'red'}}>过期</span>
						);
					} else {
						return (
							<Button size="small" type="primary" onClick={()=>this.showModalEdit(record,index)}>总结</Button>
						);
					}
				},
			}
		];
	};

	render(){
		const{data,loading}=this.props;
		const{modalEditVisible,modalStaticVisible,record,index}=this.state;
		return(
			<div>
				<Table columns={this.getColumns()}
				       dataSource={data}
				       loading={loading}
				       rowKey={record => record.id}
				       pagination={false}
				/>
				{
					modalEditVisible?
						<StSummaryModalEdit modalVisible={modalEditVisible}
						                data={record}
						                index={index}
						                onCancle={this.hiddenModalEdit}
						/>
						:
						null
				}
				{
					modalStaticVisible?
						<StSummaryModalStatic modalVisible={modalStaticVisible}
						                      data={record}
						                      onCancle={this.hiddenModalStatic}/>
						:
						null
				}

			</div>

		)
	}
}