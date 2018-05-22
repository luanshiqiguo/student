/**
 * Created by coder on 2017/2/20.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text,StyleSheet,TouchableNativeFeedback} from 'react-native'
import {Icon} from 'react-native-elements'

class StPracticeMenuItem extends Component{
	static propTypes = {
		title:PropTypes.string.isRequired,
		icon:PropTypes.string.isRequired,
		page:PropTypes.number.isRequired,
		onLink:PropTypes.func.isRequired,
		selected:PropTypes.bool.isRequired,
	};

	handlePress = () => {
		const {onLink,page} = this.props;
		onLink(page);
	};

	render(){
		const {title,icon,selected,numOfTaskDoing} = this.props;
		return (
			<TouchableNativeFeedback onPress={this.handlePress}>
				<View style={styles.menuItem}>
					<Icon name={icon} size={35} color={selected?'#0f88eb':'#5e6977'}/>
					<Text style={{fontSize:13,marginTop:10,color:selected?'#0f88eb':'#5e6977'}}>{title}</Text>
					{
						numOfTaskDoing?
							<View style={{ backgroundColor: 'red',height:20,minWidth:20,borderRadius:10,marginRight:-40,marginTop:-68,justifyContent:'center',alignItems:'center'}}>
								<Text style={{color:'white'}}>{numOfTaskDoing}</Text>
							</View>
							:
							null
					}
				</View>
			</TouchableNativeFeedback>
		);
	}
}

export default class StPracticeMenu extends Component{
	static propTypes = {
		onLink:PropTypes.func.isRequired,
	};

	render(){
		const {onLink,page,arrayOfTasksDoing} = this.props;
		return (
			<View style={styles.menu}>
				<StPracticeMenuItem title="课前预习" icon='fiber-new' page={0} onLink={onLink} selected={page == 0} numOfTaskDoing={arrayOfTasksDoing[0]}/>
				<StPracticeMenuItem title="课后作业" icon='library-books' page={1} onLink={onLink} selected={page == 1} numOfTaskDoing={arrayOfTasksDoing[1]}/>
				<StPracticeMenuItem title="每周总结" icon='bookmark' page={2} onLink={onLink} selected={page == 2} numOfTaskDoing={arrayOfTasksDoing[2]}/>
				<StPracticeMenuItem title="实验测试" icon='keyboard' page={3} onLink={onLink} selected={page == 3} numOfTaskDoing={arrayOfTasksDoing[3]}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	menu:{
		height:85,
		backgroundColor:'#F5F5F5',
		flexDirection:'row',
		justifyContent:'space-around'
	},
	menuItem:{
		flex:1,
		alignItems:'center',
		paddingTop:10
	}
});