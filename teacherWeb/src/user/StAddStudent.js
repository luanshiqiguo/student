import React,{Component} from 'react'
import { Modal,Input,message,notification,Select} from 'antd';
import {HostPost} from '../ajax/index'

const Option = Select.Option;

export default class StAddStudent extends Component{

	constructor(props){
		super(props);
		this.state={
			stuId:'',
			name:'',
			stuClass:'',
			groupId:'',
			confirmLoading:false,
		}
	}

	handleChangeStuId = (e) => {
		this.setState({stuId:e.target.value})
	};

	handleChangeName = (e) => {
		this.setState({name:e.target.value})
	};

	handleChangeStuClass = (e) => {
		this.setState({stuClass:e.target.value})};

	handleChangeGroupId = (value) => {
		console.log(value);
		this.setState({groupId:value})
	};

	handleOk = () => {
		const {stuId,name,stuClass,groupId} = this.state;
		if(stuId&&name&&stuClass&&groupId){
			this.setState({confirmLoading: true,});
			const data = {
				stuId:stuId,
				name:name,
				class:stuClass,
				groupId:groupId
			};
			HostPost('/add-users',{...data},true).then(({json}) => {
				this.setState({confirmLoading: false});
				if(json.error === 0){
					let id = json.id;
					this.props.onAddNewStudentToListData(id,stuId,name,stuClass,groupId);
				}else{
					notification['error']({
						message: '温馨提示',
						description:'很抱歉！创建失败(学号可能已存在)'
					});
				}
			}).catch((error) => {
				console.log(error);
				this.setState({confirmLoading: false});
				notification['error']({
					message: '温馨提示',
					description:'很抱歉！创建失败'
				});
			})
		}else{
			message.error('您还有数据没填！');
		}
	};

	handleCancel = () => {
		this.props.onCancelAddStudent();
	};

	render(){
		const {stuId,name,stuClass,groupId} = this.state;
		return(
			<div>
				<Modal title="添加学生"
				       visible={true}
				       onOk={this.handleOk}
				       confirmLoading={this.state.confirmLoading}
				       onCancel={this.handleCancel}
				       width='60%'
				>
					<div className='add-student-input' >
						<Input onChange={this.handleChangeStuId} addonBefore="学号" style={{fontWeight:'blod',fontSize:'2em',height:45}} value={stuId}/>
					</div>
					<div className='add-student-input'>
						<Input  onChange={this.handleChangeName} addonBefore="姓名" style={{fontWeight:'blod',fontSize:'2em',height:45}} value={name}/>
					</div>
					<div className='add-student-input'>
						<Input onChange={this.handleChangeStuClass} addonBefore="班级" style={{fontWeight:'blod',fontSize:'2em',height:45}} value={stuClass}/>
					</div>
					<div className='add-student-input'>
						<span style={{fontSize:14,padding:5}}>组号：</span>
						<Select style={{ width: 120 }} onChange={this.handleChangeGroupId} value={groupId}>
							<Option value="周三组">周三组</Option>
							<Option value="周五组">周五组</Option>
						</Select>
					</div>
					<div style={{color:'red',paddingLeft:20}}>
						提示：初始密码：123456 , 该学生的老师（默认）：宋华珠老师
					</div>
				</Modal>
			</div>
		)
	}
}