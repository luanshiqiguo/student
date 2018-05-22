/**
 * Created by coder on 2017/3/6.
 */
import React,{Component,PropTypes} from 'react'
import {Icon,Input} from 'antd'
import './StEditableCell.css'


/**
 * 表格单元格修改功能
 * 注意：onChange函数必须返回一个promise对象，返回的字段里面需要包含error，来判断是否出现错误,出现错误value回滚
 */
export default class StEditableCell extends Component {
	static propTypes = {
		value:PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
		onChange:PropTypes.func,
	};

	constructor(props){
		super(props);
		this.state = {
			placeholder:this.props.placeholder,
			value: this.props.value,
			editable: false,
		};
	}

	handleChange = (e) => {
		const value = e.target.value;
		this.setState({ value });
	};

	//确认修改
	check = () => {
		this.setState({ editable: false });
		if (this.props.onChange) {
			this.props.onChange(this.state.value).then((res)=>{
				if(res.error !== 0){
					this.setState({value:res.value});
				} else{
					throw res;
				}
			}).catch((error) => {
				console.log(error);
				this.setState({value:this.props.value});
			});
		}
	};

	//开始进入编辑模式
	edit = () => {
		this.setState({ editable: true });
	};

	render() {
		const { value, editable ,placeholder} = this.state;
		return (
			<div className="editable-cell">
				{
					editable ?
						<div className="editable-cell-input-wrapper">
							<Input
								value={value}
								placeholder={placeholder}
								onChange={this.handleChange}
								onPressEnter={this.check}
							/>
							<Icon
								type="check"
								className="editable-cell-icon-check"
								onClick={this.check}
							/>
						</div>
						:
						<div className="editable-cell-text-wrapper">
							{value !== null? value  : '--'}
							<Icon
								type="edit"
								className="editable-cell-icon"
								onClick={this.edit}
							/>
						</div>
				}
			</div>
		);
	}


}