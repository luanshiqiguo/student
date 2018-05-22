/**
 * Created by coder on 2017/2/20.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text,ListView} from 'react-native'
import {connect} from 'react-redux'
import StNavHead from '../StNavHead'
import StListView from '../list/StListView'
import {ROUTE_SUMMARY_PAGE} from '../const/StRoute'
import {TASK_TYPE_SUMMARY} from '../const/StTaskType'

class StSummary extends Component{
	static propTypes = {
		navigator:PropTypes.object.isRequired,
		taskSummary:PropTypes.array.isRequired,
	};

	render(){
		const {navigator,taskSummary} = this.props;
		return (
			<View style={{backgroundColor:'#fff',flex:1}}>
				<StNavHead title="每周总结" />
				<StListView navigator={navigator}
				            detailRoute={ROUTE_SUMMARY_PAGE}
				            taskType={TASK_TYPE_SUMMARY}
				            icon="bookmark"
				            taskList={taskSummary}/>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	const taskSummary = state['task']['taskSummary'];

	return {
		taskSummary:!taskSummary ? [] : taskSummary,
	};
};

export default connect(mapStateToProps)(StSummary);