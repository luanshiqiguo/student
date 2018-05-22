/**
 * Created by abing on 2017/3/15.
 */
import React,{Component} from 'react'
import {Modal,Input,Rate,message,notification} from 'antd'

export default class StSummaryModalStatic extends Component{
	handleCancel = () =>　{
		this.props.onCancle();
	};

	render(){
		const{modalVisible,data} = this.props;
		const{content,score} = {...JSON.parse(data.content)};
		debugger;
		return(
			<Modal title="每周总结"
			       visible={modalVisible}
			       footer={null}
			       maskClosable={true}
			       key={data.id}
			       onCancel={this.handleCancel}
			       width='60%'
			>
				<div>
					<span className="summary-title">{data.title}</span>
					<span className="summary-target">{data.target}</span>
					<span className="summary-week">第{data.week}周</span>
				</div>
				<Input type="textarea" autosize={{ minRows: 15, maxRows: 30 }} value={content} style={{fontSize:'1.5em',marginTop:20}}/>
				<div className="rate">
					<span>自我评价:</span>
					<Rate allowHalf disabled defaultValue={score}/>
				</div>
			</Modal>
		)
	}
}