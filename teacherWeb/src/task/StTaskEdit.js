/**
 * Created by coder on 2017/3/9.
 */
import React,{Component} from 'react'
import {Button,Input,DatePicker,Select,notification} from 'antd'
import './StTaskEdit.css'
import StQuestionsForSelect from './StQuestionsForSelect'
import {HostPost} from '../ajax'
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
import {equalObject} from '../common/StObjectCommon'
import {TASK_TYPE_PREVIEW,TASK_TYPE_HOMEWORK,TASK_TYPE_EXPERIMENT,TASK_TYPE_SUMMARY} from '../common/constDefine'

/**
 * 改组件包含两种action：create和edit
 */

export default class StTaskEdit extends Component{
	constructor(props){
		super(props);
		this.action = props.route.path === 'task-bank/edit' ? 'edit' : 'create';
		if(this.action === 'edit'){
			if(!props.location.state){
				this.expire = true; //expire 如果通过浏览器回退到edit模式，则会显示edit已经过期
				return;
			}
			const {id,title,target,groupId,week,type,startTime,deadLine} = props.location.state.record;
			this.taskId = id;
			this.state = {
				title:title,
				target:target,
				week:week,
				groupId:groupId,
				groupIdList:[],
				type:type ? String(type) : type,
				startTime:moment(startTime),
				deadLine:moment(deadLine),
				errorMessage:'',
				selectedItems:[],
				oldSelectedItems:[],
			};
		} else {
			this.state = {
				title:'',
				target:'',
				week:'',
				groupId:'',
				groupIdList:[],
				type:'',
				startTime:moment(),
				deadLine:moment(),
				errorMessage:'',
				selectedItems:[],
				oldSelectedItems:[],
			};
		}

	}

	componentDidMount(){
		const {type} = this.state;
		//获取有哪些小组，供老师选择
		HostPost('/get-group-names',{},true).then(({json})=>{
			if(json.error === 0){
				this.setState({groupIdList:json.groupIdList.map((item)=>{return item.groupId})})
			} else {
				notification.error({
					message: '数据请求提示',
					description: '请求小组名称失败.',
				});
			}
		}).catch((error) => {
			notification.error({
				message: '数据请求提示',
				description: '请求小组名称失败.',
			});
		});
		if(this.action === 'edit' && parseInt(type) !== TASK_TYPE_SUMMARY){
			HostPost('/get-task-question-ids',{taskId:this.taskId},true).then(({json}) => {
				if(json.error === 0){
					let ids = json.questionIds.map((item) => item.questionId);
					ids.sort();
					this.setState({selectedItems:ids,oldSelectedItems:ids});
				} else {
					throw json;
				}
			}).catch((error) => {
				notification.error({
					message: '数据请求提示',
					description: '请求该任务已被选中的问题失败.',
				});
			})
		}

	}

	//任务开始和结束时间的变化回调
	handleTimeChange = (dates, dateStrings) => {
		this.setState({startTime:dates[0],deadLine:dates[1]});
	};

	//task类型变化回调
	handleTypeChange = (value) => {
		this.setState({type:value});
	};

	//获取原来的老task，用户edit时候比较和新的task是否有变化
	getOldTask = () => {
		if(this.action !== 'edit'){
			return;
		}
		const {title,target,groupId,week,type,startTime,deadLine} = this.props.location.state.record;
		const {oldSelectedItems} = this.state;
		return {
			title,
			target,
			groupId,
			week,
			type,
			startTime,
			deadLine,
			questions:oldSelectedItems,
		}
	};

	//获取新的task
	getNewTask = () => {
		const {title,target,groupId,week,type,startTime,deadLine} = this.state;
		if(!title){
			this.setState({errorMessage:'任务不能为空'});
			return;
		}
		if(!target){
			this.setState({errorMessage:'任务目标不能为空'});
			return;
		}
		if(!groupId){
			this.setState({errorMessage:'发布对象不能为空'});
			return;
		}
		if(!week){
			this.setState({errorMessage:'第几周不能为空'});
			return;
		}

		let intWeek = parseInt(week);
		if(intWeek < 1 || intWeek > 100){
			this.setState({errorMessage:'第几周只能为数值类型'});
			return;
		}

		if(!type){
			this.setState({errorMessage:'任务类型不能为空'});
			return;
		}

		let intType = parseInt(type);
		if(intType < 1 || intType > 4){
			this.setState({errorMessage:'任务类型不支持'});
			return;
		}

		if(!startTime || !deadLine){
			this.setState({errorMessage:'任务时间区域不能为空'});
			return;
		}

		let task = {
			title,
			target,
			groupId,
			week:intWeek,
			type:intType,
			startTime:startTime.format("YYYY-MM-DD HH:mm:ss"),
			deadLine:deadLine.format("YYYY-MM-DD HH:mm:ss"),

		};

		if(intType !== TASK_TYPE_SUMMARY){
			const {selectedItems} =  this.state;

			if(intType !== 4 && selectedItems.length === 0){
				this.setState({errorMessage:'题目不能为空'});
				return;
			}
			task.questions = selectedItems.sort();
		}

		return task;
	};

