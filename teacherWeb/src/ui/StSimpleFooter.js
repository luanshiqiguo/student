/**
 * Created by mi on 2017/2/7.
 */
import React from 'react'
import './StSimpleFooter.css'
import config from '../config'
import {Link} from 'react-router'

export default class StSimpleFooter extends React.Component{
	render(){
		return (
			<div id="foot-content">
				<b>{config.email}</b> | 武汉理工大学 版权所有
				<div className="version">
					version {config.version} |&nbsp;
					<Link to="change-log">修改日志</Link>
				</div>
			</div>
		);
	}
}