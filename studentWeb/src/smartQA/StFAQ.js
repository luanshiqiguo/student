/**
 * Created by 19272 on 2017/7/26.
 */
import React,{Component} from 'react'
import { Collapse } from 'antd';
import ReactMarkdown from 'react-markdown'

import {HostPost} from '../ajax/index.js'
const Panel = Collapse.Panel;

export  default  class  StFAQ extends Component {

    constructor(props){
        super(props);
        this.state = {
            com_question:[],
        }
    };
    componentDidMount(){
        HostPost('/commonQuestion',{},true).then(({json})=>{
            if(json.error===0){
                this.setState({com_question:json.list});
            }else{
                // this.setState({loading:true});
            }
        }).catch((error)=>{
            console.log(error);
        });
    };

    render(){
        const {com_question} = this.state;
        return(
            <div className="tab-content">
                <Collapse accordion>
                    {
                        com_question.map((item,index,list)=>{
                            return(
                                <Panel header={item.keyword}  key={index}>
                                    <ReactMarkdown source={item.answer.replace(/\\n/g,'\n')} />
                                </Panel>
                            )
                        })
                    }
                </Collapse>
            </div>
        );
    }
}