	//edit模式的提交
	submitForEdit = (newTask) => {
		const oldTask = this.getOldTask();
		if(equalObject(newTask,oldTask,true)){
			notification.error({
				message: '修改提示',
				description: '本次提交没有字段被修改，提交失败.',
			});
			return;
		}

		HostPost('/update-task',{
			taskId:this.taskId,
			...newTask,
		},true).then(({json}) => {
			if(json.error === 0){
				notification.success({
					message: '提交提示',
					description: '任务修改成功.',
				});
				this.goBack();
			} else {
				throw json;
			}
		}).catch((error) => {
			notification.error({
				message: '提交提示',
				description: '任务修改失败.',
			});
		})
	};


	//create模式的提交
	submitForCreate = (newTask) => {
		HostPost('/add-task',newTask,true).then(({json}) => {
			if(json.error === 0){
				notification.success({
					message: '提交提示',
					description: '任务创建成功.',
				});
				this.props.router.push('/task-bank');
			} else {
				throw json;
			}
		}).catch((error) => {
			notification.error({
				message: '提交提示',
				description: '任务创建失败.',
			});
		})
	};

	//submit按钮的click回调
	handleSubmit = () => {
		const {errorMessage} = this.state;
		const newTask = this.getNewTask();

		if(!newTask){
			return;
		}

		if(errorMessage){
			this.setState({errorMessage:''});
		}

		this.action === 'edit' ? this.submitForEdit(newTask) : this.submitForCreate(newTask);
	};

	goBack = () => {
		sessionStorage.removeItem('@@History/'+this.props.location.key);
		this.props.router.push('/task-bank');
	};

	handleCancel = () => {
		this.goBack();
	};

	//题目选择的回调
	handleSelectChange = (selectedItems) => {
		this.setState({selectedItems});
	};

	//更改小组是的回调
	handleGroupIdChange = (value) => {
		this.setState({groupId:value});
	};

	render() {
		if(this.expire){
			return (
				<div className="main-box" style={{padding:'30px 20px'}}>
					<h1>修改任务</h1>
					<p>当前修改已经过期...</p><br/>
					<Button onClick={this.props.router.goBack}>返回</Button>
				</div>
			);
		}

		const {title,target,groupId,week,type,startTime,deadLine,selectedItems,errorMessage,groupIdList} = this.state;
		let questions = null;
		const intType = parseInt(type);
		if(intType === TASK_TYPE_PREVIEW || intType === TASK_TYPE_HOMEWORK || intType === TASK_TYPE_EXPERIMENT){
			questions = (
				<div className="st-form-item">
					<div className="label ant-form-item-required">题目:</div>
					<div className="content">
						<StQuestionsForSelect onChange={this.handleSelectChange} selectedItems={selectedItems}/>
					</div>
				</div>
			);
		}

		return (
			<div className="task-edit main-box" style={{padding:'30px 20px'}}>
				<h1>
					<Button shape="circle" icon="arrow-left" type="primary" size="large" style={{marginLeft:'30px',marginRight:'20px',verticalAlign:'middle'}} onClick={this.goBack}/>
					{this.action === 'edit' ? '修改任务' : '添加新任务'}
				</h1>
				<div className="st-form-item">
					<div className="label ant-form-item-required">任务:</div>
					<div className="content"><Input value={title} onChange={(e) => this.setState({title:e.target.value})} placeholder="任务"/></div>
				</div>
				<div className="st-form-item">
					<div className="label ant-form-item-required">任务目标:</div>
					<div className="content"><Input value={target} onChange={(e) => this.setState({target:e.target.value})} placeholder="任务目标"/></div>
				</div>
				<div className="st-form-item">
					<div className="label ant-form-item-required">第几周:</div>
					<div className="content"><Input value={week} onChange={(e) => this.setState({week:e.target.value})} placeholder="第几周"/></div>
				</div>
				<div className="st-form-item">
					<div className="label ant-form-item-required">发布对象:</div>
					<Select style={{ width: 240 }} value={groupId} onChange={this.handleGroupIdChange}>
						{
							groupIdList.map((item)=>{
								return <Option key={item} value={item}>{item}</Option>

							})
						}
					</Select>
					{/*<div className="content"><Input value={groupId} onChange={(e) => this.setState({groupId:e.target.value})} placeholder="发布对象（用户编组）"/></div>*/}
				</div>
				<div className="st-form-item">
					<div className="label ant-form-item-required">任务类型:</div>
					<div className="content">
						<Select style={{ width: 240 }} value={type} onChange={this.handleTypeChange}>
							<Option value="1">课前预习</Option>
							<Option value="2">课后作业</Option>
							<Option value="3">实验练习</Option>
							<Option value="4">每周总结</Option>
						</Select>
					</div>
				</div>
				<div className="st-form-item">
					<div className="label ant-form-item-required">时间:</div>
					<div className="content">
						<RangePicker
							ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
							showTime format="YYYY/MM/DD HH:mm:ss"
							onChange={this.handleTimeChange}
						  value={[startTime,deadLine]}
						/>
					</div>
				</div>

				{questions}
				<div className="error-panel">
					{errorMessage ? '提交失败: ': null}{errorMessage}
				</div>
				<div className="submit">
					<Button type="primary" onClick={this.handleSubmit}>提交</Button>
					<Button onClick={this.handleCancel}>取消</Button>
				</div>

			</div>
		);
	}
}