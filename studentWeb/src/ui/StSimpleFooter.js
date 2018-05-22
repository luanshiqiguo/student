/**
 * Created by mi on 2017/2/7.
 */
import React from 'react'
import './StSimpleFooter.css'
import config from '../config'
import {Link} from 'react-router'
import { Popover } from 'antd'

export default class StSimpleFooter extends React.Component{
	render(){
		return (
			<div id="foot-content">
				<b>{config.email}</b> | 武汉理工大学 版权所有 |
				<Popover content={<img src={require('./downloadApp.png')} alt="点击下载" style={{height:150,width:150}}/>}>
					<a href="http://mt.wtulip.com/download/computing_dream.apk"> 安卓APP下载</a>
				</Popover>
				<div className="version">
						version {config.version} |&nbsp;
						<Link to="change-log">更新日志</Link>
                </div>
			</div>
		);
	}
}