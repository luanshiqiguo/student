/**
 * Created by crazycooler on 2017/3/5.
 */
import React,{Component} from 'react'
import StTaskBankList from './StTaskBankList'
import StTaskDetail from './StTaskDetail'

/**
 * 在组件下有两个compoent：detail和list
 * detail页面：用于显示task的详细信息，总结类型的task是没有detail的，detail页面每次都是重新创建
 * list页面：显示所有的task任务，第一次创建之后，切换到detail页面不会被unmount
 *
 */

export default class StTaskBank extends Component{
	constructor(props){
		super(props);

		this.isListInit = false;
	}

	//是否detail页面
	isDetail = () => {
		return /^\/task-bank\/detail.*/.test(this.props.location.pathname);
	};

	render(){
		const isDetailPage = this.isDetail();
		const {location,router,routeParams} = this.props;

		if(!isDetailPage){
			this.isListInit = true;
		}

		let listPage = null;
		if(this.isListInit){
			listPage = (
				<div style={{display:isDetailPage ? 'none':'block'}}>
					<StTaskBankList router={router}/>
				</div>
			);
		}

		return (
			<div className="main-box">
				{listPage}
				{isDetailPage ? <StTaskDetail location={location} router={router} routeParams={routeParams}/> : null}
			</div>
		);
	}
}