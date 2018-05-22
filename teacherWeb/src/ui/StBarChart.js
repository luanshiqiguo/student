/**
 * Created by coder on 2017/3/7.
 */
import React,{Component,PropTypes} from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/theme/macarons'

/**
 * 柱状图显示
 */

export default class StBarChart extends Component{
	static propTypes = {
		data:PropTypes.array.isRequired,
		title:PropTypes.string.isRequired,
		subTitle:PropTypes.string,
		legend:PropTypes.string.isRequired,
		style:PropTypes.object
	};

	initBar = () => {
		let barChart = echarts.init(this.barChart,'macarons'); //初始化echarts
		let options = this.getBarOption();
		barChart.setOption(options);
	};

	componentDidMount() {
		this.initBar();
	}

	componentDidUpdate() {
		this.initBar();
	}

	//一个基本的echarts图表配置函数
	getBarOption = () => {
		const { data,title,subTitle,legend } = this.props;
		const count = data.length;

		const realCount = count > 12 ? count : 12;

		let xAxis = [];
		for(let i=0;i<realCount;i++){
			if(i < count){
				xAxis.push(i+1);
			} else {
				xAxis.push('');
			}

		}

		return {
			title : {
				text: title,
				subtext: subTitle
			},
			tooltip: {
				show: true
			},
			legend: {
				data:[legend]
			},
			xAxis : [
				{
					type : 'category',
					data : xAxis
				}
			],
			yAxis : [
				{
					type : 'value',
					min  : 0,
					max  : 100,
				}
			],
			series : [
				{
					"name":legend,
					"type":"bar",
					"data":data
				}
			]
		}
	};

	render() {
		const {style} = this.props;
		return (
			<div ref={(barChart) => this.barChart = barChart} style={style}></div>
		)
	}

}