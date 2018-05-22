/**
 * Created by mi on 2017/2/7.
 */
import React, {Component} from 'react'
import './StChangeLog.css'

export default class ChangeLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			changeLog: {list: []}
		};

		let that = this;
		fetch('./static/assets/changelog.json')
			.then(function (response) {
				return response.json();
			}).then(function (json) {
			that.setState({changeLog: json});
		});
	}

	render() {
		const {changeLog} = this.state;

		return (
			<div id="change-log" className="main-box">
				<h1>修改日志</h1>
				{
					changeLog.list.map((node, index) => {
						return (
							<div key={index}>
								<h3 className="page-header">{node.title}</h3>
								<ul>
									{
										node.items.map((item, index) => {
											return <li key={index}>{item}</li>
										})
									}
								</ul>
							</div>
						);
					})
				}
			</div>
		);
	}
}