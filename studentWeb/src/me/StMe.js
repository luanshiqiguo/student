/**
 * Created by coder on 2017/3/14.
 */
import React,{Component} from 'react'
import {Tabs,Icon} from 'antd'
import StInfo from './StInfo'
import StChangeEmail from './StChangeEmail'
import StChangePassword from './StChangePassword'
import StFeedback from './StFeedback'

import './StMe.css'

const TabPane = Tabs.TabPane;

const TAB_INFO = '1';
const TAB_CHANGE_EMAIL = '2';
const TAB_CHANGE_PASSWORD = '3';
const TAB_FEEDBACK = '4';

export default class StMe extends Component{

	constructor(props){
		super(props);
		this.state={
			selectTab:TAB_INFO
		}
	}

	handleChangeTabs = (key) => {
		this.setState({selectTab:key});
	};

	render(){
		const {selectTab} = this.state;

		return (
			<div className="me-content">
				<div className="StMe-title">
					<h1>个人中心</h1>
				</div>
				<Tabs activeKey={selectTab} onChange={this.handleChangeTabs} tabPosition='left' className='tabs'>
					<TabPane tab={<span style={{fontSize:15}}><Icon type="user" />个人信息</span>} key={TAB_INFO}>
						<StInfo />
					</TabPane>
					<TabPane tab={<span style={{fontSize:15}}><Icon type="mail" />修改邮箱</span>} key={TAB_CHANGE_EMAIL}>
					<StChangeEmail />
					</TabPane>
					<TabPane tab={<span style={{fontSize:15}}><Icon type="lock" />修改密码</span>} key={TAB_CHANGE_PASSWORD}>
						<StChangePassword />
					</TabPane>
					<TabPane tab={<span style={{fontSize:15}}><Icon type="message" />意见反馈</span>} key={TAB_FEEDBACK}>
						<StFeedback />
					</TabPane>
				</Tabs>
			</div>

		);
	}
}