/**
 * Created by coder on 2017/3/9.
 */
import React,{Component,PropTypes} from 'react'
import {Tooltip,Table,Button,Input,Popover} from 'antd'
import {HostPost} from '../ajax'
import './StQuestionsForSelect.css'
import {makeHighlight} from '../common/StHighlight'
import {getPageSize,getPageStartIndex,renderHighlight} from '../common/StTableCommon'
import {choiceIndex} from '../common/StQuestionCommon'

/**
 * 表格数据的选择功能，onChange回调选择项的变化，
 * 在没有设置selectedItems的时候可以用defaultSelectedItems来设置默认的选择项
 */

export default class StQuestionsForSelect extends Component{
	static propTypes = {
		selectedItems:PropTypes.arrayOf(PropTypes.number),
		defaultSelectedItems:PropTypes.arrayOf(PropTypes.number),
		onChange:PropTypes.func,
	};

	static defaultProps = {
		defaultSelectedItems:[],
	};

	constructor(props){
		super(props);

		this.state = {
			data:[],
			pagination:{showSizeChanger:true,pageSizeOptions:['10','20','50','100']},
			loading:false,
			search:'',
			preSearch:'',
			selectedItems:[],
		};
	}

	getColumns = () => {
		return [{
			title:'#',
			width:'5%',
			render:(text,record,index) => {
				const {pagination} = this.state;
				return getPageStartIndex(pagination) + index + 1;
			},
		},{
			title:'题号',
			dataIndex:'id',
			key:'id',
			width:'5%',
			render:(text,record,index) => {
				return record.hasOwnProperty('id_hl') ? <span>#{record['id_hl']}</span> : <span>#{record['id']}</span>;
			}
		},{
			title:'问题',
			width:'30%',
			render:(text,record,index) => {
				return renderHighlight(record,'question');
			}
		},{
			title:'选项',
			width:'30%',
			render:(text,record,index) => {
				const options = renderHighlight(record,'options');
				const content = (
					<div>
						{options.map((item,index) => {
							return (<p key={index} style={{padding:'3px',color:index == record.answers?'#f50':''}}>{choiceIndex[index]}. {item}</p>);
						})}
					</div>
				);

				return (
					<div>A. {options[0]}...
						<Popover title="题目选项" trigger="hover" content={content}>
							<a>详细</a>
						</Popover>
					</div>
				);

			}
		},{
			title:'创建者',
			dataIndex:'name',
			key:'name',
			width:'15%',
		},{
			title:'创建时间',
			dataIndex:'created_at',
			key:'created_at',
			width:'15%',
		}];
	};


	fetch = (params = {}) => {
		const {taskType} = this.props;
		if(taskType){
			params['taskType'] = taskType;
		}

		this.setState({loading:true});
		HostPost('/get-all-questions-for-select',{...params},true).then(({json}) => {
			if(json.error === 0){
				const pagination = this.state.pagination;
				pagination.total = json.total;

				json.rows.map((item) => {
					const question = JSON.parse(item.content);
					item.question = question.question;
					item.options = question.options;
				});

				const {search} = this.state;
				makeHighlight(json.rows,['id','question','options'],search);

				let newState = {
					loading: false,
					data: json.rows,
					pagination,
				};
				this.setState(newState);
			} else {
				throw json;
			}
		}).catch((error) => {
			// console.log(error);
			this.setState({loading:false});
		});
	};

	//搜索框修改的回调
	handleChangeSearch = (e) => {
		this.setState({search:e.target.value});
	};

	//点击搜索按钮的回调
	handleSearch = () => {
		const {search,preSearch} = this.state;
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

		this.fetch(params);
	};

	handleTableChange = (pagination, filters, sorter) => {
		const pager = this.state.pagination;
		pager.current = pagination.current;
		this.setState({pagination: pager});
		let params = {
			offset:getPageStartIndex(pagination),
			limit:getPageSize(pagination),
		};

		const {search,preSearch} = this.state;
		if(search === preSearch){
			params['search'] = search;
		}

		this.fetch(params);
	};

	componentDidMount() {
		this.fetch({offset:0, limit:10,});
	}

	//表格的选择功能设置
	getRowSelectionOption = () => {
		const {selectedItems,onChange} = this.props;
		return {
			onChange: (selectedRowKeys, selectedRows) => {
				//console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
				//this.setState({selectedItems:[...selectedRowKeys]});
				if(onChange){
					onChange(selectedRowKeys);
				} else {
					this.setState({selectedItems:[...selectedRowKeys]});
				}
			},
			onSelect: (record, selected, selectedRows) => {
				//console.log(record, selected, selectedRows);
			},
			onSelectAll: (selected, selectedRows, changeRows) => {
				//console.log(selected, selectedRows, changeRows);
			},
			getCheckboxProps: record => ({
			}),
			selectedRowKeys:selectedItems ? selectedItems : this.state.selectedItems,
		};
	};

	render(){
		const {search} = this.state;
		const selectedItems = this.props.selectedItems.length ? this.props.selectedItems : this.state.selectedItems;
		return (
			<div className="questions-for-select">
				<div className="selected-panel">
					{selectedItems.map((item,index) => {
						return (
							<span key={index}>#{item} </span>
						);
					})}
				</div>
				<div className="table-toolbar">
					<Tooltip title="题号、问题和选项三个字段可以用于查询.">
						<Input placeholder="查找" value={search} onChange={this.handleChangeSearch} size="large" style={{width:'200px'}}/>
					</Tooltip>
					<Button shape="circle" icon="search" style={{marginLeft:'10px'}} onClick={this.handleSearch}/>

				</div>
				<div className="table-panel">
					<Table
						style={{}}
						columns={this.getColumns()}
						rowKey={record => record.id}
						dataSource={this.state.data}
						pagination={this.state.pagination}
						loading={this.state.loading}
						onChange={this.handleTableChange}
					    rowSelection={this.getRowSelectionOption()}
					/>
				</div>
			</div>
		);
	}
}