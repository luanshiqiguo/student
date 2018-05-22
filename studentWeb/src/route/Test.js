/**
 * Created by coder on 2017/3/8.
 */
import React,{Component} from 'react'


class Sub1 extends Component{
	componentDidMount(){
		console.log('sub1 componentDidMount');
	}

	componentWillUnmount(){
		console.log('sub1 componentWillUnmount');
	}

	render(){
		const {style} = this.props;
		return (
			<div style={style}>sub1111</div>
		);
	}
}

class Sub2 extends Component{
	componentDidMount(){
		console.log('sub2 componentDidMount');
	}

	componentWillUnmount(){
		console.log('sub2 componentWillUnmount');
	}

	render(){
		const {style} = this.props;
		return (
			<div style={style}>sub22222</div>
		);
	}
}

export default class Test extends Component{
	constructor(props){
		super(props);
		this.state = {
			selectSub: false,
			sub1:false,
			sub2:false,
		}
	}

	handleClick1 = () => {
		this.setState({selectSub:false,sub1:true});
	};

	handleClick2 = () => {
		this.setState({selectSub:true,sub2:true});
	};

	render(){
		const {selectSub,sub1,sub2} = this.state;


		return(
			<div>
				{sub1 ? <Sub1 style={{display:selectSub ? 'none' : null}}/> : null}
				{sub2 ? <Sub2 style={{display:!selectSub ? 'none' : null}}/> : null}
				<button onClick={this.handleClick1}>button1</button>
				<button onClick={this.handleClick2}>button2</button>

			</div>

		);
	}
}