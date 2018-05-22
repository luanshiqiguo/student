/**
 * Created by coder on 2017/2/28.
 */
import React,{Component} from 'react'

import {View,Button,AsyncStorage} from 'react-native'

async function wwait(){
	return new Promise((resolve,reject) => {
		let count = 1;
		let id = setInterval(() => {
			count++;
			if(count > 5){
				resolve('6666');
				clearInterval(id);
			}
		},1000);
	});
}

async function wwait2(){
	return await wwait();
}

export default class StTest extends Component{

	handlePress1 = async () => {
		console.log('btn1');
		wwait2().then((res) =>{
			console.log(res);
		})

	};

	handlePress2 = async () => {
		console.log('btn2');

	};

	render(){
		return (
			<View style={{flexDirection:'row'}}>
				<Button title="btn1" onPress={this.handlePress1} />
				<Button title="btn2" onPress={this.handlePress2} />
			</View>
		);
	}
}