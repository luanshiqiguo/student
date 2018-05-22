/**
 * Created by abing on 2017/3/22.
 */
import React,{Component,PropTypes} from 'react'
import {connect} from 'react-redux'
import {View,Text,BackAndroid,TouchableNativeFeedback,Picker,Modal,TextInput,StyleSheet,ToastAndroid} from 'react-native'
import {Icon,Button} from 'react-native-elements'

import StNavHead from '../StNavHead'
import {HostPost} from '../ajax/index'
import StButton from '../ui/StButton'

import {ROUTE_EMAIL} from '../const/StRoute'
import {ACTION_UPDATE_INFO} from '../store/action'
import {regExp} from '../const/StRegExp'
import StCatchError from '../StCatchError'

class StUserInfoStaticItem extends Component{
	static propTypes = {
		title:PropTypes.string.isRequired,
		content:PropTypes.string.isRequired,
	};

	render(){
		const {title,content} = this.props;
		return(
			<View style={{alignItems: 'center',flexDirection:'row',height:50,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#eee'}}>
				<Text style={{flex:1,fontSize:16,color:'#5e6977',paddingLeft:20}}>{title}</Text>
				<Text style={{fontSize:16,color:'#5e6977',paddingRight:20}}>{content}</Text>
			</View>
		);
	}
}

class StUserInfoEditItem extends Component{
	static propTypes = {
		title:PropTypes.string.isRequired,
		content:PropTypes.string.isRequired,
		onLink:PropTypes.func.isRequired,
	};

	render(){
		const {title,content,onLink} = this.props;
		const text = content?content:'未填写';
		return(
			<TouchableNativeFeedback onPress={onLink}>
				<View style={{alignItems: 'center',flexDirection:'row',height:50,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#eee',paddingRight:5}}>
					<Text style={{flex:6,fontSize:16,color:'#5e6977',paddingLeft:20}}>{title}</Text>
					<Text style={{flex:20,fontSize:16,color:'#5e6977',paddingRight:10,textAlign:'right'}} numberOfLines={1}>{text}</Text>
					<View style={{alignItems:'flex-start'}}>
						<Icon name='navigate-next' size={20} color={'#5e6977'}/>
					</View>
				</View>
			</TouchableNativeFeedback>
		);
	}
}

class StModal extends Component{
	constructor(props){
		super(props);
		this.state={
			modalVisible:this.props.modalVisible,
			tags:this.props.tags,
			edited:false,
			inputValue:'',
		}
	}

	handleChangeInput = (value) => {
		this.setState({inputValue:value.replace(regExp, '')})
	};

	handleAddTag = () => {
		const {inputValue,tags} = this.state;
		if (inputValue.trim().length && tags.indexOf(inputValue) ===-1) {
			newTags = [...tags, inputValue];
			this.setState({
				tags:newTags,
				inputValue: '',
			});
			if(newTags.toString() !== this.props.tags.toString()){
				this.setState({edited:true})
			}
		}
	};

	handleDeleteTag = (removedTag) => {
		const newTags = this.state.tags.filter(tag => tag !== removedTag);
		this.setState({ tags:newTags });
		if(newTags.toString() === this.props.tags.toString()){
			this.setState({edited:false})
		}else {
			this.setState({edited:true})
		}
	};

	submitTags = () => {
		const {tags} = this.state;
		const {submit} = this.props;
		submit(tags);
	};

	render(){
		const {title,hideModal} = this.props;
		const {tags,edited,inputValue,modalVisible} = this.state;
		const addable = tags.length < 6;
		return(
			<Modal animationType="fade"
			       transparent={true}
			       visible={modalVisible}
			       onRequestClose={hideModal}>
				<View style={{flex:1,backgroundColor:'rgba(0, 0, 0, 0.5)',justifyContent:'center'}}>
					<View style={styles.modalContenter}>
						<View style={{flexDirection:'row',justifyContent:'flex-end',marginRight:-25}}>
							<Icon raised reverse color='rgba(225,0,0,1)'
							      underlayColor="rgba(225,0,0,0.5)"
							      name='close' size={10}
							      onPress={hideModal}/>
						</View>
						<View style={{flexDirection:'row',justifyContent:"center",marginTop:-10}}>
							<Text style={{fontSize:20,color:'#000',height:40}}>{title}</Text>
						</View>
						<View style={{borderBottomWidth:1,borderTopWidth:1,borderColor:'#AAAAAA',paddingTop:10,paddingBottom:10,minHeight:50}}>
							{
								tags.map((item,index)=>{
									return(
										<View key={index} style={styles.tagsItem}>
											<Text style={{flex:10,fontSize:17}}>
												{item}
											</Text>
											<View style={{flex:1,alignItems:'center'}}>
												<Icon color='#858585'
												      underlayColor="rgba(255,0,0,0.5)"
												      name='delete' size={20}
												      onPress={(index)=>this.handleDeleteTag(item)}/>
											</View>
										</View>
									)
								})
							}
						</View>

						{
							addable?
								<View style={styles.tagsItem}>
									<TextInput placeholder="在此处添加新内容"
									           value={inputValue}
									           style={{flex:1,fontSize:15}}
									           onChangeText={this.handleChangeInput}
									/>
									<Icon raised reverse color='rgba(15,136,235,1)'
										      underlayColor="rgba(15,136,235,0.5)"
										      name='add' size={15}
										      onPress={this.handleAddTag}/>

								</View>
								:
								null
						}
						{
							edited?
								<StButton title='保存' onPress={this.submitTags} style={{marginTop:15,borderRadius:18,backgroundColor:'#0f88eb'}}/>
								:
								null
						}
					</View>
				</View>
			</Modal>
		)
	}
}

class StUserInfo extends Component{

	constructor(props){
		super(props);
		this.state={
			likesModalVisible:false,
			charactersModalVisible:false,
			pickable:true,
		}
	}

	componentWillMount() {
		BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
	}

	componentWillUnmount(){
		BackAndroid.removeEventListener('hardwareBackPress',this.handleBack);
	}

	handleBack = () => {
		this.props.navigator.pop();
		return true;
	};

	showErrorMessage = (errorMessage) => {
		ToastAndroid.show(errorMessage,ToastAndroid.SHORT);
	};

	handleChangeEmail = () => {
		this.props.navigator.push(ROUTE_EMAIL);
	};

	handleShowLikes = () => {
		this.setState({likesModalVisible:true});
	};

	handleShowCharacters = () => {
		this.setState({charactersModalVisible:true});
	};

	handleChangeBasicKnowledge = (value) => {
		this.setState({pickable:false});
		const data = {basicKnowledge:value};
		HostPost('/update-stu-info',{...data},true).then(({json})=>{
			if (json.error===0){
				this.setState({pickable:true});
				this.props.updateInfo(data);
				this.showErrorMessage('修改成功');
			}else {
				this.showErrorMessage('修改失败');
				this.setState({pickable:true});
			}
		}).catch((error) => {
			StCatchError(error);
			this.setState({pickable:true});
		})
	};

	handleHideLikesModal = () => {
		this.setState({likesModalVisible:false});
	};

	handleHideCharactersModal = () => {
		this.setState({charactersModalVisible:false});
	};

	handleSubmitCharacters = (characters) => {
		const data = {characters:characters};
		this.setState({
			charactersModalVisible:false
		});
		this.fetch(data);
	};

	handleSubmitLikes = (likes) => {
		const data = {likes:likes};
		this.setState({
			likesModalVisible:false,
		});
		this.fetch(data);
	};

	fetch = (data) => {
		HostPost('/update-stu-info',{...data},true).then(({json})=>{
			if (json.error===0){
				this.props.updateInfo(data);
				this.showErrorMessage('修改成功');
			}else {
				this.showErrorMessage('修改失败');
			}
		}).catch((error) => {
			StCatchError(error);
		})
	};

	render(){
		const {basicKnowledge,likes,characters,name,groupId,email,stuId,teacherName} = this.props.userInfo;
		const stuClass = this.props.userInfo['class'];
		const {likesModalVisible,charactersModalVisible,pickable} = this.state;
		return(
			<View style={{flex:1,backgroundColor:'#f4f4f4'}}>
				<StNavHead title="个人信息" back={this.handleBack}/>
				<View style={{height:10}}/>
				<StUserInfoStaticItem title='学号' content={stuId}/>
				<StUserInfoStaticItem title='姓名' content={name}/>
				<StUserInfoStaticItem title='班级' content={stuClass}/>
				<StUserInfoStaticItem title='组号' content={groupId}/>
				<StUserInfoStaticItem title='任课教师' content={teacherName}/>
				<StUserInfoEditItem title='邮箱' content={email} onLink={this.handleChangeEmail}/>
				<View style={{height:10}}/>
				<StUserInfoEditItem title='性格' content={characters.toString()} onLink={this.handleShowCharacters}/>
				<StUserInfoEditItem title='爱好' content={likes.toString()} onLink={this.handleShowLikes}/>
				<View style={{alignItems: 'center',flexDirection:'row',height:50,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#eee'}}>
					<Text style={{flex:3,fontSize:16,color:'#5e6977',paddingLeft:20}}>基础水平</Text>
					<Picker
						style={{flex:2}}
						enabled={pickable}
						mode='dialog'
						prompt="基础知识水平"
						selectedValue={basicKnowledge}
						onValueChange={this.handleChangeBasicKnowledge}>
						<Picker.Item label="小白" value={0} />
						<Picker.Item label="菜鸟" value={1} />
						<Picker.Item label="良好" value={2} />
						<Picker.Item label="优秀" value={3} />
						<Picker.Item label="大神" value={4} />
					</Picker>
				</View>
				{
					charactersModalVisible?
						<StModal title="性格"
						         tags={characters}
						         modalVisible={charactersModalVisible}
						         submit={this.handleSubmitCharacters}
						         hideModal={this.handleHideCharactersModal}
						/>
						:
						null
				}
				{
					likesModalVisible?
						<StModal title="爱好"
						         tags={likes}
						         modalVisible={likesModalVisible}
						         submit={this.handleSubmitLikes}
						         hideModal={this.handleHideLikesModal}
						/>
						:
						null
				}
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		userInfo : state['auth']['userInfo']
	};
};

const mapDispatchToProps = {
	updateInfo:(info) => {
		return{
			type:ACTION_UPDATE_INFO,
			payload:info
		}
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(StUserInfo)

const styles = StyleSheet.create({
	modalContenter:{
		marginLeft:30,
		marginRight:30,
		backgroundColor:'#fff',
		justifyContent:'center',
		padding:30,
		paddingTop:3,
		borderRadius: 10,
	},
	tagsItem:{
		marginLeft:5,
		marginBottom:10,
		flexDirection:'row',
		justifyContent:'space-between',
		borderRadius:3,
		alignItems:'center'
	}
});