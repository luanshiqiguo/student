/**
 * Created by 19272 on 2017/7/26.
 */
import React,{Component} from 'react'
import {Input,Button,Spin } from  'antd'
const {Search }=Input;
import ReactMarkdown from 'react-markdown'

import {HostPost} from '../ajax/index.js'
import 'lodash'

import './StQuestion.css'

const noResult = '没有找到答案';

export  default  class  StQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordedKeyword:[],     //防止重复记录
            questionCache:'',       //当前提问的问题的备份
            question:'',            //当前提问的问题
            answer:'',              //显示的答案
            answer_temp:[],         //keyword和answer列表
            loading:false,          //是否正在查询
        }
    }
    handleChangeQuestion=(e)=>{
        this.setState({question:e.target.value})
    };

    handleSubmit=()=>{
        const {question}=this.state;
        if(!question.trim()){
            return ;
        }
        this.setState({loading:true,answer_temp:[],answer:'',questionCache:question});      //设置loading状态，清除上一次的答案
        HostPost('/question',{question:question},true).then(({json})=>{
            if(json.error===0){
                //找到答案，显示按钮。
                this.setState({answer_temp:json.answer});
            }else{
                //未找到答案，清除上一次按钮，显示‘未找到答案’
                this.setState({answer:noResult});
            }
            this.setState({loading:false}); //清除按钮loading状态
        }).catch((error)=>{
            this.setState({answer:"网络错误，请稍后再试"});
            this.setState({loading:false}); //清除按钮loading状态
        });
    };

    //点击按钮后显示对应答案
    showAnswer=(index)=> {
        const {questionCache,recordedKeyword}=this.state;
        let keyword=this.state.answer_temp[index].keyword;
        this.setState({answer: this.state.answer_temp[index].answer.replace(/\\n/g, '\n')});
        //将问题和答案的关键词返回给后台进行保存
        if(recordedKeyword.indexOf(keyword) == -1){
            this.setState({recordedKeyword:[...recordedKeyword,keyword]});
            HostPost('/recordQuery',{question:questionCache,choice_keyword:keyword},true).then(({json})=>{
                if(json.error === 0){
                    this.props.onAddhistory(keyword);   //将问题添加到问题记录里
                }
            });
        }
    };

   render(){

       const {question,answer,loading,answer_temp}=this.state;

       return(
           <div className="tab-content">
               <div className="question-item">
                    <Search
                        placeholder="请输入问题（仅限本课程内相关问题）"
                        style={{ width: 600 , height:50}}
                        onChange={this.handleChangeQuestion}
                        onSearch={this.handleSubmit}
                    />
               </div>

               <div className="answer-item">
                   {
                       loading? <Spin /> : null
                   }
                   {
                         answer_temp.length?
                             <h2 style={{marginRight:20}}>问答结果：</h2>
                             :
                             null
                   }
                   {
                       answer_temp.map((item,index,list)=>{
                           return(
                                    <Button type="primary"
                                            ghost
                                            className="keyword-item"
                                            onClick={() => this.showAnswer(index)} key={index}>{item.keyword}
                                    </Button>
                           )
                       })
                   }
               </div>
               {
                   answer === noResult?
                       <p style={{textAlign:'center'}}><strong>未找到答案</strong></p>
                       :
                       <ReactMarkdown source={answer}/>
               }
               <div style={{marginTop:20}}>
                   {
                       answer ?
                           <p style={{textAlign:'center'}}>
                               < a href= {`http://www.baidu.com/s?wd=${question}`} target="_blank">想要了解更多</a>
                           </p>
                           :
                           null
                   }
               </div>
           </div>

       )
   }
}
