import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import StSimpleFooter from './ui/StSimpleFooter'
import StHeader from './ui/StHeader'
import './common.css'


class App extends Component {
  render() {
  	const {location} = this.props;
    return (
      <div id="wrapper">
	      <div id="content">
		      <StHeader pathname={location.pathname} />
		      <div id="main">
			      {this.props.children}
		      </div>
	      </div>
	      <div id="footer">
		      <StSimpleFooter></StSimpleFooter>
	      </div>
      </div>
    );
  }
}

export default App;
