/**
 * Created by abing on 2017/5/1.
 */
import React,{Component,PropTypes} from 'react'
import {View,Image,Text} from 'react-native'

export default class StLoadPage extends Component{
	static propTypes = {
		loadStatus:PropTypes.string.isRequired,
	};

	getSource = (loadStatus) => {
		if(loadStatus === 'error'){
			return(
				<Image
					style={{height:50,width:50}}
					source={require('../../img/loadError.png')}
				/>
			)
		}
		return(
			<Image
				style={{height:50,width:50}}
				source={require('../../img/loading.png')}
			/>
		)
	};

	getTitle = (loadStatus) => {
		if(loadStatus === 'error'){
			return '很抱歉！加载出错~'
		}
		return '正在加载，么么哒~'
	};

	render(){
		const {loadStatus} = this.props;
		const Image = this.getSource(loadStatus);
		const title = this.getTitle(loadStatus);

		return(
			<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
				{Image}
				<Text style={{marginTop:30}}>{title}</Text>
			</View>
		)
	}
}