/**
 * Created by abing on 2017/7/25.
 */

import React,{Component} from 'react'
import {Tabs} from 'antd'
const TabPane = Tabs.TabPane;

import StQuestion from './StQuestion'
import StFAQ from './StFAQ'
import StQaHistory from  './StQaHistory'
import {HostPost} from '../ajax/index.js'

import './StSmartQA.css'
export default class StSmartQA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            selectTab:1,
	        history_data:[],
        };
    }
    addHistory=(question)=>{
    	let old_history_data=this.state.history_data;
        let key = old_history_data.length+1;
        old_history_data.unshift({
            key: key,
            question:question,
            time:new Date().toLocaleString( ),
        });
        this.setState({history_data:old_history_data});
	};

    componentDidMount(){
        HostPost('/historyQuestion', {}, true).then(({json}) => {
            if (json.error === 0) {
                let arr = json.questions;
                const length = arr.length;
                let history = [];
                for (let i = length - 1; i >= 0; i--) {
                    history.push({
                        key: i,
                        question: arr[i].keyword,
                        time: arr[i].created_at,
                    })
                }
                this.setState({history_data: history});
            }
        });
    };

    render(){
    	const {history_data}=this.state;
		return(
			<div className="StSmartQA-content" >
				<div className="StSmartQA-title"><h1>智能问答<small>有不会的题可以在这提问哦</small></h1></div>
				<Tabs>
					<TabPane tab="智能问答" key="1" >
						<StQuestion onAddhistory={this.addHistory}/>
					</TabPane>
					<TabPane tab="常见问题" key="2">
						<StFAQ/>
					</TabPane>
					<TabPane tab="查询记录" key="3" >
	                    <StQaHistory data={history_data}/>
					</TabPane>
				</Tabs>
			</div>
		);
    }
}