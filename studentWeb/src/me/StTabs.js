/**
 * Created by abing on 2017/3/31.
 */

import React,{Component} from 'react'
import {Tooltip,Tag,Input,Button} from 'antd'

const colors = ['pink','red','orange','green','cyan','blue','purple'];


export default class StTabs extends Component{

	constructor(props){
		super(props);
		this.state={
			inputVisible: false,
			inputValue: '',
			tags: this.props.tags,
			updateTags:this.props.updateTags,
		};
		this.colors=[];
		for (let i =0; i<6;i++){
			this.colors.push(colors[Math.floor(Math.random()*6)])
		}
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.tags.toString() !== this.state.tags.toString()){
			this.setState({tags:nextProps.tags});
		}
	}

	handleClose = (removedTag) => {
		const tags = this.state.tags.filter(tag => tag !== removedTag);
		// console.log(tags);
		this.setState({ tags });
		this.state.updateTags(tags);
	};

	showInput = () => {
		this.setState({ inputVisible: true }, () => this.input.focus());
	};

	handleInputChange = (e) => {
		this.setState({ inputValue: e.target.value });
	};

	handleInputConfirm = () => {
		const state = this.state;
		const inputValue = state.inputValue;
		let tags = state.tags;
		if (!inputValue.trim() || tags.indexOf(inputValue) !==-1) {
			this.setState({
				inputVisible: false,
				inputValue: '',
			});
			return;
		}
		tags = [...tags, inputValue];
		// console.log(tags);
		this.setState({
			tags,
			inputVisible: false,
			inputValue: '',
		});
		this.state.updateTags(tags);
	};

	saveInputRef = input => this.input = input;

	render(){
		const { tags, inputVisible, inputValue } = this.state;
		return(
			<div>
				{tags.map((tag, index) => {
					const isLongTag = tag.length > 20;
					const tagElem = (
						<Tag key={tag}
						     closable={tags.length !== 1}
						     afterClose={() => this.handleClose(tag)}
						     color={this.colors[index]}
						>
							{isLongTag ? `${tag.slice(0, 20)}...` : tag}
						</Tag>
					);
					return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
				})}
				{inputVisible && (
					<Input
						ref={this.saveInputRef}
						type="text" size="small"
						style={{ width: 78 }}
						value={inputValue}
						onChange={this.handleInputChange}
						onBlur={this.handleInputConfirm}
						onPressEnter={this.handleInputConfirm}
					/>
				)}
				{!inputVisible && tags.length<=5 && <Button size="small" type="dashed" onClick={this.showInput}>+ 添加</Button>}
			</div>
		)
	}
}