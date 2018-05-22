/**
 * Created by coder on 2017/2/19.
 */
import React,{Component,PropTypes} from 'react'
import {View,ListView,ViewPagerAndroid,Dimensions,Animated} from 'react-native'
import {connect} from 'react-redux'
import StPracticeMenu from './StPracticeMenu'
import StNavHead from '../StNavHead'
import StListView from '../list/StListView'
import {TASK_TYPE_PREVIEW,TASK_TYPE_HOMEWORK,TASK_TYPE_EXPERIMENT,TASK_TYPE_SUMMARY} from '../const/StTaskType'
import {ROUTE_QUESTION_PAGE , ROUTE_SUMMARY_PAGE} from '../const/StRoute'

const screenWidth = Dimensions.get('window').width;

class StPractice extends Component{
	static propTypes = {
		navigator:PropTypes.object.isRequired,
		taskPreview:PropTypes.array.isRequired,
		taskHomework:PropTypes.array.isRequired,
		taskExperiment:PropTypes.array.isRequired,
		taskSummary:PropTypes.array.isRequired,
	};

	constructor(props){
		super(props);
		this.state = {
			selectedItem:'preview',
			page:0,
			marginLeftValue: new Animated.Value(0),
			arrayOfTasksDoing:[0,0,0,0],
		}
	}

	componentDidMount(){
		const {taskPreview, taskHomework, taskExperiment, taskSummary} = this.props;
		const lists = [taskPreview, taskHomework, taskSummary, taskExperiment];
		this.setState({arrayOfTasksDoing: this.getArray(lists)});
	};

	getArray = (lists) => {
		return lists.map((list) => {
			let num = 0;
			if(list.length){
				list.map((item) => {
					if(!item.content&&!item.expire){
						num++;
					}
				});
			}
			return num;
		});
	};

	componentWillReceiveProps(nextProps){
		const currentArray = this.state.arrayOfTasksDoing;
		const {taskPreview, taskHomework, taskSummary, taskExperiment} = nextProps;
		const lists = [taskPreview, taskHomework, taskSummary, taskExperiment];
		const nextArray = this.getArray(lists);
		for (let i=0;i<currentArray.length;i++){
			if(currentArray[i] !== nextArray[i]){
				this.setState({arrayOfTasksDoing:nextArray});
				break;
			}
		}
	}

	onPageSelected = (e) => {
		this.setState({page: e.nativeEvent.position})
	};

	onPageScroll = (e) => {
		const {position,offset} = e.nativeEvent;
		Animated.timing(
			this.state.marginLeftValue,
			{
				toValue: (position+offset)*screenWidth/4,
				duration: 0
			}
		).start();
	};

	render(){
		const {navigator,taskPreview,taskHomework,taskExperiment,taskSummary} = this.props;
		const {page,marginLeftValue,arrayOfTasksDoing} = this.state;
		const taskListData = [
			{taskType:TASK_TYPE_PREVIEW,icon:"fiber-new",taskList:taskPreview},
			{taskType:TASK_TYPE_HOMEWORK,icon:"library-books",taskList:taskHomework},
			{taskType:TASK_TYPE_SUMMARY,icon:"bookmark",taskList:taskSummary},
			{taskType:TASK_TYPE_EXPERIMENT,icon:"keyboard",taskList:taskExperiment},
		];

		return (
			<View style={{backgroundColor:'#f4f4f4',flex:1}}>
				<StNavHead title="练习"/>
				<StPracticeMenu onLink={this.onLink} page={page} arrayOfTasksDoing={arrayOfTasksDoing}/>
				<View style={{height:2,backgroundColor:'#F5F5F5'}}>
					<Animated.View style={{flex:1,width:screenWidth/4,marginLeft:marginLeftValue,backgroundColor:'#0f88eb'}}/>
				</View>
				<ViewPagerAndroid style={{flex:1}}
				                  initialPage={0}
				                  onPageSelected={this.onPageSelected}
				                  ref={viewPager => { this.viewPager = viewPager; }}
				                  onPageScroll={this.onPageScroll}>
					<View style={{backgroundColor:'#fff'}}>
						<StListView navigator={navigator} detailRoute={ROUTE_QUESTION_PAGE} title="课前预习" {...taskListData[0]} />
					</View>
					<View style={{backgroundColor:'#fff'}}>
						<StListView navigator={navigator} detailRoute={ROUTE_QUESTION_PAGE} title="课后作业" {...taskListData[1]} />
					</View>
					<View style={{backgroundColor:'#fff'}}>
						<StListView navigator={navigator} detailRoute={ROUTE_SUMMARY_PAGE} title="每周总结" {...taskListData[2]} />
					</View>
					<View style={{backgroundColor:'#fff'}}>
						<StListView navigator={navigator} detailRoute={ROUTE_QUESTION_PAGE} title="实验测试" {...taskListData[3]} />
					</View>
				</ViewPagerAndroid>
			</View>
		)
	}

	onLink = (page) => {
		this.setState({page:page});
		this.viewPager.setPage(page);
		Animated.timing(
			this.state.marginLeftValue,
			{
				toValue: page*screenWidth/3,
				duration: 500
			}
		).start();
	};
}

const ds = new ListView.DataSource({
	rowHasChanged: (r1, r2) => r1 !== r2
});

const mapStateToProps = (state) => {
	const taskPreview = state['task']['taskPreview'];
	const taskHomework = state['task']['taskHomework'];
	const taskExperiment = state['task']['taskExperiment'];
	const taskSummary = state['task']['taskSummary'];

	return {
		taskPreview:!taskPreview ? [] : taskPreview,
		taskHomework:!taskHomework ? [] : taskHomework,
		taskExperiment:!taskExperiment ? [] : taskExperiment,
		taskSummary:!taskSummary ? [] : taskSummary,
	};

};

export default connect(mapStateToProps)(StPractice);