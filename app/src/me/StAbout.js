/**
 * Created by coder on 2017/2/27.
 */
import React,{Component} from 'react'
import {View,Text,Image,StyleSheet,BackAndroid} from 'react-native'
import StNavHead from '../StNavHead'

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
				<StNavHead title="关于" back={this.handleBack} />
				<View style={{justifyContent:'space-between',flexDirection:'column',flex:1}}>
					<View>
						<Image
							style={styles.styleImage}
							source={require('../../img/logo123.png')}/>

						<Text style={{textAlign:'center',fontSize:24,color:'#000',marginTop:10}}>计算机导论课程学习</Text>

						<Text style={{textAlign:'center',marginTop:40,fontSize:12}}>当前版本号：0.0.4</Text>
					</View>

					<View>
						{/*<Text style={{textAlign:'center',fontSize:12,color:'#6296f9'}}>计算机导论课程学习用户服务条款</Text>*/}
						<Text style={{textAlign:'center',marginTop:30,marginBottom:40,fontSize:10}}>武汉理工大学 版权所有</Text>
					</View>
				</View>
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
