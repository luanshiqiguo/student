/**
 * Created by coder on 2017/3/13.
 */
import React,{Component,PropTypes} from 'react'
import { Radio } from 'antd';
import {choiceIndex} from '../common/StQuestionCommon'
import './StChoiceQuestion.css'
const RadioGroup = Radio.Group;

export default class StChoiceQuestion extends Component{
	static propTypes = {
		question:PropTypes.string.isRequired,
		options:PropTypes.array.isRequired,
		index:PropTypes.number.isRequired,
		questionId:PropTypes.number.isRequired,
		onChange:PropTypes.func,
	};

	render() {
		const {question,options,index,onChange,questionId,optionsOrder} = this.props;
		return (
			<div className="choice-question">
				<h2>第{index+1}题. {question}</h2>
				<RadioGroup onChange={(e) => onChange(questionId,e)}>
					{
						optionsOrder.map((item,index) => {
							return (<Radio className="choice-item" key={index} value={item}>{choiceIndex[index]}. {options[item]}</Radio>);
						})
					}
				</RadioGroup>
			</div>
		);
	}
}