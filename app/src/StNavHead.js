/**
 * Created by coder on 2017/2/20.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text,TouchableNativeFeedback} from 'react-native'
import {Icon} from 'react-native-elements'

export default class StNavHead extends Component{
	static propTypes = {
		title:PropTypes.string.isRequired,
		back:PropTypes.func,
	};

	handleBack = () => {
		const {back} = this.props;
		if(back){
			back();
		}
	};

	renderBackButton = () => {
		return (
			<TouchableNativeFeedback onPress={this.handleBack}>
				<View style={{paddingTop:10,paddingLeft:10,paddingRight:10}}>
					<Icon name="keyboard-arrow-left" size={30} color={'#fff'}/>
				</View>
			</TouchableNativeFeedback>
		);
	};

	render(){
		const {title,back} = this.props;
		return (
			<View style={{backgroundColor:'#0f88eb',flexDirection:'row',height:70,alignItems:'flex-end',paddingBottom:10}}>
				<View style={{flexDirection:'row'}}>
					{back ? this.renderBackButton() : null}
					<Text style={{paddingLeft:back ? 0 : 10,marginTop:10,color:'#fff',fontSize:20}}>{title}</Text>
				</View>
			</View>
		);
	}
}
