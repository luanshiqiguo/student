/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import StNavigator from './src/StNavigator'
import {Provider} from 'react-redux'

import store from './src/store'

export default class app extends Component {

	render() {
	return (
	    <Provider store={store}>
		    <StNavigator/>
	    </Provider>
	);
	}
}

AppRegistry.registerComponent('app', () => app);
