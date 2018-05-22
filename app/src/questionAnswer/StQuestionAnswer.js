/**
 * Created by donttal on 2017/9/18.
 */
import React,{Component} from 'react'
import {View,Text,StyleSheet,TouchableNativeFeedback} from 'react-native'
import {Icon} from 'react-native-elements'
import StNavHead from '../StNavHead'
import StCommonQuestionList from './StCommonQuestionList'
import {ROUTE_SEARCH_PAGE} from '../const/StRoute'


export default class StQuestionAnswer extends Component{

    constructor(props){
        super(props);
    }

    handleGoQAPage = () => {
	    const detailRoute = ROUTE_SEARCH_PAGE;
	    detailRoute.data = null;
	    this.props.navigator.push(detailRoute)
    };

    render(){
        return (
            <View style={{backgroundColor:'#f4f4f4',flex:1}}>
                <StNavHead title="问答"/>
                <StCommonQuestionList navigator={this.props.navigator}/>
                <TouchableNativeFeedback onPress={this.handleGoQAPage}>
                    <View style={{flexDirection:'row',borderTopWidth:5,borderBottomWidth:5,borderColor:'#eeeeee'}}>
                        <View style={{flex:1,justifyContent:'center',paddingVertical:15,paddingLeft:20}}>
                            <Text style={{fontSize:16}}>点此提问</Text>
                        </View>
                        <View style={{justifyContent:'center',paddingHorizontal:10}}>
                            <Icon name='send' size={30} color={'#D1D1D1'}/>
                        </View>
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
        height:50,
        fontSize:16,
        textAlignVertical:'center',
    }
});
