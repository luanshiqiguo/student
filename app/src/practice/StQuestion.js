/**
 * Created by coder on 2017/2/27.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native'
import {TASK_STATE_FINISH,TASK_STATE_EXPIRE,TASK_STATE_DOING} from '../const/StTaskState'

const prefixText = ['A','B','C','D'];

export default class StQuestion extends Component{
	static propTypes = {
		index:PropTypes.number.isRequired,
		answer:PropTypes.number,
		select:PropTypes.func.isRequired,
		content:PropTypes.array.isRequired,//题目数组，当前为题目为content[index]
	};

	getReferenceAnswer = (referenceAnswer,optionOrder) => {
		for(let i=0;i<optionOrder.length;i++){
			if(referenceAnswer == optionOrder[i]){
				return prefixText[i];
			}
		}
		return `将于${referenceAnswer}公布`;
	};

	render(){

		const {index,answer,select,orders,referenceAnswer,taskStatus} = this.props;
		const questionOrder = orders.questionOrder;
		const optionOrder = orders.optionOrder[index];
		const total = this.props.content.length;
		const content = JSON.parse(this.props.content[questionOrder[index]].content);

		return (
			<View>
				<View style={{height:40,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#E8E8E8',alignItems:'center',paddingHorizontal:15,marginBottom:10}}>
					<Text style={{color:'#000',fontSize:16}}>第{index+1}题：</Text>
					{
						taskStatus == TASK_STATE_EXPIRE?
							<Text style={{fontSize:14,color:'red'}}>已截止，不可提交</Text>
							:
							null
					}
					<Text style={{fontSize:15}}>共{total}题</Text>
				</View>

				<Text style={{padding:15}}>{content.question}</Text>
				{
					optionOrder.map((item,i) => {
						return (
							<TouchableOpacity onPress={() => select(item)} key={i}>
								<View style={answer === item && answer === referenceAnswer ?
										styles.styleRightItem
										:
										answer === item?
											styles.styleWrongItem
											:
											styles.styleUnselectItem}
								>
									<Text>{prefixText[i]}. {content.options[item]}</Text>
								</View>
							</TouchableOpacity>
						);
					})
				}
				{
					taskStatus == TASK_STATE_DOING ?
						null
						:
						<Text style={{padding:15,fontSize:15}}>参考答案：{this.getReferenceAnswer(referenceAnswer,optionOrder)}</Text>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	styleUnselectItem:{
		marginBottom:20,
		marginLeft:20,
		marginRight:20,
		padding:12,
		backgroundColor:'#fff',
		borderRadius:5
	},
	styleWrongItem:{
		marginBottom:20,
		marginLeft:20,
		marginRight:20,
		padding:10,
		backgroundColor:'#fff',
		borderRadius:5,
		borderColor:'red',
		borderWidth:2
	},
	styleRightItem:{
		marginBottom:20,
		marginLeft:20,
		marginRight:20,
		padding:10,
		backgroundColor:'#fff',
		borderRadius:5,
		borderColor:'#63B8FF',
		borderWidth:2
	}
});