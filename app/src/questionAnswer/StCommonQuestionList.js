/**
 * Created by ASUS on 2017/10/01.
 */
import React,{Component} from 'react'
import {ListView,View,Text,TouchableOpacity,ActivityIndicator,RefreshControl,ToastAndroid} from 'react-native'

import {HostPost} from '../ajax/index'

import {ROUTE_SEARCH_PAGE} from '../const/StRoute'

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

export  default class StCommonQuestionList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            com_question: [],
            loading:true,
            refreshing:false,
	        error:false,
        }
    }

    componentDidMount() {
		this.loadData();
    };

    loadData = () => {
    	this.setState({error:false,loading:true});
	    HostPost('/commonQuestion', {}, true).then(({json}) => {
		    if (json.error === 0) {
			    this.setState({com_question:json.list,loading:false});
		    } else {
			    this.setState({loading:false,error:true});
		    }
	    }).catch((error) => {
		    this.setState({loading:false,error:true});
	    });
    };

	reFreshData = () => {
        this.setState({refreshing:true});
	    HostPost('/commonQuestion', {}, true).then(({json}) => {
		    if (json.error === 0) {
			    this.setState({com_question:json.list,refreshing:false});
		    } else {
			    this.setState({refreshing:false});
		    }
	    }).catch((error) => {
		    this.setState({refreshing:false});
	    });
    };

    //跳转到详细页面,点击按钮后显示对应答案，
    handleItemSelect = (rowData) => {
        const detailRoute = ROUTE_SEARCH_PAGE;
        detailRoute.data = rowData;
        this.props.navigator.push(detailRoute)
    };

    renderItem = (rowData, sectionID, rowID) => {
        return (
            <TouchableOpacity onPress={() => this.handleItemSelect(rowData)}>
                <View style={{height:40,borderBottomWidth:1,borderBottomColor :'#eeeeee',flexDirection:'row',paddingLeft:10}}>
                    <Text style={{fontSize:16,color:'#000',height:40,textAlignVertical:'center'}} numberOfLines={1}>{parseInt(rowID)+1}{".  "+rowData.keyword}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render(){
        const {com_question,loading,error} = this.state;
        return (
            <View style={{flex:1}}>
                <View style={{height:40,borderBottomWidth:1,borderBottomColor:'#eeeeee',flexDirection:'row',paddingLeft:10,}}>
                    <Text style={{fontSize:16,height:40,textAlignVertical:'center'}}>热门搜索，按查看次数排名</Text>
                </View>
                {
                    loading?
	                    <ActivityIndicator size='large' style={{marginTop:20}}/>
                        :
	                    null
                }
	            {
	            	error?
			            <View style={{flexDirection:'row',justifyContent:'center',padding:50}}>
				            <Text>出了点小问题,</Text>
				            <TouchableOpacity onPress={this.loadData}>
					            <Text style={{color:'#0f88eb'}}>点击重试</Text>
				            </TouchableOpacity>
			            </View>
			            :
			            null
	            }
	            {
		            com_question.length === 0 ?
			            null
			            :
			            <ListView
				            dataSource={ds.cloneWithRows(com_question)}
				            renderRow={this.renderItem}
				            enableEmptySections={true}
				            refreshControl={
					            <RefreshControl
						            refreshing={this.state.loading}
						            onRefresh={this.reFreshData}
						            title="Loading..."
					            />
				            }
			            />
	            }
            </View>

        );
    }
}