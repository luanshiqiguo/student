/**
 * Created by coder on 2017/3/13.
 */
import React,{Component,PropTypes} from 'react'
import {Input,Button,Checkbox,Icon,notification,Modal,Card} from 'antd'
import {choiceIndex} from '../common/StQuestionCommon'

export default class StQuestionItemEdit extends Component{
	static propTypes = {
		answers:PropTypes.number.isRequired,
		question:PropTypes.string.isRequired,
		options:PropTypes.array.isRequired,
		questionId:PropTypes.number.isRequired,
		index:PropTypes.number.isRequired,
		name:PropTypes.string.isRequired,
		created_at:PropTypes.string.isRequired,
		onSubmit:PropTypes.func.isRequired,
	};

	constructor(props){
		super(props);
		this.state={
			answers:props.answers,
			question:props.question,
			options:props.options,
		}
	};

	handleChangeAnswer=(e)=>{
		this.setState({answers:e.target.value})
	};

	handleChangeOption=(e, index)=>{
		let newOptions = [...this.state.options];
		newOptions[index] = e.target.value;
		this.setState({options:newOptions});
	};

	handleChangeQuestion=(e)=>{
		this.setState({question:e.target.value});
	};

	compareArray = (array1,array2) => {
		if(array1.length !== array2.length){
			return false;
		}

		for(let i in array1){
			if(array1[i] !== array2[i]){
				return false;
			}
		}

		return true;
	};

	handleUpdateQuestionItem = () =>{
		const {question,options,answers} = this.state;
		const prequestion = this.props.question;
		const preanswers = this.props.answers;
		const preoptions = this.props.options;
		const {onSubmit} = this.props;
		const {onCancel} = this.props;


		if(question===prequestion&&answers===preanswers&&this.compareArray(options,preoptions)){
			notification['warning']({
				message: '温馨提示',
				description:'题目内容未更改'
			});
			onCancel();
		}else {
			onSubmit(this.state);
		}

	};

	handleCancelUpdateQuestionItem = () => {
		const {question,options,answers} = this.state;
		const prequestion = this.props.question;
		const preanswers = this.props.answers;
		const preoptions = this.props.options;
		const {onCancel} = this.props;

		if(question===prequestion&&answers===preanswers&&this.compareArray(options,preoptions)) {
			onCancel();
		}else {
			Modal.confirm({
				title: '取消操作提示',
				content: '内容已被修改，您确认放弃此次编辑？',
				onOk: () => {
					this.setState({
						answers: this.props.answers,
						question: this.props.question,
						options: this.props.options,
					});
					onCancel();
				},
			});
		}
	};

	render(){
		const {question,options,answers} = this.state;
		const {questionId,created_at,name} = this.props;

		return(
			<Card>
				<div className="question-item">
					<Input addonBefore={'#'+questionId} value={question} size="large" className="edit-item-question" onChange={this.handleChangeQuestion}/>
					<div className="question-item-options" style={{marginLeft:20}}>
						<ul>
							{
								options.map((item,index)=>{
									return(
										<li key={index}>
											<Input addonBefore={choiceIndex[index]}
											       addonAfter={ <Checkbox checked={answers===index} value={index} onChange={this.handleChangeAnswer}/>}
											       value={item} className={answers===index?'right-answer':null}
											       onChange={(e)=>this.handleChangeOption(e,index)}
											/>
										</li>
									)
								})
							}
						</ul>
					</div>
					<Button type="circle" shape="circle" onClick={this.handleCancelUpdateQuestionItem} style={{float:'right',marginLeft:10}}><Icon type="close" /></Button>
					<Button type="circle" shape="circle" onClick={this.handleUpdateQuestionItem} style={{float:'right'}}><Icon type="check" /></Button>
					<div style={{marginTop:10}}>
						创建人：<h4 style={{display:'inline',marginRight:30}}>{name}</h4>
						创建时间：<h4 style={{display:'inline'}}>{created_at}</h4>
					</div>
				</div>
			</Card>
		)
	}
}