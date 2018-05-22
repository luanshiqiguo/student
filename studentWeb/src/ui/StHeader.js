/**
 * Created by mi on 2017/2/7.
 */
import React from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import './StHeader.css'
import {Menu} from 'antd'
import {Link} from 'react-router'
import {ACTION_SIGN_OUT,ACTION_CLEAR_TASK_LISTS} from '../store/action'

import {HostPost} from '../ajax'

const navTitles = [
	{href:'/practice',title:'习题练习',key:'practice'},
	{href:'/summary',title:'每周总结',key:'summary'},
	{href:'/achievement',title:'我的成就',key:'achievement'},
	{href:'/smartQA',title:'智能问答',key:'smartQA'},
	{href:'/me',title:'个人中心',key:'me'},
];

const navMap = {
	'/practice':'practice',
	'/summary':'summary',
	'/achievement':'achievement',
	'/me':'me',
	'/sign-in':'sign-in',
	'/smartQA':'smartQA',
};


class StHeader extends React.Component{
	constructor(props){
		super(props);
		this.state = {

		}
	}

	handleSelect = (item) => {
		//this.setState({selectedMenu:[item.key]});
	};

	handleHomeSelect = () => {
		//this.setState({selectedMenu:['1']});
	};

	handleSignOutInner = () => {
		localStorage.setItem('token','');
		this.props.signOut();
		this.props.clearTask();
		hashHistory.push('sign-in');
	};

	handleSignOut = () => {
		const token = localStorage.getItem('token');
		HostPost('/sign-out',{token}).then(({json}) => {
			this.handleSignOutInner();
			localStorage.clear();
		}).catch((error)=>{
			// console.log(error);
			this.handleSignOutInner();
		});

	};

	render(){
		const {login,userInfo,pathname} = this.props;
		let menuItems = [];

		let selectedMenu = 'practice';
		if(navMap.hasOwnProperty(pathname)){
			selectedMenu = navMap[pathname];
		}

		if(login){
			navTitles.map((item) => {
				menuItems.push(<Menu.Item key={item.key}><Link to={item.href}>{item.title}</Link></Menu.Item>);
			});
			menuItems.push(<Menu.Item key="sign-out"><a onClick={this.handleSignOut}>退出 ( {userInfo.name} )</a></Menu.Item>);
		} else {
			menuItems.push(<Menu.Item key="sign-in"><Link to={'/sign-in'}>登录</Link></Menu.Item>);
		}
		return (
			<header id="header">
				<div className="logo" >
					<Link to={login?'/practice':'/sign-in'} onClick={this.handleHomeSelect}>
						<img src="./static/assets/logo.png" alt=""/>
						<span className="student-version">学生版</span> <span>Computing Dream</span>
					</Link>
				</div>
				<Menu
					mode="horizontal"
					selectedKeys={[selectedMenu]}
					style={{ lineHeight: '78px',float:'right' }}
					onSelect={this.handleSelect}
				>
					{menuItems}
				</Menu>
			</header>
		);
	}
}

const mapStateToProps = (state,ownProps) => {

	return {
		login:state.auth.login,
		userInfo : state.auth.userInfo,
	}
};

const mapDispatchToProps = {
	signOut:() =>{
		return {
			type:ACTION_SIGN_OUT,
		};
	},

	clearTask:() => {
		return {
			type:ACTION_CLEAR_TASK_LISTS,
		}
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StHeader);