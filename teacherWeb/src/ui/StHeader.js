/**
 * Created by mi on 2017/2/7.
 */
import React from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import './StHeader.css'
import {Menu} from 'antd'
import {Link} from 'react-router'
import {ACTION_SIGN_OUT} from '../store/action'

import {HostPost} from '../ajax'

const navTitles = [
	{href:'/student-info',title:'学生信息',key:'student-info'},
	{href:'/task-bank',title:'任务发布',key:'task-bank'},
	{href:'/task-report',title:'任务报告',key:'task-report'},
	{href:'/question-bank',title:'题库',key:'question-bank'},
	{href:'/feedback',title:'学生反馈',key:'feedback'},
];

const navMap = {
	'/student-info':'student-info',
	'/student-detail':'student-info',
	'/task-bank':'task-bank',
	'/question-bank':'question-bank',
	'/task-report':'task-report',
	'/sign-in':'sign-in',
	'/feedback':'feedback',
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
		hashHistory.push('sign-in');
	};

	handleSignOut = () => {
		const token = localStorage.getItem('token');
		HostPost('/sign-out',{token}).then(({json}) => {
			this.handleSignOutInner();
			localStorage.clear();
		}).catch((error)=>{
			console.log(error);
			this.handleSignOutInner();
		});

	};

	render(){
		const {login,userInfo,pathname} = this.props;
		let menuItems = [];

		let selectedMenu = 'student-info';
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
					<Link to={login?'/student-info':'/sign-in'} onClick={this.handleHomeSelect}>
						<img src="./static/assets/logo.png" alt=""/>
						<span className="student-version">教师版</span> <span>Computing Dream</span>
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
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StHeader);