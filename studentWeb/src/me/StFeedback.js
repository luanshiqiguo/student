/**
 * Created by abing on 2017/3/14.
 */
import React,{Component} from 'react'
import {Input,Button,notification,Icon} from 'antd'
import {HostPost} from '../ajax/index'


export default class StFeedback extends Component{
	constructor(props){
		super(props);
		this.state={
			feedback:'',
			loading:false,
		}
	}

	handleChangeFeedback = (e) => {
		this.setState({feedback:e.target.value})
	};

	handleSubmitFeedback=()=>{
		const {feedback} = this.state;
		this.setState({loading:true});
		HostPost('/feedback',{content:feedback,client:'web'},true).then(({json})=>{
			if (json.error === 0){
				notification['success']({
					message: '温馨提示',
					description: '您的意见反馈已提交成功！',
				});
				this.setState({feedback:'',loading:false});
			}else {
				this.setState({loading:false});
				notification['error']({
					message: '温馨提示',
					description: '很抱歉，提交出错！',
				});
			}
		}).catch((error)=>{
			this.setState({loading:false});
			notification['error']({
				message: '提交出错！',
				description: error,
			});
		})
	};

	render(){
		const {feedback,loading} = this.state;
		const disabled = (feedback.trim()) ? true : false;

		return(
			<div>
				<div className="info-title"><Icon type="message" /><span>意见反馈</span></div>
				<Input type="textarea" placeholder="在此输入您的意见"
				       autosize={{ minRows: 10, maxRows: 15 }}
				style={{marginTop:30,fontSize:16}}
				onChange={this.handleChangeFeedback}
				value={feedback}
				/>
				<div style={{padding:40,textAlign:'center'}}>
					{
						disabled ?
							<Button type="primary" onClick={this.handleSubmitFeedback} loading={loading}>提交</Button>
							:
							<Button type="primary" disabled>提交</Button>
					}
				</div>
			</div>
		)
	}
}