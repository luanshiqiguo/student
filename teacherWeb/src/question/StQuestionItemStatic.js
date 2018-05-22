/**
 * Created by coder on 2017/3/13.
 */
import React,{Component,PropTypes} from 'react'
import {Button,Card} from 'antd'
import {choiceIndex} from '../common/StQuestionCommon'

export default class StQuestionItemStatic extends Component{
	static propTypes = {
		answers:PropTypes.number.isRequired,
		question:PropTypes.string.isRequired,
		options:PropTypes.array.isRequired,
		questionId:PropTypes.number.isRequired,
		index:PropTypes.number.isRequired,
		name:PropTypes.string.isRequired,
		created_at:PropTypes.string.isRequired,
		onEdit:PropTypes.func.isRequired,
		onDelete:PropTypes.func.isRequired,
	};

	handleEditQuestion = ()=>{
		this.props.onEdit();
	};

	handleDeleteQuestionItem = (questionId, index)=>{
		this.props.onDelete(questionId,index);
	};

	render(){
		const {index} = this.props;
		const {questionId,question,options,answers,name,created_at} = this.props;

		return(
				<Card>
					<div className="question-item">
						<h2>#{questionId}. {question}</h2>
						<Button type="danger" shape="circle" icon="garbage" className="delete-button" onClick={()=>this.handleDeleteQuestionItem(questionId,index)}/>
						<Button type="primary" shape="circle" icon="edit" onClick={this.handleEditQuestion} className="edit-button"/>
						<div className="question-item-options">
							<ul>
								{
									options.map((item,index)=>{
										return(
											<li key={index}>
											<span className={(answers===index?'right-answer':null)+' static-option'}>
											<b style={{marginRight:5}}>{choiceIndex[index]}.</b>{item}
											</span>
											</li>
										)
									})
								}
							</ul>
						</div>
						<div style={{marginTop:10}}>
							创建人：<h4 style={{display:'inline',marginRight:30}}>{name}</h4>
							创建时间：<h4 style={{display:'inline'}}>{created_at}</h4>
						</div>
					</div>
				</Card>
		)
	}
}