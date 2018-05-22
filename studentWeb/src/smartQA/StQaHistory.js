/**
 * Created by 19272 on 2017/7/26.
 */
import React,{Component} from 'react'
import { Table } from 'antd';

const columns = [{
    title: '问题',
    dataIndex: 'question',
    key: 'question',
},  {
    title: '提问时间',
    dataIndex: 'time',
    key: 'time',
    width:200,
}];

export  default  class  StFAQ extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="tab-content">
                <Table columns={columns} dataSource={this.props.data} />
            </div>
            )
    }
}

