/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {Button,Icon,SocialIcon} from 'react-native-elements'
import TabBar from './src/TabBar'

export default class app extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>

	      <Icon
		      name='g-translate'
		      color='#00aced' />

	      <Icon
		      reverse
		      name='ios-american-football'
		      type='ionicon'
		      color='#517fa4'
	      />

	      <Icon
		      raised
		      name='heartbeat'
		      type='font-awesome'
		      color='#f50'
		      onPress={() => console.log('hello')} />

	      <SocialIcon
		      light
		      type='facebook'
	      />

	      <TabBar/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('app', () => TabBar);
