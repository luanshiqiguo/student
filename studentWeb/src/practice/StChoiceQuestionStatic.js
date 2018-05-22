/**
 * Created by coder on 2017/3/13.
 */
import React,{Component,PropTypes} from 'react'
import {choiceIndex} from '../common/StQuestionCommon'
import './StChoiceQuestion.css'

const list = ['A','B','C','D'];

export default class StChoiceQuestionStatic extends Component{
	static propTypes = {
		question:PropTypes.string.isRequired,
		options:PropTypes.array.isRequired,
		answer:PropTypes.number.isRequired,
		index:PropTypes.number.isRequired,
	};

	getReferenceAnswer = () => {
		const {referenceAnswer,optionsOrder} = this.props;
		for(let i=0;i<optionsOrder.length;i++){
			if(referenceAnswer == optionsOrder[i]){
				return list[i];
			}
		}
		return `将于${referenceAnswer}公布`;
	};

	render() {
		const {question,options,answer,index,optionsOrder,referenceAnswer} = this.props;
		return (
			<div className="choice-question">
				<h2>第{index+1}题. {question}
					<small style={{color:'green',marginLeft:15}}>参考答案：</small>
					<span style={{color:'green'}}>{this.getReferenceAnswer()}</span>
				</h2>
				<ul>
					{
						optionsOrder.map((item,index) => {
							return (
								<li key={index} style={{fontSize:17}}>
									<span className={answer === item && answer === referenceAnswer?
														'rightAnswer'
														:
														answer === item?
															'wrongAnswer'
															:
															null

									}>
										{choiceIndex[index]}. {options[item]}
									</span>
								</li>
							);
						})
					}
				</ul>
			</div>
		);
	}
}