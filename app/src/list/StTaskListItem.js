/**
 * Created by coder on 2017/2/28.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text,TouchableNativeFeedback} from 'react-native'
import {Icon} from 'react-native-elements'

import {TASK_STATE_FINISH,TASK_STATE_EXPIRE,TASK_STATE_DOING} from '../const/StTaskState'

export default class StTaskListItem extends Component{
	static propTypes = {
		data:PropTypes.object.isRequired,
		icon:PropTypes.string.isRequired,
		index:PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
		select:PropTypes.func.isRequired,
	};

	handleSelect = () =>{
		const {data,select} = this.props;
		if(select){
			select(data);
		}
	};

	getStateBadge = (taskState) => {
		switch(taskState){
			case TASK_STATE_FINISH:
				return <Icon name="check" iconStyle={{padding:1,marginRight:5,fontSize:12,backgroundColor:'#ACDF56',borderRadius:8,color:'#fff'}}/>;
			case TASK_STATE_EXPIRE:
				return <Icon name="close" iconStyle={{padding:1,marginRight:5,fontSize:12,backgroundColor:'#DB3724',borderRadius:8,color:'#fff'}}/>;
			case TASK_STATE_DOING:
				return <Icon name="more-horiz" iconStyle={{padding:1,marginRight:5,fontSize:12,backgroundColor:'#0FB8E9',borderRadius:8,color:'#fff'}}/>;
		}
	};

	getTaskState = () =>{
		const {data} = this.props;
		if(data.content){
			return TASK_STATE_FINISH;
		}
		return data.expire ? TASK_STATE_EXPIRE : TASK_STATE_DOING;
	};

	render(){
		const {data,icon,index} = this.props;
		let taskState = this.getTaskState();

		return (
			<TouchableNativeFeedback onPress={this.handleSelect}>
				<View style={{height:55,padding:5,borderBottomWidth:1,borderBottomColor:'#eeeeee',flexDirection:'row'}}>
					<View style={{width:46,justifyContent:'center'}}>
						<Icon name={icon} size={30} color={'#5e6977'}/>
					</View>
					<View style={{flex:1}}>
						<View style={{flex:2,flexDirection:'row',justifyContent:'space-between'}}>
							<Text style={{fontSize:16,color:'#000',paddingRight:10,flex:2}} numberOfLines={1}>{parseInt(index)+1}{". "+data.title}</Text>
							<Text style={{fontSize:10,marginTop:3,marginRight:10,flex:1,textAlign:'right'}} numberOfLines={1}>{data.deadLine}</Text>
						</View>
						<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
							<Text style={{fontSize:10,flex:2,paddingRight:10}} numberOfLines={1}>{data.target}</Text>
							<View style={{flex:1,alignItems:'flex-end',marginRight:10}}>
								{this.getStateBadge(taskState)}
							</View>
						</View>
					</View>
				</View>
			</TouchableNativeFeedback>
		);
	}
}