/**
 * Created by abing on 2017/3/11.
 */

import React,{Component,PropTypes} from 'react'
import { Modal,Input,Checkbox,message,notification} from 'antd';
import {HostPost} from '../ajax/index'
import {choiceIndex} from '../common/StQuestionCommon'

import './StAddQuestion.css'

export default class AddQuestionModal extends Component {
	static propTypes = {
		onCancelAddQuestion:PropTypes.func.isRequired,
		onAddNewQuestionToListData:PropTypes.func.isRequired,
	};

	constructor(props){
		super(props);
		this.state = {
			confirmLoading:false,
			answers:'',
			question:'',
			options:[null,null,null,null]
		};
	}

	validatorData = () => {
		const {question,options,answers} = this.state;
		if (question&&answers!==''){
			for(let item of options){
				if(!item){
					return false
				}
			}
			return true;
		}else {
			return false;
		}
	};

	handleOk = () => {
		const validatorResult = this.validatorData();

		if(!validatorResult){
			message.error('您还有数据没填！');
			return;
		}

		const {question,options,answers} = this.state;
		const {onAddNewQuestionToListData} = this.props;

		this.setState({confirmLoading: true,});

		const data={
			content:JSON.stringify({
				"question":question,
				"options":options
			}),
			answers:answers
		};

		HostPost('/add-question',{...data},true).then(({json})=>{
			if (json.error === 0){
				this.setState({
					confirmLoading: false,
				});
				let questionId = json.id;
				let name = json.name;
				let created_at = json.created_at;
				//更改list数据
				onAddNewQuestionToListData(questionId,question,answers,options,name,created_at);
			}else {
				throw json;
			}
		}).catch((error)=>{
			this.setState({confirmLoading: false});

			notification['error']({
				message: '温馨提示',
				description:'很抱歉！创建失败'
			});
		})

	};
	handleCancel = () => {
		this.props.onCancelAddQuestion();
	};

	handleChangeQuestion=(e)=>{
		this.setState({question:e.target.value})
	};

	handleChangeOptions=(e, index)=>{
		let newOptions = [...this.state.options];
		newOptions[index.index] = e.target.value;
		this.setState({options:newOptions});
	};

	handleChangeAnswer=(e)=>{
		this.setState({answers:e.target.value});
	};

	render() {
		const {question,options,answers} = this.state;

		return (
			<div>
				<Modal title="创建新题目"
				       visible={true}
				       onOk={this.handleOk}
				       confirmLoading={this.state.confirmLoading}
				       onCancel={this.handleCancel}
				       width='60%'
				>
					<Input onChange={this.handleChangeQuestion} addonBefore="题目" style={{fontWeight:'blod',fontSize:'2em',height:45}} value={question}/>
					<ul>
						{
							choiceIndex.map((item,index)=>{
								return (
									<li className="option-add" key={index}>
										<Input onChange={(e)=>this.handleChangeOptions(e,{index})}
										       addonBefore={item}
										       addonAfter={<Checkbox checked={answers===index} onChange={this.handleChangeAnswer} value={index}/>}
										       value={options[index]}
										       className={answers===index?'right-answer':null}
										       style={{fontSize:'1.5em',height:35}}
										/>
									</li>
								)
							})
						}
					</ul>
				</Modal>
			</div>
		);
	}
}
