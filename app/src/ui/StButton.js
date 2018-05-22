/**
 * Created by coder on 2017/2/28.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text,StyleSheet,TouchableNativeFeedback} from 'react-native'

export default class StButton extends Component{
	static propTypes = {
		title:PropTypes.string.isRequired,
		disabled:PropTypes.bool,
		style:PropTypes.object,
		onPress:PropTypes.func,
	};

	handlePress = () => {
		const {onPress} = this.props;
		if(onPress){
			onPress();
		}

	};

	render(){
		const {title,disabled,style} = this.props;
		return (
			<TouchableNativeFeedback onPress={this.handlePress} disabled={disabled}>
				<View style={[style,disabled ? styles.styleViewCommitDisabled : styles.styleViewCommit]} >
					<Text style={{color:'#fff'}} >{title}</Text>
				</View>
			</TouchableNativeFeedback>
		);
	}
}

const styles = StyleSheet.create({
	styleViewCommit:{
		marginTop:15,
		marginLeft:10,
		marginRight:10,
		backgroundColor:'#0f88eb',
		height:35,
		borderRadius:18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	styleViewCommitDisabled:{
		marginTop:15,
		marginLeft:10,
		marginRight:10,
		backgroundColor:'#ADADAD',
		height:35,
		borderRadius:18,
		justifyContent: 'center',
		alignItems: 'center',
	},
});