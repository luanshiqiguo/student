/**
 * Created by coder on 2017/3/7.
 */
import React,{Component,PropTypes} from 'react'
import StBarChart from '../ui/StBarChart'

const selectProportion = 0.5;   //选择题分值比例

export default class StStudentCharts extends Component{

	static propTypes = {
		dataPreview:PropTypes.array.isRequired,
		dataHomework:PropTypes.array.isRequired,
		dataExperiment:PropTypes.array.isRequired,
		dataSummary:PropTypes.array.isRequired,
	};

	getChartData = (data) => {
		return data.map((item) => item.score ?
			Math.round(item.score/Object.getOwnPropertyNames(JSON.parse(item.content).content).length*100*selectProportion)+item.experienceScore
			:
			0
		);
	};

	getDataSummary = (data) => {
		return data.map((item) => item.score ? item.score : 0 )
	};

	render() {
		const {dataPreview,dataHomework,dataExperiment,dataSummary} = this.props;
		console.log(dataPreview,dataHomework,dataExperiment,dataSummary);
		return (
			<div>
				<StBarChart
					data={this.getChartData(dataPreview)}
					title="学生的课前预习情况"
					subTitle="课前预习"
					legend="课前预习"
					style={{width:'100%',height:'360px',marginTop:'40px'}}
				/>
				<StBarChart
					data={this.getChartData(dataHomework)}
					title="学生的课后作业情况"
					subTitle="课后作业"
					legend="课后作业"
					style={{width:'100%',height:'360px',marginTop:'40px'}}
				/>
				<StBarChart
					data={this.getChartData(dataExperiment)}
					title="学生的实验练习情况"
					subTitle="实验练习"
					legend="实验练习"
					style={{width:'100%',height:'360px',marginTop:'40px'}}
				/>
				<StBarChart
					data={this.getDataSummary(dataSummary)}
					title="学生的每周总结情况"
					subTitle="每周总结"
					legend="每周总结"
					style={{width:'100%',height:'360px',marginTop:'40px'}}
				/>
			</div>
		)
	}

}