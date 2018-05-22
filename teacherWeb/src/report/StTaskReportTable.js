/**
 * Created by coder on 2017/3/8.
 */
import React,{Component,PropTypes} from 'react'
import {HostPost} from '../ajax'
import {Table,Tooltip,Input,Button,notification} from 'antd'
import StEllipsis from '../ui/StEllipsis'
import StEditableCell from '../ui/StEditableCell'

import {makeHighlight} from '../common/StHighlight'
import {getPageSize,getPageStartIndex,renderHighlight} from '../common/StTableCommon'
import {TASK_TYPE_SUMMARY} from '../common/constDefine'

export default class StTaskReportTable extends Component{
	static propTypes = {
		onDetail:PropTypes.func.isRequired, //查看task-report详情的回调函数
		taskType:PropTypes.number,
	};

	constructor(props){
		super(props);
		this.state = {
			data:[],
			pagination:{showSizeChanger:true,pageSizeOptions:['10','20','50','100']},
			loading:false,
			search:'',
			preSearch:'',
			weekFilter:[],
			tableFilters:{},
		};
	}

	getColumns = () =>  {
		const {onDetail,taskType} = this.props;
		let columns = [{
			title:'#',
			render:(text,record,index) => {
				const {pagination} = this.state;
				return getPageStartIndex(pagination) + index + 1;
			},
		},{
			title:'学号',
			render:(text,record,index) => {
				return renderHighlight(record,'stuId');
			},
		},{
			title:'姓名',
			render:(text,record,index) => {
				return renderHighlight(record,'name');
			},
		},{
			title:'班级',
			dataIndex:'class',
			key:'class',
		}, {
				title:'第几周',
				dataIndex:'week',
				key:'week',
				filters:this.state.weekFilter,
			}];

		if(!taskType){
			columns.push({
				title:'类型',
				dataIndex:'type',
				key:'type',
				render:(text) => {
					switch (text) {
						case 1:
							return '课前预习';break;
						case 2:
							return '课后作业';break;
						case 3:
							return '实验测试';break;
						case 4:
							return '每周总结';break;
					}
				}
			});
		}

		if(taskType === TASK_TYPE_SUMMARY){
			columns.push({
				title:'总结',
				// width:'350px',
				// dataIndex:'summary',
				// key:'summary',
				render:(text,record,index) => {
					return <StEllipsis text={record.summary} width={350}/>
				}
			});
			columns.push({
				title:'自评分数',
				render:(text,record,index) => {
					return record.selfScore;
				}
			});

			columns.push({
				title:'总结评分',
				dataIndex:'score',
				key:'score',
				width:'100px',
				render:(text,record,index) => {
					return (
						<StEditableCell
							value={text}
							onChange={this.handleScoreChange(index,record)}
							placeholder="0~100"
						/>
					)},
			});

		} else {
			columns.push({
				title:'选择题/总结得分',
				dataIndex:'score',
				key:'score',
			});
			if(taskType) {
				columns.push({
					title:'心得体会',
					dataIndex:'experience',
					key:'experience',
					width:'350px',
				});
				columns.push({
					title: '心得评分',
					dataIndex: 'experienceScore',
					key: 'experienceScore',
					width: '100px',
					render: (text, record, index) => {
						return (
							<StEditableCell
								value={text}
								onChange={this.handleExperienceScoreChange(index, record)}
								placeholder="0~50"
							/>
						)
					},
				});
			}
		}

		columns.push({
			title:'答题耗时',
			key:'time',
			render:(text,record,index) => {
				if(record.time===null){
					return null;
				}else if (record.time<60){
					return record.time+'秒';
				}else {
					return parseInt(record.time/60) + '分' + record.time%60 + '秒';
				}
			},
		});

		columns.push({
			title:'提交时间',
			dataIndex:'finishTime',
			key:'finishTime',
		});

		columns.push({
			title:'详情',
			render:(text,record,index) => {
				return (
					<a onClick={() => onDetail(record)}>详情</a>
				);
			}
		});

		return columns;
	};

	//给学生的心得体会打分
	handleExperienceScoreChange = (index,record) => {
		const {taskId,userId} = record;
		return (value) => {
			let experienceScore = parseInt(value);
			if(experienceScore === record.experienceScore){
				return new Promise((resolve => resolve({error:0})));
			}

			if(experienceScore < 0 || experienceScore > 50){
				notification.error({
					message: '修改提示',
					description: '修改任务报告成绩失败,成绩必须在0-50之间.',
				});
				return new Promise((resolve => resolve({error:-1,value:record.experienceScore})));
			}

			return HostPost('/update-report-of-experienceScore',{userId,taskId,experienceScore},true).then(({json}) => {
				if(json.error === 0){
					notification.success({
						message: '修改提示',
						description: '修改心得体会成绩成功.',
					});
					const newData = [...this.state.data];
					newData[index] = Object.assign({},record,{experienceScore});
					this.setState({data:newData});
					return json;
				} else {
					throw json;
				}
			}).catch((error) => {
				notification.error({
					message: '修改提示',
					description: '修改任务报告成绩失败.',
				});
				// console.log(error);
			});
		};
	};

