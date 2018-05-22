/**
 * Created by coder on 2017/3/13.
 */
import React,{Component,PropTypes} from 'react'
import {Modal} from 'antd'
import StQuestionItemEdit from './StQuestionItemEdit'
import StQuestionItemStatic from './StQuestionItemStatic'
import './StQuestionList.css'

export default class StQuestionItem extends Component{
	static propTypes = {
		data:PropTypes.object.isRequired,
		onUpdateQuestion:PropTypes.func.isRequired,
		onDeleteQuestion:PropTypes.func.isRequired,
		index:PropTypes.number.isRequired,
	};

	constructor(props){
		super(props);
		this.state={
			editable:false,
		}
	};

	handleEditQuestion = ()=>{
		this.setState({editable:true});
	};

	handleDeleteQuestionItem = (questionId, index)=>{
		Modal.confirm({
			title: '删除提示',
			content: '您确认要删除该题目？',
			onOk:() => {
				this.props.onDeleteQuestion(questionId,index);
			},
		});
	};

	handleEditSubmit = (editParams) => {
		const {question,options,answers} = editParams;
		const questionId = this.props.data.id;
		const index =this.props.index;
		const created_at=this.props.data.created_at;
		const name = this.props.data.name;

		this.props.onUpdateQuestion(questionId,index,question,options,answers,name,created_at);

		this.setState({editable:false});
	};

	handleEditCancel = () => {
		this.setState({editable:false});
	};

	render(){
		const {editable} = this.state;
		const {index} = this.props;
		const {id,question,question_hl,options,options_hl,answers,name,created_at} = this.props.data;

		return(
			editable?
				<StQuestionItemEdit
					answers={answers}
					question={question}
					options={options}
					questionId={id}
					index={index}
					name={name}
					created_at={created_at}
					onSubmit={this.handleEditSubmit}
					onCancel={this.handleEditCancel}
				/>
				:
				<StQuestionItemStatic
					answers={answers}
					question={question_hl ? question_hl : question}
					options={options_hl ? options_hl : options}
					questionId={id}
					index={index}
					name={name}
					created_at={created_at}
					onEdit={this.handleEditQuestion}
					onDelete={this.handleDeleteQuestionItem}
				/>
		)
	}
}