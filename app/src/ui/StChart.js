/**
 * Created by abing on 2017/2/22.
 */
import React,{Component,PropTypes} from 'react'
import {View, ART, Text, StyleSheet , Switch} from 'react-native'
const {Surface, Shape, Path,Group} = ART;

class StYAxis extends Component{
	static propTypes ={
		height:PropTypes.number.isRequired,
	};

	render(){
		const {height} = this.props;
		const yAxis = ['100','80','60','40','20','0'];
		return (
			<View style={{alignItems :'flex-end',justifyContent:'space-between',height:height+20,marginTop:-10,width:30}}>
				{
					yAxis.map((item,index) => {
						return (<Text key={index}>{item}</Text>);
					})
				}
			</View>
		);
	}
}

class StXAxis extends Component{
	static propTypes = {
		xAxis:PropTypes.array.isRequired,
		eWidth:PropTypes.number.isRequired,
	};

	render(){
		const {xAxis,eWidth} = this.props;

		let dataCopy  = xAxis.slice();
		if(dataCopy.length<5){
			let emptyNumber = 5-dataCopy.length;
			for (let i=0;i<emptyNumber;i++){
				dataCopy.push('');
			}
		}

		return (
			<View style={{flexDirection:'row',justifyContent:'space-between'}}>
				{
					dataCopy.map((item,index) => {
						return <Text key={index} style={{width:eWidth,textAlign:'center'}}>{item}</Text>
					})
				}
			</View>
		);
	}
}

class StChartContent extends Component{
	static propTypes = {
		height:PropTypes.number.isRequired,
		width:PropTypes.number.isRequired,
		value:PropTypes.array.isRequired,   //每个bar对应的值（高度）
		color:PropTypes.string.isRequired,
	};

	//水平标线
	horizontalLinePath = (eHight,width) => {
		let path = new Path();
		for (let i=0;i < 5;i++){
			path.moveTo(0,i*eHight)
				.lineTo(width,i*eHight);
		}
		return path;
	};

	//竖直标线
	verticalLinePath = (eWidth,height,count) => {
		let path = new Path();
		for (let i=1;i<=count;i++){
			path.moveTo(i*eWidth,0)
				.lineTo(i*eWidth,height);
		}
		return path;
	};

	//画图（返回路径数组）
	drawBars = (value,eWidth,height) => {
		return value.map((item,index) => {
			if (item === null){     //task为完成时，成绩为null,不再划图
				return null;
			}

			let h = item/100*height;
			let y = height-h;
			let x = index*eWidth+0.1*eWidth;

			let path = new Path();
			path.moveTo(x,y)
				.lineTo(x+0.8*eWidth,y)
				.lineTo(x+0.8*eWidth,height-1)
				.lineTo(x,height-1)
				.close();
			return path;
		});
	};

	//XY轴
	drawXYAixs = (width,height) => {
		return new Path()
			.moveTo(0,0)
			.lineTo(0,height)
			.lineTo(width,height);
	};

	render(){
		const {width,height,value,color} = this.props;

		let count = value.length;               //柱状图的条数
		let miniCount = count>5 ? count : 5;    //最少竖直标线：5
		let eWidth = width/miniCount;           //平均每条bar占的宽度
		let eHeight = height/5;                 //共5条水平线，平均每条占的高度

		return (
			<View>
				<Surface width={width} height={height}>
					<Group>
						<Shape d={this.drawXYAixs(width,height)} stroke="#4488bb" strokeWidth={2} />
						<Shape d={this.horizontalLinePath(eHeight,width)} stroke="#cccccc" strokeWidth={1} />
						<Shape d={this.verticalLinePath(eWidth,height,miniCount)} stroke="#cccccc" strokeWidth={1} />
						{
							this.drawBars(value,eWidth,height).map((item,index) => {
								return <Shape key={index} d={item} stroke="#cccccc" fill={color} strokeWidth={0} />})
						}
					</Group>
				</Surface>
			</View>
		);
	}
}



export default class StChart extends Component{

	constructor(props){
		super(props);
		this.state={
			switchValue:false,
		}
	}

	handleChangeSwitchValue = (value) => {
		this.setState({switchValue:value});
	};

	render(){
		const {height,title,data,color,style} = this.props;
		const {switchValue} = this.state;
		let width = this.props.width-40;        //需要将y轴空间空出来
		const {value,xAxis} = data;

		let count = value.length;
		let miniCount = count>5 ? count : 5;    //最少竖直标线：5
		let eWidth = width/miniCount;

		return(
			<View style={style}>
				<View style={{flexDirection:'row',justifyContent:'center',width:this.props.width,marginBottom:10}}>
					<View style={{height:15,width:25,backgroundColor:color,borderRadius:5,marginRight:5}}/>
					<Text>{title}</Text>
				</View>
				<View style={{marginTop:-30,marginBottom:10,alignItems:'flex-end'}}>
					<Switch style={{width:50}}
					        value={switchValue}
					        onValueChange={this.handleChangeSwitchValue}/>
				</View>
				<View style={{flexDirection:'row'}} >
					<StYAxis height={height}/>
					<View>
						<StChartContent width={width} height={height} color={color} value={value}/>
						<StXAxis xAxis={xAxis} eWidth={eWidth} />
					</View>
				</View>
				{
					switchValue?
						<View style={{height:240,padding:20,flexWrap:'wrap'}}>
							{
								value.map((item, index) => {
									return (
										<View key={index} style={{backgroundColor:'#efefef',width:66,marginBottom:10,marginRight:18,padding:5,borderRadius:5,flexDirection:'row'}}>
											<View style={{flex:1,borderRightWidth:1,borderRightColor:'#ccc'}}>
												<Text style={{textAlign:'center'}}>{index + 1}</Text>
											</View>
											<View style={{flex:1}}>
												<Text style={{textAlign:'center'}}>{item === null ? '--' : item}</Text>
											</View>
										</View>
									)
								})
							}
						</View>
						:
						null

				}

			</View>
		)
	}
}