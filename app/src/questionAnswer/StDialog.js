//问答页面的问题、答案框及输入框

import React,{Component} from 'react'
import {
	TextInput,
	View,
	Text,
	StyleSheet,
	TouchableNativeFeedback,
	TouchableOpacity,
	Keyboard,
} from 'react-native'
import {Icon} from 'react-native-elements'
import Markdown from 'react-native-simple-markdown'

import {HostPost} from '../ajax/index'
import StImageViewer from './StImageViewer'

export class StDialogBox extends Component{
	render(){
		const {data,addItem,addHistory} = this.props;
		if(data.type === 'question'){
			return <StquestionItem question={data.content}/>
		}else if(data.type === 'answer'){
			return <StanswerDetail answer={data.content}/>
		}else if(data.type === 'answerList'){
			return <StanswerList answerList={data.content}
			                     addItem={addItem}
			                     addHistory={addHistory}/>
		}else if(data.type === 'notification'){
			return <Stnotification notification={data.content}/>
		}
	}
}

//问题显示框
class StquestionItem extends Component{
	render(){
		const question = this.props.question;
		return(
			<View style={{flexDirection:'row-reverse'}}>
				<View style={styles.questionContent}>
					<Text style={{fontSize:16,color:'#FFF',justifyContent:'flex-end'}}>{question}</Text>
				</View>
			</View>
		)
	}
}

//答案详情显示框
class StanswerDetail extends Component{

	correctAnswer = (answer) => {
		let answer1 = answer.replace(/(\s*`\s*)/g,'\*');        //改变加粗标记
		let answer2 = answer1.replace(/(\\n)/g,'\n');           //改变换行标记
		let urlAnswer = answer2.match(/http.*png/g);               //获取图片地址
		let answer3 = answer2.replace(/(<img).*(\/>)/g,'');     //去掉img
		let answer4 = answer3.replace(/(__)/g,'**');            //改变标记
		let answer5 = answer4.replace(/\*\s+\*\*/g,'**');
		let newAnswer = answer5.replace(/(>\s*>\s*>*\s*>*)/g,'\n\> ');  //改变标记
		let urls = urlAnswer ?
			urlAnswer
			:
			[];
		return {newAnswer,urls}
	};

	render(){
		let answer = this.props.answer;
		let {newAnswer,urls} = this.correctAnswer(answer);
		return(
			<View style={styles.answerDetail}>
				<Markdown>
					{newAnswer}
				</Markdown>
				{
					urls.map((item, index ) => {
						return <StImageViewer url={item} key={index}/>
					})
				}
			</View>
		)
	}
}

//提醒信息显示框
class Stnotification extends Component{

	render(){
		const notification = this.props.notification;
		return(
			<View style={styles.answerContent}>
				<Text style={{fontSize:16,color:'#000'}}>{notification}</Text>
			</View>
		)
	}
}

//答案列表显示框
class StanswerList extends Component{

	showAnswer=(data)=> {
		Keyboard.dismiss();
		const {keyword,answer} = data;
		this.props.addItem([{type:'question',content:keyword},{type:'answer',content:answer}]);
		this.props.addHistory(keyword);
	};

	render(){
		const answerList = this.props.answerList;
		return(
			<View style={styles.answerContent}>
				<Text style={{fontSize:16,color:'#000',marginBottom:5}}>找到以下答案（点击查看详情）</Text>
				{
					answerList.map((item,index) => {
						return (
							<TouchableOpacity  onPress={() => this.showAnswer(item)} key={index}>
								<Text style={{fontSize:18,color:'#000',paddingTop:10,paddingBottom:5,borderBottomWidth:1,borderColor:'#0f88eb'}}>{index+1}. {item.keyword}</Text>
							</TouchableOpacity >
						)
					})
				}
			</View>
		)
	}
}

//底部输入框
export class StInput extends Component{
	constructor(props){
		super(props);
		this.state={
			question:'',
		}
	}

	handleChangeQuestion = (question) => {
		this.setState({question:question})
	};

	handleSubmitQuestion = () => {
		const {question}=this.state;
		if(!question.trim()){
			return ;
		}
		this.setState({question:''});
		this.props.addItem({type:'question',content:question});
		this.props.recordQuestion(question);
		HostPost('/question',{question:question},true).then(({json})=>{
			if(json.error===0){
				this.props.addItem({type:'answerList',content:json.answer})
			}else{
				this.props.addItem({type:'notification',content:'这个问题我也不知道，我们会继续补充完善的(●\'◡\'●)'})
			}
		}).catch((error)=>{
			this.props.addItem({type:'answer',content:'网络错误，请稍后再试'})
		});
	};

	render(){
		const {question} = this.state;
		return(
			<View style={{flexDirection:'row',borderTopWidth:5,borderBottomWidth:5,borderColor:'#eeeeee'}}>
				<TextInput
					style={styles.textInputStyle}
					placeholder="输入问题"//占位符
					maxLength={50}//限制文本框的最多字符数
					multiline={true}
					underlineColorAndroid="transparent"//取消下划线
					autoCapitalize='words'//自动转换大写
					keyboardType='default'//软键盘的类型
					selectTextOnFocus={true}//true获得焦点时，文本全选中
					onChangeText={this.handleChangeQuestion}//文本内容发生变化时，执行回调函数，改变后的文本内容会作为参数传递
					blurOnSubmit={true}
					autoFocus={this.props.autoFocus}
					value={question}
				>
				</TextInput>
				<TouchableNativeFeedback onPress={this.handleSubmitQuestion}>
					<View style={{justifyContent:'center',paddingHorizontal:10}}>
						<Icon name='send' size={30} color={question.trim()?'#0f88eb':'#D1D1D1'}/>
					</View>
				</TouchableNativeFeedback>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	textInputStyle: {
		flex:1,
		padding:0,
		paddingRight:20,
		paddingLeft:20,
		minHeight:50,
		fontSize:16,
		textAlignVertical:'center',
	},
	questionContent:{
		overflow:'hidden',
		justifyContent:'flex-end',
		margin:10,
		marginLeft:50,
		padding:10,
		backgroundColor:'#0f88eb',
		borderTopLeftRadius:20,
		borderTopRightRadius:20,
		borderBottomLeftRadius:20,
		borderBottomRightRadius:5,
	},
	answerContent:{
		overflow:'hidden',
		margin:10,
		marginRight:50,
		padding:10,
		backgroundColor:'#FFFFFF',
		borderTopLeftRadius:20,
		borderTopRightRadius:20,
		borderBottomLeftRadius:5,
		borderBottomRightRadius:20,
	},
	answerDetail:{
		overflow:'hidden',
		margin:10,
		padding:10,
		paddingRight:25,
		backgroundColor:'#FFFFFF',
		borderTopLeftRadius:20,
		borderTopRightRadius:20,
		borderBottomLeftRadius:5,
		borderBottomRightRadius:20,
	},
});