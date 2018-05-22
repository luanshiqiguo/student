/**
 * Created by ASUS on 2017/9/22.
 */
import React,{Component} from 'react'
import {
    View,
    ScrollView,
    BackAndroid,
	Dimensions,
	Keyboard,
	StatusBar,
} from 'react-native'

import {HostPost} from '../ajax/index'
import StNavHead from '../StNavHead'
import {StInput, StDialogBox} from './StDialog'

const screenHeight = Dimensions.get('window').height;

export default class StSearchPage extends Component{

    constructor(props) {
        super(props);

        this.state = {
            questionAndAnswer:this.props.data?
                                [
                                    {type:'question',content:this.props.data.keyword},
                                ]
                                :
                                [],   //问题答案列表
            recordedKeyword:[],     //防止重复记录
	        question:'',            //当前提问的问题
        };
	    this._scrollView = ScrollView;
    }

    componentWillMount(){
        BackAndroid.addEventListener('hardwareBackPress',this.handleBack);
	    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.updateKeyboardSpace);
    }

	componentDidMount(){
		const {answer} = this.props.data;
		const curQuestionAndAnswer = this.state.questionAndAnswer;
		if(answer){
			setTimeout(() => {
				this.setState({questionAndAnswer:[
					...curQuestionAndAnswer,
					{type:'answer',content:answer},
				]})
			},300)
		}
	}

    componentWillUnmount(){
        BackAndroid.removeEventListener('hardwareBackPress',this.handleBack);
	    this.keyboardWillShowSub.remove();
    }

    //键盘出现时，将ScrollView滑到底
	updateKeyboardSpace = () => {
		this.gotoEnd();
	};

    handleBack = () => {
        this.props.navigator.pop();
        return true;
    };

    addItem = (item) => {
        let {questionAndAnswer} = this.state;
        const newQuestionAndAnswer = Array.isArray(item) ? [...questionAndAnswer,...item] : [...questionAndAnswer,item];
        this.setState({questionAndAnswer:newQuestionAndAnswer})
    };

    addHistory = (keyword) => {
        const {recordedKeyword,question} = this.state;
        if(recordedKeyword.indexOf(keyword) === -1){
	        recordedKeyword.push(keyword);
	        HostPost('/recordQuery',{question:question,choice_keyword:keyword},true).then(() => {})
        }
    };

    recordQuestion = (question) => {
        this.setState({question:question});
    };

    componentDidUpdate(){
        this.gotoEnd();
    }

    gotoEnd = () => {
    	setTimeout(() => this._scrollView.scrollToEnd({animated: true}),100)
    };

    render(){
        const {questionAndAnswer} = this.state;
        return (
	        <View style={{backgroundColor:'#f2f2f2',flex:1}} >
		        <StNavHead title="提问" back={this.handleBack}/>
		        <View style={{flex:1}}>
			        <ScrollView ref={(scrollView) => { this._scrollView = scrollView }}
			                    keyboardShouldPersistTaps='always'
			                    showsVerticalScrollIndicator={false}>
				        {
					        questionAndAnswer.map((item,index) =>{
							        return <StDialogBox data={item} addItem={this.addItem} addHistory={this.addHistory} key={index}/>
						        }
					        )
				        }
			        </ScrollView>
		        </View>
		        <StInput addItem={this.addItem}
		                 recordQuestion={this.recordQuestion}
		                 autoFocus={!this.props.data}
		        />
	        </View>

        );
    }
}

