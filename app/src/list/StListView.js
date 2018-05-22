/**
 * Created by coder on 2017/3/1.
 */
import React,{Component,PropTypes} from 'react'
import {View,Text,ListView,InteractionManager,RefreshControl,ToastAndroid} from 'react-native'
import {connect} from 'react-redux'
import StTaskListItem from './StTaskListItem'
import {HostPost} from '../ajax/index'
import {ACTION_UPDATE_TASK_LISTS} from '../store/action'
import {TASK_STATE_INDEX} from '../const/StTaskType'
import StLoadPage from '../ui/StLoadPage'
import StCatchError from '../StCatchError'

const ds = new ListView.DataSource({
	rowHasChanged: (r1, r2) => r1 !== r2
});

class StPreview extends Component{
	static propTypes = {
		taskType:PropTypes.number.isRequired,
		taskList:PropTypes.array.isRequired,
		icon:PropTypes.string.isRequired,
	};

	constructor(props){
		super(props);
		this.state = {
			renderPlaceholderOnly: true,
			isRefreshing:false,
		};
	}

    //runAfterInteractions(): 在稍后执行代码，不会延迟当前进行的动画。
    //触摸处理系统会把一个或多个进行中的触摸操作认定为'交互'
	// 并且会将runAfterInteractions()的回调函数延迟执行，直到所有的触摸操作都结束或取消了。
	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({renderPlaceholderOnly: false});
		});
	}

	handleItemSelect = (rowData) => {
		const {detailRoute} = this.props;
		detailRoute.data = rowData;
		detailRoute.title= this.props.title;
		this.props.navigator.push(detailRoute)
	};

	//渲染单个项目
	renderItem = (rowData, sectionID, rowID) => {
		const {icon} = this.props;
		return (
			<StTaskListItem data={rowData} select={this.handleItemSelect} icon={icon} index={rowID}/>
		);
	};

	//
	reloadItems = (taskType) => {
		this.setState({isRefreshing:true});
		HostPost('/get-task-list-ex',{taskTypes:[taskType]},true).then(({json}) => {
			if (json.error===0){
				this.props.updateTaskList({[TASK_STATE_INDEX[taskType]]:json.list});
				ToastAndroid.show('刷新成功！',ToastAndroid.SHORT);
			}else {
				ToastAndroid.show('刷新失败！请稍后重试',ToastAndroid.SHORT);
			}
			this.setState({isRefreshing:false});
		}).catch((error) => {
			StCatchError(error);
			this.setState({isRefreshing:false});
		});
	};

	refreshItems = () => {
		this.reloadItems(this.props.taskType);
	};

	render(){

		if (this.state.renderPlaceholderOnly) {
			return <StLoadPage loadStatus='loading'/>;
		}

		const {taskList} = this.props;

		return (
			<View style={{flex:1}}>
				{
					taskList.length?
						null
						:
						<Text style={{textAlign:"center",fontSize:16,marginTop:30}}>暂时还没有任务,下拉刷新</Text>
				}
				<ListView
					dataSource={ds.cloneWithRows(taskList)}
					renderRow={this.renderItem}
					initialListSize={10}
					enableEmptySections={true}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={this.refreshItems}
							title="Loading..."
						/>
					}
				/>
			</View>

		);
	}
}


//更新
const mapDispatchToProps = {
	updateTaskList:(info) => {
		return {
			type:ACTION_UPDATE_TASK_LISTS,
			payload:info,
		}
	}
};


export default connect(null,mapDispatchToProps)(StPreview);