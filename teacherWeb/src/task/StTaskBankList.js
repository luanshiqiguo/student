/**
 * Created by coder on 2017/3/9.
 */
import React,{Component,PropTypes} from 'react'
import {Table,Tooltip,Input,Button,Icon,Modal,notification} from 'antd'
import {Link} from 'react-router'
import {HostPost} from '../ajax'
import {makeHighlight} from '../common/StHighlight'
import {renderHighlight,getPageStartIndex,getPageSize} from '../common/StTableCommon'
import './StTaskBankList.css'
import {TASK_TYPE_SUMMARY} from '../common/constDefine'

const typeNameList = ['课前预习','课后作业','实验预习','每周总结'];

/**
 * 在表格中的task单元格
 */
class StTaskCell extends Component{
	static propTypes = {
		title:PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.element,
		]).isRequired,
		edit:PropTypes.func.isRequired,
		remove:PropTypes.func.isRequired,
	};

	render(){
		const {title,edit,remove} = this.props;
		return (
			<div className="task-cell">
				{title}
				<Icon
					type="edit"
					className="task-hide-icon edit"
					onClick={edit}
				/>
				<Icon
					type="garbage"
					className="task-hide-icon remove"
					onClick={remove}
				/>
			</div>
		);
	}
}

/**
 * 用户显示所有的task信息
 */
export default class StTaskBankList extends Component{
	static propTypes = {
		router:PropTypes.object.isRequired
	};

	constructor(props){
		super(props);
		this.state = {
			data:[],
			pagination:{showSizeChanger:true,pageSizeOptions:['10','20','50','100']},
			loading:false,
			search:'',
			preSearch:'',
			typeFilter:[]
		};
	}

	getColumns = () => {

		const {typeFilter} = this.state;

		return [{
			title:'#',
			render:(text,record,index) => {
				const {pagination} = this.state;
				return getPageStartIndex(pagination) + index + 1;
			},
		},{
			title:'任务',
			render:(text,record,index) => {
				return (
					<StTaskCell
						title={renderHighlight(record,'title')}
					  edit={() => this.handleTaskEdit(record)}
					  remove={() => this.handleTaskRemove(record,index)}
					/>
				);
			},
		},{
			title:'目标',
			render:(text,record,index) => {
				return renderHighlight(record,'target');
			}
		},{
			title:'发布对象',
			dataIndex:'groupId',
			key:'groupId',
		},{
			title:'第几周',
			dataIndex:'week',
			key:'week',
		},  {
			title:'发布',
			dataIndex:'published',
			key:'published',
			render:(text,record,index) => {
				return text === 1 ? '已发布' : <Button size="small" type="primary" onClick={() => this.handleTaskPublish(record,index)}>发布</Button>;
			}
		},{
			title:'类型',
			dataIndex:'type',
			key:'type',
			filters: typeFilter,
			filterMultiple: true,
			render:(text) => {
				return typeNameList[text-1];
			}
		},{
			title:'开始时间',
			dataIndex:'startTime',
			key:'startTime',
		},{
			title:'结束时间',
			dataIndex:'deadLine',
			key:'deadLine',
		}, {
			title:'详情',
			render:(text,record,index) => {
				const {title,target,type} = record;
				if(type === TASK_TYPE_SUMMARY){
					return '--';
				}
				return (
					<Link to={{pathname:'/task-bank/detail/'+record.id,query:{title,target}}}>详情</Link>
				);
			}
		}];

	};

	handleTaskPublish = (record,index) => {
		Modal.confirm({
			title: '发布提示',
			content: '你确定要发布该任务，发布后不能撤销改该发布？',
			okText: '确定',
			cancelText: '取消',
			onOk:() => {
				HostPost('/publish-task',{taskId:record.id},true).then(({json}) => {
					if(json.error === 0){
						const {data} = this.state;
						data[index].published = 1;
						this.setState({data:[...data]});
						notification.success({
							message: '温馨提示',
							description: '任务发布成功.',
						});
					} else {
						throw json;
					}
				}).catch((error) => {
					// console.log(error);
					notification.error({
						message: '温馨提示',
						description: '任务发布失败.',
					});
				});
			}
		});
	};

