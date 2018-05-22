/**
 * Created by crazycooler on 2017/3/5.
 */
import React,{Component} from 'react'
import {Table,Input,Button,Tooltip,notification} from 'antd'
import {HostPost} from '../ajax'
import {Link} from 'react-router'
import './StStudentInfo.css'
import {getPageSize,getPageStartIndex,renderHighlight} from '../common/StTableCommon'
import {makeHighlight} from '../common/StHighlight'
import AddStudentModal from './StAddStudent'

/**
 * 显示所有学生的信息
 * 可以模糊搜素name，stuId
 * 可以filter：class，groupId
 */

export default class StStudentInfo extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:[],
			pagination:{showSizeChanger:true,pageSizeOptions:['10','20','50','100']},
			loading:false,
			search:'',
			preSearch:'',
			classFilter:[],
			groupFilter:[],
			tableFilters:{},
			addStudentModalVisible:false,
		};
	}

	getColumns = () => {
		const {classFilter,groupFilter} = this.state;

		return [
			{
				title:'#',
				render:(text,record,index) => {
					const {pagination} = this.state;
					return getPageStartIndex(pagination) + index + 1;
				},
			},
			{
				title:'用户名',
				render:(text,record,index) => {
					return renderHighlight(record,'name');
				}
			},
			{
				title:'邮箱',
				dataIndex:'email',
				key:'email',
			},
			{
				title:'学号',
				render:(text,record,index) => {
					return renderHighlight(record,'stuId');
				}
			},
			{
				title:'班级',
				dataIndex:'class',
				key:'class',
				filters: classFilter,
				filterMultiple: true,
			},
			{
				title:'编组',
				dataIndex:'groupId',
				key:'groupId',
				filters: groupFilter,
				filterMultiple: true,
			},
			{
				title:'详情',
				render:(text,record,index) => {
					return (
						<Link to={'/student-detail/'+record.id}>详情</Link>
					);
				}
			}
		];
	};

	handleTableChange = (pagination, filters, sorter) => {
		const pager = this.state.pagination;
		pager.current = pagination.current;
		console.log(pagination);
		this.setState({pagination: pager,tableFilters:filters});
		let params = {
			offset:getPageStartIndex(pagination),
			limit:getPageSize(pagination),
		};

		if(filters.hasOwnProperty('class') && filters.class.length > 0){
			params['class'] = filters.class;
		}

		if(filters.hasOwnProperty('groupId') && filters.groupId.length > 0){
			params['groupId'] = filters.groupId;
		}

		const {search,preSearch} = this.state;

		if(search === preSearch){
			params['search'] = search;
		}

		this.fetch(params);
	};

	fetch = (params = {}) => {
		this.setState({loading:true});
		HostPost('/get-all-users',{...params},true).then(({json}) => {
			if(json.error === 0){
				const pagination = this.state.pagination;
				pagination.total = json.total;
				const {search} = this.state;
				makeHighlight(json.rows,['name','stuId'],search);
				let newState = {
					loading: false,
					data: json.rows,
					pagination,
				};
				if(params.withFilter){
					newState['classFilter'] = json.classFilter.map((item) => {return {text:item.class,value:item.class};});
					newState['groupFilter'] = json.groupFilter.map((item) => {return {text:item.groupId,value:item.groupId};});
				}
				this.setState(newState);
			} else {
				throw json;
			}
		}).catch((error) => {
			// console.log(error);
			this.setState({loading:false});
		});
	};

	componentDidMount() {
		this.fetch({
			offset:0,
			limit:10,
			withFilter:true,
		});
	}

	handleChangeSearch = (e) => {
		this.setState({search:e.target.value});
	};

	handleSearch = () => {
		const {search,preSearch,tableFilters} = this.state;
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

		if(tableFilters.hasOwnProperty('class') && tableFilters.class.length > 0){
			params['class'] = tableFilters.class;
		}

		if(tableFilters.hasOwnProperty('groupId') && tableFilters.groupId.length > 0){
			params['groupId'] = tableFilters.groupId;
		}

		this.fetch(params);
	};

	handleStudentCreate = () => {
		this.setState({addStudentModalVisible:true});
	};

	handleAddNewStudentToListData=(id,stuId,name,stuClass,groupId)=>{
		this.setState({addStudentModalVisible:false});
		let newData = this.state.data;
		newData.unshift({
			'id':id,
			'stuId':stuId,
			'name':name,
			'class':stuClass,
			'groupId':groupId,
			'email':'',
			'privilege':1
		});
		this.setState({data:newData});
		this.openNotification('success','创建成功！');
	};

	handleCancelAddStudent=()=>{
		this.setState({addStudentModalVisible:false})
	};

	openNotification = (type,description) => {
		notification[type]({
			message: '温馨提示',
			description:description
		});
	};

	render(){
		const {search,addStudentModalVisible} = this.state;
		return (
			<div className="main-box" style={{padding:'30px 20px'}}>
				<h1>学生信息 <small style={{marginLeft:'20px'}}>在此可以查看所有学生的相关信息，点击详情可以获得更多的信息.</small></h1>
				<div style={{float:'right',padding:'20px 5px 10px 5px',marginTop:'-20px'}}>
					<Tooltip title="名字和学号两个字段可以用于查询.">
						<Input placeholder="查找" value={search} onChange={this.handleChangeSearch} size="large" style={{width:'200px'}}/>
					</Tooltip>
					<Button shape="circle" icon="search" style={{marginLeft:'10px'}} onClick={this.handleSearch}/>
					<Button shape="circle" icon="plus" type="primary" style={{marginLeft:'10px'}} onClick={this.handleStudentCreate}/>
				</div>
				{
					addStudentModalVisible?
						<AddStudentModal
							onAddNewStudentToListData={this.handleAddNewStudentToListData}
							onCancelAddStudent={this.handleCancelAddStudent}/>
						:
						null
				}
				<div style={{float:'left',width:'100%'}}>
					<Table
						style={{}}
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