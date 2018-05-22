/**
 * Created by coder on 2017/3/13.
 */
import React,{Component} from 'react'

import {choiceIndex} from '../common/StQuestionCommon'
import './StChoiceQuestion.css'

export default class StChoiceQuestion extends Component{
	render() {
		const {question,options,answer,index} = this.props;
		return (
			<div className="choice-question">
				<h3>第{index+1}题. {question}</h3>
				<ul>
					{
						options.map((item,index) => {
							return (<li key={index}><span className={answer === index ? 'highlight':null}>{choiceIndex[index]}. {item}</span></li>);
						})
					}
				</ul>
			</div>
		);
	}
}