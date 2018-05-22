/**
 * Created by coder on 2017/2/27.
 */
import React,{Component} from 'react'
import {ScrollView,View,Text,Image,StyleSheet,BackAndroid} from 'react-native'
import StNavHead from '../StNavHead'
import changeLog from '../config/changelog.json'

export default class StAbout extends Component{
	componentWillMount() {
		BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
	}

	componentWillUnmount(){
		BackAndroid.removeEventListener('hardwareBackPress',this.handleBack);
	}

	handleBack = () => {
		this.props.navigator.pop();
		return true;
	};

	render(){
		return (
			<View style={{flex:1,backgroundColor:'#f4f4f4'}}>
				<StNavHead title="更新日志" back={this.handleBack} />
				<ScrollView>
					{
						changeLog.list.map((node, index) => {
							return (
								<View key={index} style={{padding:10}}>
									<Text style={{fontSize:20,color:'#000',borderBottomWidth:1,borderBottomColor:'#eee',paddingBottom:6}}>{node.title}</Text>
										{
											node.items.map((item, index) => {
												return <Text key={index} style={{fontSize:15,paddingLeft:20,paddingBottom:3}}>{item}</Text>
											})
										}
								</View>
							);
						})
					}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	styleImage:{
		borderRadius:35,
		height:70,
		width:70,
		marginTop:40,
		alignSelf:'center',
	},
});
