/**
 * Created by abing on 2017/10/19.
 */
import React,{Component} from 'react'
import {Table , Popconfirm , notification,Button} from 'antd'
import {HostPost} from '../ajax'
import {getPageSize,getPageStartIndex} from '../common/StTableCommon'


export default class StFeedback extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:[],
			pagination:{showSizeChanger:true,pageSizeOptions:['10','20','50','100']},
			loading:false,
		};
	}

	componentDidMount(){
		this.fetch({
			offset:0,
			limit:10,
		});
	}

	handleTableChange = (pagination, filters) => {
		const pager = this.state.pagination;
		pager.current = pagination.current;
		this.setState({pagination: pager});
		let params = {
			offset:getPageStartIndex(pagination),
			limit:getPageSize(pagination),
		};

		this.fetch(params);
	};

	onDelete = (id) => {
		HostPost('/delete-feedback',{feedbackId:id},true).then(({json}) => {
			if(json.error === 0){
				const data = [...this.state.data];
				this.setState({ data: data.filter(item => item.id !== id) });
				notification.success({
					message: '温馨提示',
					description: '删除数据成功.',
				});
			}else{
				notification.error({
					message: '温馨提示',
					description: '删除数据失败.',
				});
			}
		}).catch((error) => {
			notification.error({
				message: '温馨提示',
				description: '操作失败.',
			});
		});

	};

	fetch = (params = {}) => {
		this.setState({loading:true});
		HostPost('/get-feedback',{...params},true).then(({json}) => {
			if(json.error === 0){
				const pagination = this.state.pagination;
				pagination.total = json.total;
				let newState = {
					loading: false,
					data: json.rows,
					pagination,
				};
				this.setState(newState);
			} else {
				throw json;
			}
		}).catch((error) => {
			this.setState({loading:false});
		});
	};

	getColumns = () => {
		return [
			{
				title:'#',
				width:'30px',
				render:(text,record,index) => {
					const {pagination} = this.state;
					return getPageStartIndex(pagination) + index + 1;
				},
			},
			{
				title:'姓名',
				width:'80px',
				dataIndex:'name',
				key:'name',
			},
			{
				title:'内容',
				dataIndex:'content',
				key:'content',
			},
			{
				title:'客户端',
				width:'80px',
				dataIndex:'client',
				key:'client',
			},
			{
				title:'反馈时间',
				width:'150px',
				dataIndex:'created_at',
				key:'created_at',
			},
			{
				title:'操作',
				width:'80px',
				dataIndex:'id',
				render: (text, record) => {
					return (
						this.state.data.length > 1 ?
							(
								<Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.id)}>
									<a href="#">删除</a>
								</Popconfirm>
							) : null
					);
				},
			},
		];
	};

	render(){
		return (
			<div className="main-box" style={{padding:'30px 20px'}}>
				<h1>学生意见反馈 <small style={{marginLeft:'20px'}}>学生的意见反馈.</small></h1>
				<div style={{float:'left',width:'100%'}}>
					<Table
						rowKey={record => record.id}
						columns={this.getColumns()}
						dataSource={this.state.data}
						pagination={this.state.pagination}
						loading={this.state.loading}
						onChange={this.handleTableChange}
					/>
				</div>
			</div>
		);
	};
}