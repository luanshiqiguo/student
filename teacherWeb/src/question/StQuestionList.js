/**
 * Created by abing on 2017/3/8.
 */

import React,{Component} from 'react'
import {Button,Spin,Pagination,Alert,Input,notification} from 'antd'
import {HostPost} from '../ajax/index'
import AddQuestionModal from './StAddQuestion'
import StQuestionItem from './StQuestionItem'
import './StQuestionList.css'
import {makeHighlight} from '../common/StHighlight'


export default class StQuestionList extends Component{
	state = {
		data: [],
		total:0,
		search:'',
		preSearch:'',
		loading:true,
		current:1,
		pageSize:10,
		errorMessage:false,
		addQuestionModalVisible:false
	};

	openNotification = (type,description) => {
		notification[type]({
			message: '温馨提示',
			description:description
		});
	};

	componentDidMount() {
		this.fetch({
			offset:0,
			limit:10
		})
	}

	handleShowSizeChange=(current, pageSize)=> {
		const {search,preSearch} = this.state;
		this.setState({pageSize:pageSize});
		this.fetch({
			offset:(current-1)*this.state.pageSize,
			limit:pageSize,
			search:search === preSearch ? search : null
		});
	};

	handleShowPageChange=(current, pageSize)=>{
		const {search,preSearch} =this.state;
		this.setState({current:current});
		this.fetch({
			offset:(current-1)*pageSize,
			limit:pageSize,
			search:search === preSearch ? search : null
		})
	};

	handleSearch=()=>{
		const {search,preSearch,pageSize} = this.state;
		if (search === preSearch){
			return;
		}
		this.fetch({
			offset:0,
			limit:pageSize,
			search:search
		});
		this.setState({preSearch:search,current:1});
	};

	handleChangeSearch=(e)=>{
		this.setState({search:e.target.value});
	};

	handleUpdateQuestion=(questionId, index, question, options, answers, name, created_at)=>{
		let newListData = [...this.state.data];
		newListData[index] = {
			'id':questionId,
			'question':question,
			'options':options,
			'answers':answers,
			'name':name,
			'created_at':created_at,
		};
		this.setState({data:newListData});

		const updateData = {
			questionId:questionId,
			content:JSON.stringify({
				"question":question,
				"options":options
			}),
			answers:answers
		};

		this.fetchUpdateQuestion(updateData);
	};

	handleDeleteQuestion=(questionId, index)=>{
		const {data} = this.state;
		HostPost('/del-question',{questionId:questionId},true).then(({json})=>{
			if(json.error === 0){
				this.openNotification('success','删除成功！');
				let newListData = data.slice(0,index).concat(data.slice(index+1));
				this.setState({data:newListData});
			} else if(json.error === 'db_cannot_delete'){
				this.openNotification('warning','不可删除！该题目已被选用');
			} else {
				throw json;
			}
		}).catch((error)=>{
			this.openNotification('error','删除失败！');
		});
	};

	handleAddQuestion=()=>{
		this.setState({addQuestionModalVisible:true})
	};

	handleAddNewQuestionToListData=(questionId, question, answers, options, name, created_at)=>{
		this.setState({addQuestionModalVisible:false});

		let newData = this.state.data;
		newData.unshift({
			'id':questionId,
			'question':question,
			'options':options,
			'answers':answers,
			'name':name,
			'created_at':created_at,
		});
		this.setState({data:newData});
		this.openNotification('success','创建成功！');
	};

	handleCancelAddQuestion=()=>{
		this.setState({addQuestionModalVisible:false})
	};

	fetchUpdateQuestion = (params = {}) =>{
		HostPost('/update-question',{...params},true).then(({json})=>{
			if(json.error === 0){
				this.openNotification('success','恭喜您！修改成功','');
			}else {
				this.openNotification('error','很抱歉！修改失败',json.error);
			}
		}).catch((error) => {
			this.openNotification('warning','网络错误!',error);
		})
	};

	fetch = (params = {}) =>{
		this.setState({loading:true});
		HostPost('/get-all-questions',{...params},true).then(({json}) => {
			if (json.error===0){
				json.rows.map((item)=>{
					let content = JSON.parse(item.content);
					item.question = content.question;
					item.options = content.options;
				});

				const {search} = this.state;
				makeHighlight(json.rows,['question','options'],search);

				this.setState({data:json.rows,loading:false,total:json.total,errorMessage:false});
			}else {
				throw json;
			}
		}).catch((error) => {
			// console.log(error);
			this.setState({loading:false,errorMessage:true})
		})
	};

	render(){
		const {loading,data,search,current,pageSize,total,errorMessage,addQuestionModalVisible} = this.state;

		return(
			<div>
				{errorMessage ? <Alert message="Error" description="获取数据失败." type="error" showIcon/> : null}
				<div className="list-search-add">
					<Input placeholder="查找" value={search} onChange={this.handleChangeSearch} size="large" style={{width:'200px'}}/>
					<Button shape="circle" icon="search" style={{marginLeft:'10px'}} onClick={this.handleSearch}/>
					<Button type="primary" shape="circle" icon="plus" style={{marginLeft:'10px'}} onClick={this.handleAddQuestion}/>
				</div>

				{
					addQuestionModalVisible?
						<AddQuestionModal onAddNewQuestionToListData={this.handleAddNewQuestionToListData} onCancelAddQuestion={this.handleCancelAddQuestion}/>
						:
						null
				}

				<h1 className="list-title">题目列表<small style={{marginLeft:'20px'}}>管理系统中的题目</small></h1>
				{
					loading ?
						<div className="loading">
							<Spin tip="Loading..." />
						</div>
						:
						<div>
							{
								data.map((item,index) => {
									return <StQuestionItem data={item} key={item.id} index={index}
									                       onUpdateQuestion={this.handleUpdateQuestion}
									                       onDeleteQuestion={this.handleDeleteQuestion}/>
								})
							}
							<div style={{padding:20,float:'right'}}>
								<Pagination showSizeChanger onShowSizeChange={this.handleShowSizeChange}
								            onChange={this.handleShowPageChange}
								            current={current}
								            pageSize={pageSize}
								            total={total} />
							</div>
						</div>
				}
			</div>
		)
	}
}