	handleTaskEdit = (record) => {
		this.props.router.push({pathname:'/task-bank/edit',state:{record}});
	};

	handleTaskCreate = () =>{
		this.props.router.push('/task-bank/create');
	};

	//删除task
	handleTaskRemove = (record,index) => {
		Modal.confirm({
			title: '删除提示',
			content: '你确定要删除该任务？',
			okText: '确定',
			cancelText: '取消',
			onOk:() => {
				HostPost('/del-task',{taskId:record.id},true).then(({json}) => {
					if(json.error === 0){
						const {data} = this.state;
						data.splice(index,1);
						this.setState({data:[...data]});
						notification.success({
							message: '温馨提示',
							description: '任务删除成功.',
						});
					} else {
						throw json;
					}
				}).catch((error) => {
					// console.log(error);
					notification.error({
						message: '温馨提示',
						description: '任务删除失败.',
					});
				});
			}
		});
	};

	fetch = (params = {}) => {
		this.setState({loading:true});
		HostPost('/get-all-tasks',{...params},true).then(({json}) => {
			if(json.error === 0){
				const {search} = this.state;
				const pagination = this.state.pagination;
				pagination.total = json.total;

				makeHighlight(json.rows,['title','target'],search);

				let newState = {
					loading: false,
					data: json.rows,
					pagination,
				};

				if(params.withFilter){
					newState['typeFilter'] = json.typeFilter.map((item) => {return {text:typeNameList[item.type-1],value:item.type};});
				}

				this.setState(newState);
			} else {
				notification.error({
					message: '温馨提示',
					description: '获取数据失败.',
				});
			}
		}).catch((error) => {
			// console.log(error);
			this.setState({loading:false});
			notification.error({
				message: '温馨提示',
				description: '网络错误！获取数据失败.',
			});
		});
	};

	handleChangeSearch = (e) => {
		this.setState({search:e.target.value});
	};

	handleSearch = () => {
		const {search,preSearch} = this.state;
		if(search === preSearch){
			return;
		}

		const {pagination} = this.state;
		this.setState({preSearch:search,pagination:Object.assign(pagination,{current:1})});

		let params = {
			offset:0,
			limit:getPageSize(pagination),
			search,
		};

		this.fetch(params);
	};

	handleTableChange = (pagination, filters, sorter) => {
		const pager = this.state.pagination;
		pager.current = pagination.current;
		this.setState({pagination: pager});
		let params = {
			offset:getPageStartIndex(pagination),
			limit:getPageSize(pagination),
		};

		if(filters.hasOwnProperty('type') && filters.type.length > 0){
			params['type'] = filters.type;
		}

		const {search,preSearch} = this.state;
		if(search === preSearch){
			params['search'] = search;
		}

		this.fetch(params);
	};

	componentDidMount() {
		this.fetch({
			offset:0,
			limit:10,
			withFilter:true,
		});
	}

	render(){
		const {search} = this.state;
		return (
			<div style={{padding:'30px 20px'}} className="task-bank-list">
				<h1>任务发布 <small style={{marginLeft:'20px'}}>通过添加任务，向学生发布各种不同的任务</small></h1>
				<div style={{float:'right',padding:'20px 5px 10px 5px',marginTop:'-20px'}}>
					<Tooltip title="任务和目标两个字段可以用于查询.">
						<Input placeholder="查找" value={search} onChange={this.handleChangeSearch} size="large" style={{width:'200px'}}/>
					</Tooltip>
					<Button shape="circle" icon="search" style={{marginLeft:'10px'}} onClick={this.handleSearch}/>
					<Button shape="circle" icon="plus" type="primary" style={{marginLeft:'10px'}} onClick={this.handleTaskCreate}/>
				</div>
				<div style={{float:'left',width:'100%'}}>
					<Table
						columns={this.getColumns()}
						rowKey={record => record.id}
						dataSource={this.state.data}
						pagination={this.state.pagination}
						loading={this.state.loading}
						onChange={this.handleTableChange}
					/>
				</div>
			</div>
		);
	}
}