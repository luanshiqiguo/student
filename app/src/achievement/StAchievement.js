/**
 * Created by coder on 2017/2/20.
 */
import React,{Component,PropTypes} from 'react'
import {Text,View,ListView,Dimensions,StyleSheet,InteractionManager,Image} from 'react-native'
import {connect} from 'react-redux'
import StNavHead from '../StNavHead'
import StChart from '../ui/StChart'
import StLoadPage from '../ui/StLoadPage'


const selectProportion = 0.5;   //选择题分值比例
const {width} = Dimensions.get('window');
const ds = new ListView.DataSource({
	rowHasChanged: (r1, r2) => r1 !== r2
});

class StAchievement extends Component{
	static propTypes = {
		taskPreview:PropTypes.array.isRequired,
		taskHomework:PropTypes.array.isRequired,
		taskExperiment:PropTypes.array.isRequired,
		taskSummary:PropTypes.array.isRequired,
	};

	constructor(props){
		super(props);
		this.state={
			renderPlaceholderOnly:true,
		}
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({renderPlaceholderOnly: false});
		});
	}

	getTaskChartData = (tasks) => {
		const taskCount = tasks.length;
		let xAxis = [];
		let value = [];
		for(let i=0;i<taskCount;i++){
			xAxis.push(String(i+1));
			if(tasks[i].score === null){
				value.push(null);
			} else {
				value.push(Math.round(tasks[i].score/Object.getOwnPropertyNames(JSON.parse(tasks[i].content).content).length*100*selectProportion)+tasks[i].experienceScore);
			}
		}
		return {value,xAxis};
	};

	getSummaryChartData = (tasks) => {
		const taskCount = tasks.length;
		let xAxis = [];
		let value = [];
		for(let i=0;i<taskCount;i++){
			xAxis.push(String(i+1));
			if(tasks[i].score === null){
				value.push(null);
			} else {
				value.push(tasks[i].score);
			}
		}
		return {value,xAxis};
	};

	renderItem = (rowData) => {
		const {width,height,title,data,color,style} = rowData;
		return(
			<StChart width={width} height={height} title={title} data={data} color={color} style={style}/>
		)
	};

	render(){
		const {taskPreview,taskHomework,taskExperiment,taskSummary} = this.props;
		if(!taskPreview||this.state.renderPlaceholderOnly){
			return(
				<View style={{backgroundColor:'#fff',flex:1}}>
					<StNavHead title="成就"/>
					<StLoadPage loadStatus='loading'/>
				</View>
			);
		}

		const taskLists = [
			{width:width,height:200,title:'课前预习',data:this.getTaskChartData(taskPreview),color:"#fd7505",style:styles.chart},
			{width:width,height:200,title:'课后作业',data:this.getTaskChartData(taskHomework),color:"#fd7505",style:styles.chart},
			{width:width,height:200,title:'实验测试',data:this.getTaskChartData(taskExperiment),color:"#fd7505",style:styles.chart},
			{width:width,height:200,title:'每周总结',data:this.getSummaryChartData(taskSummary),color:"#fd7505",style:styles.chart}
		];

		return (
			<View style={{backgroundColor:'#f4f4f4',flex:1}}>
				<StNavHead title="成就"/>
				<ListView
					dataSource={ds.cloneWithRows(taskLists)}
					renderRow={this.renderItem}
					enableEmptySections={true}
					initialListSize={2}
					pageSize={1}
				/>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	chart:{
		backgroundColor:'#fff',
		marginBottom:30,
		paddingTop:10,
	}
});

const mapStateToProps = (state) => {
	return {
		taskPreview:state['task']['taskPreview'],
		taskHomework:state['task']['taskHomework'],
		taskExperiment:state['task']['taskExperiment'],
		taskSummary:state['task']['taskSummary'],
	};
};

export default connect(mapStateToProps)(StAchievement);