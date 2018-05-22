/**
 * Created by crazycooler on 2017/3/5.
 */
import React,{Component} from 'react'
import StQuestionList from './StQuestionList'
import { BackTop} from 'antd';


export default class App extends Component {

	render() {

		return (
			<div style={{width:'60%',minHeight:600,margin:'auto',paddingBottom:60,backgroundColor:'#fff'}}>
				<StQuestionList/>
				<div>
					<BackTop style={{right:250,bottom:200}}/>
				</div>
			</div>
		);
	}
}