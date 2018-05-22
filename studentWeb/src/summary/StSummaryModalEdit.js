/**
 * Created by abing on 2017/3/15.
 */
import React,{Component} from 'react'
import {ACTION_UPDATE_TASK_LISTS} from '../store/action'
import {Modal,Input,Rate,message,notification} from 'antd'
import {connect} from 'react-redux'
import {HostPost} from '../ajax'


import './StSummaryModal.css'


class StSummaryModalEdit extends Component{

	constructor(props){
		super(props);
		this.state={
			confirmLoading:false,
			content:'',
			score:null,
			startDate:new Date(),
		}
	}

	handleOk = () =>　{
		const{content,score}=this.state;

		if(!content.trim()){
			message.error('总结内容不可为空！');
		}else if(!score){
			message.error('自我评价不可为空！');
		}else {
			this.setState({confirmLoading:true});
			const time = this.consumeTime();
			const parameter={
				taskId:this.props.data.id,
				content:JSON.stringify({
					content:content,
					score:score
				}),
				type:4,
				time:time,
		};
			HostPost('/add-task-report',{...parameter},true).then(({json})=>{
				if(json.error===0){
					const {index} = this.props;
					let data=[...this.props.taskSummary];
					data[index].content = JSON.stringify({
						content:content,
						score:score,
					});
					const newTaskSummary = {'taskSummary':data};
					this.props.updateTaskLists(newTaskSummary);

					notification['success']({
						message: '温馨提示',
						description: '提交成功！',
					});

					this.props.onCancle();
				}else {
					notification['error']({
						message: '温馨提示',
						description: '很抱歉，提交失败！',
					});
					this.setState({confirmLoading:false});
				}
			}).catch((error)=>{
				notification['error']({
					message: '网络错误',
				});
				this.setState({confirmLoading:false});
			})
		}

	};

	handleCancel = () =>　{
		this.props.onCancle();
	};

	handleChangeContent= (e) => {
		this.setState({content:e.target.value});
	};

	handleChangeScore= (score) => {
			this.setState({score:score})
	};

	//计时
	consumeTime = () => {
		const endDate = new Date();
		const startDate = this.state.startDate;

		const millisecond = endDate.getTime()-startDate.getTime();//毫秒

		return Math.round(millisecond / 1000);//秒
	};

	render(){
		const{modalVisible,data} = this.props;
		const{confirmLoading,score} = this.state;
		return(
		<Modal title="每周总结"
		       visible={modalVisible}
		       onOk={this.handleOk}
		       confirmLoading={confirmLoading}
		       onCancel={this.handleCancel}
		       key={data.id}
		       width='60%'
		>
			<div>
				<span className="summary-title">{data.title}</span>
				<span className="summary-target">{data.target}</span>
				<span className="summary-week">第{data.week}周</span>
			</div>
			<Input type="textarea" placeholder="每周总结...(自己本周的感悟，学到了什么等等)" style={{fontSize:'1.5em',marginTop:20}} autosize={{ minRows: 15, maxRows: 30 }} onChange={this.handleChangeContent}/>
			<div className="rate">
				<span className="">自我评价:</span>
				<Rate allowHalf defaultValue={0} value={score} onChange={this.handleChangeScore}/>
			</div>
		</Modal>
		)
	}
}

const mapStateToProps = (state) => {
	return{
		taskSummary:state.task.taskSummary,
	}
};


const mapDispatchToProps = {
	updateTaskLists:(info) => {
		return {
			type:ACTION_UPDATE_TASK_LISTS,
			payload:info
		}
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StSummaryModalEdit)