	//给学生每周总结进行打分，只有summary类型的task-report才可以
	handleScoreChange = (index,record) => {
		const {taskId,userId} = record;
		return (value) => {
			let score = parseInt(value);
			if(score === record.score){
				return new Promise((resolve => resolve({error:0})));
			}

			if(score < 0 || score > 100){
				notification.error({
					message: '修改提示',
					description: '修改任务报告成绩失败,成绩必须在0-100之间.',
				});
				return new Promise((resolve => resolve({error:-1,value:record.score})));
			}

			return HostPost('/update-report-of-score',{userId,taskId,score},true).then(({json}) => {
				if(json.error === 0){
					notification.success({
						message: '修改提示',
						description: '修改任务报告成绩成功.',
					});
					const newData = [...this.state.data];
					newData[index] = Object.assign({},record,{score});
					this.setState({data:newData});
					return json;
				} else {
					throw json;
				}
			}).catch((error) => {
				notification.error({
					message: '修改提示',
					description: '修改任务报告成绩失败.',
				});
				// console.log(error);
			});
		};
	};

	fetch = (params = {}) => {
		const {taskType} = this.props;
		if(taskType){
			params['taskType'] = taskType;
		}

		this.setState({loading:true});
		HostPost('/get-all-reports',{...params},true).then(({json}) => {

			if(json.error === 0){
				const pagination = this.state.pagination;
				pagination.total = json.total;
				const {search} = this.state;
				makeHighlight(json.rows,['name','stuId'],search);

				if(taskType === TASK_TYPE_SUMMARY){
					json.rows.map((item) => {
						const report = JSON.parse(item.content);
						item['summary'] = report.content;
						item['selfScore'] = report.score;
					});
				}

				let newState = {
					loading: false,
					data: json.rows,
					pagination,
				};
				if(params.withFilter){
					newState['weekFilter'] = json.weekFilter.map((item) => {return {text:item.week,value:item.week};});
				}
				this.setState(newState);
			} else {
				throw json;
			}
		}).catch((error) => {
			// console.log(error);
			this.setState({loading:false});
		});
	};

	handleChangeSearch = (e) => {
		this.setState({search:e.target.value});
	};

	handleSearch = () => {
		const {search,preSearch,tableFilters} = this.state;
		if(search == preSearch){
			return;
		}

		const {pagination} = this.state;
		this.setState({preSearch:search,pagination:Object.assign(pagination,{current:1})});

		let params = {
			offset:0,
			limit:getPageSize(pagination),
			search,
		};

		if(tableFilters.hasOwnProperty('week') && tableFilters.week.length > 0){
			params['week'] = tableFilters.week;
		}


		this.fetch(params);
	};

	handleTableChange = (pagination, filters, sorter) => {
		const pager = this.state.pagination;
		pager.current = pagination.current;
		this.setState({pagination: pager,tableFilters:filters});
		let params = {
			offset:getPageStartIndex(pagination),
			limit:getPageSize(pagination),
		};

		if(filters.hasOwnProperty('week') && filters.week.length > 0){
			params['week'] = filters.week;
		}

		const {search,preSearch} = this.state;
		if(search === preSearch){
			params['search'] = search;
		}

		this.fetch(params);
	};

	componentDidMount() {
		this.fetch({
			offset:0,
			limit:10,
			withFilter:true,
		});
	}

	render(){
		const {search} = this.state;
		return (
			<div>
				<div style={{float:'right',padding:'20px 5px 10px 5px',marginTop:'-20px'}}>
					<Tooltip title="名字和学号两个字段可以用于查询.">
						<Input placeholder="查找" value={search} onChange={this.handleChangeSearch} size="large" style={{width:'200px'}}/>
					</Tooltip>
					<Button shape="circle" icon="search" style={{marginLeft:'10px'}} onClick={this.handleSearch}/>

				</div>
				<div style={{float:'left',width:'100%'}}>
					<Table
						style={{}}
						columns={this.getColumns()}
						rowKey={record => record.taskId + '-' + record.userId}
						dataSource={this.state.data}
						pagination={this.state.pagination}
						loading={this.state.loading}
						onChange={this.handleTableChange}
					/>
				</div>
			</div>
		);
	}
}