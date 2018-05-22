/**
 * Created by abing on 2017/3/14.
 */
import React,{Component} from 'react'
import {Row,Col,Icon,notification,Slider,Button } from 'antd'
import {connect} from 'react-redux'
import StTabs from './StTabs'
import {ACTION_UPDATE_STU_INFO} from '../store/action'
import {HostPost} from '../ajax/index'

const marks = {
        0: '小白',
        1: '菜鸟',
        2: '一般',
        3: '优秀',
        4: {
		style: {
			color: '#f50',
		},
		label: <strong>大神</strong>,
	},
};

class StSlider extends Component{
	constructor(props){
		super(props);
		this.state={
			basicKnowledge:this.props.basicKnowledge,
		}
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.basicKnowledge!==this.state.basicKnowledge){
			this.setState({basicKnowledge:nextProps.basicKnowledge})
		}
	}

	formatter = (value) => {
		switch (value){
			case 0:
				return '小白';
			case 1:
				return '菜鸟';
			case 2:
				return '一般';
			case 3:
				return '优秀';
			case 4:
				return '大神';
		}
	};


	changeSlider = (value) => {
		this.setState({basicKnowledge:value});
		this.props.updateBasicKnowledge(value);
	};

	render(){
		const {basicKnowledge} = this.state;
		return(
			<Slider marks={marks} step={null} min={0} max={4} value={basicKnowledge}  tipFormatter={this.formatter} onChange={this.changeSlider}/>
		)
	}
}

class StInfo extends Component{

	constructor(props){
		super(props);
		this.state={
			basicKnowledge:null,
			likes:[],
			characters:[],
			edited:false,
		}
	}

	componentDidMount(){
		this.setData(this.props.userInfo);
	}

	componentWillReceiveProps(nextProps){
		this.setData(nextProps.userInfo);
	}

	setData = (userInfo) => {
		const {likes,characters,basicKnowledge} = this.state;
		if(!userInfo){
			return;
		}
		if (likes.toString()!==userInfo.likes.toString()){
			this.setState({likes:userInfo.likes});
		}
		if (characters.toString()!==userInfo.characters.toString()){
			this.setState({characters:userInfo.characters});
		}
		if (basicKnowledge !== userInfo.basicKnowledge){
			this.setState({basicKnowledge:userInfo.basicKnowledge})
		}
	};

	updateLikes = (tags) => {
		this.setState({likes:tags,edited:true});
	};

	updateCharacters = (tags) => {
		this.setState({characters:tags,edited:true});
	};

	updateBasicKnowledge = (value) => {
		this.setState({basicKnowledge:value,edited:true});
	};

	confirmSubmitInfo = () => {
		const {basicKnowledge,likes,characters} = this.state;
		const userInfo = this.props.userInfo;
		let data = {};
		if(basicKnowledge !== userInfo.basicKnowledge){
			data.basicKnowledge=basicKnowledge;
		}
		if(likes.toString() !== userInfo.likes.toString()){
			data.likes=likes;
		}
		if(characters.toString() !== userInfo.characters.toString()){
			data.characters=characters;
		}

		if (Object.getOwnPropertyNames(data).length){
			this.fetch(data);
		}else {
			this.setState({edited:false});
			notification['warning']({
				message: '温馨提示',
				description: '您此次没有修改信息！',
			});
		}

	};

	cancelSubmitInfo = () => {
		const userInfo = this.props.userInfo;
		this.setState({
			edited:false,
			characters:userInfo.characters,
			likes:userInfo.likes,
			basicKnowledge:userInfo.basicKnowledge,
		});
	};

	fetch = (data) => {
		HostPost('/update-stu-info',{...data},true).then(({json}) => {
			if (json.error === 0){
				this.setState({edited:false});
				const info =  Object.assign({},data);
				// console.log(info);
				this.props.updateStuInfo(data);
				notification['success']({
					message: '温馨提示',
					description: '修改成功！',
				});
			}else {
				notification['error']({
					message: '温馨提示',
					description: '修改失败！',
				});
			}
		}).catch((error)=>{
			notification['error']({
				message: '温馨提示',
				description: '网络错误！请稍后重试',
			});
		})
	};

	render(){
		if(!this.props.userInfo){
			return(
				<div>
					loading
				</div>
			)
		}
		const {name,stuId,groupId,email,teacherName} = this.props.userInfo;
		const stClass = this.props.userInfo.class;
		const {likes,characters,basicKnowledge} = this.state;
		const {edited} = this.state;
		return(
			<div>
				<div className="info-title"><Icon type="user" /><span>个人信息</span></div>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>学号：</Col>
					<Col span={18} style={{fontSize:14}}>{stuId}</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>姓名：</Col>
					<Col span={18} style={{fontSize:14}}>{name}</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>班级：</Col>
					<Col span={18} style={{fontSize:14}}>{stClass}</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>组号：</Col>
					<Col span={18} style={{fontSize:14}}>{groupId}</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>任课教师：</Col>
					<Col span={18} style={{fontSize:14}}>{teacherName}</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>邮箱：</Col>
					<Col span={18} style={{fontSize:14}}>{email}</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>性格：</Col>
					<Col span={18} style={{fontSize:14}}>
						<StTabs tags={characters} updateTags={this.updateCharacters}/>
					</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>爱好：</Col>
					<Col span={18} style={{fontSize:14}}>
						<StTabs tags={likes} updateTags={this.updateLikes}/>
					</Col>
				</Row>
				<Row type="flex" justify="center" align="middle" className='info-item'>
					<Col span={6} style={{fontSize:16}}>基础水平：</Col>
					<Col span={18} style={{fontSize:14}}>
						<StSlider updateBasicKnowledge={this.updateBasicKnowledge} basicKnowledge={basicKnowledge}/>
					</Col>
				</Row>
				{
					edited?
						<span className="submitInfo">
							<Button  onClick={this.cancelSubmitInfo} >取消</Button>
							<Button type="primary" style={{marginLeft:'20px'}} onClick={this.confirmSubmitInfo} >保存</Button>
						</span>
						:
						null
				}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
		return {
			userInfo:state.auth.userInfo
		};
};

const mapDispatchToProps = {
	updateStuInfo:(info) => {
		return {
			type:ACTION_UPDATE_STU_INFO,
			payload:info
		}
	},
};



export default connect(mapStateToProps,mapDispatchToProps)(StInfo);