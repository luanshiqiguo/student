/**
 * Created by coder on 2017/2/28.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text} from 'react-native'
import {Icon} from 'react-native-elements'


class StSelfEvaluationStar extends Component{
	static propTypes = {
		full:PropTypes.bool,
		index:PropTypes.number.isRequired,
		select:PropTypes.func.isRequired,
	};

	render(){
			const {full,index,select} = this.props;
			if(full){
				return (
					<Icon name='star' size={30} color={'#ff7f50'} onPress={() => select(index)}/>
				);
			} else {
				return (
					<Icon name='star-border' size={30} color={'#5e6977'} onPress={() => select(index)}/>
				);
			}
	}
}


export default class StSelfEvaluation extends Component{
	static propTypes = {
		style:PropTypes.object,
		score:PropTypes.number,
	};

	constructor(props){
		super(props);

		let score = 0;
		if(props.score){
			score = props.score;
		}
		this.state = {
			score:score,
		}
	}

	handleSelect = (index) => {
		this.setState({score:index+1});

		const {onChange} = this.props;
		if(onChange){
			onChange(index+1);
		}
	};

	render(){
		let starts = [0,1,2,3,4];
		const {score} = this.state;
		const {style} = this.props;
		return (
			<View style={[style,{flexDirection:'row'}]}>
				{
					starts.map((item) => {
						return (
							<StSelfEvaluationStar key={item} full={item < score} index={item} select={this.handleSelect}/>
						);
					})
				}
			</View>
		);
	}
}