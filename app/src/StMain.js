/**
 * Created by coder on 2017/2/19.
 */
import React, {Component,PropTypes} from 'react'
import {Text, StyleSheet, BackAndroid,ToastAndroid} from 'react-native'
import {Tabs, Tab, Icon} from 'react-native-elements'
import StPractice from './practice/StPractice'
import StAchievement from './achievement/StAchievement'
import StMe from './me/StMe'
import StQuestionAnswer from "./questionAnswer/StQuestionAnswer";



export default class StMain extends Component {
	static propTypes = {
		navigator:PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'practice',
		}
	}

	handleBack = () => {
		if(this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()){
			return false;
		}

		this.lastBackPressed = Date.now();
		ToastAndroid.show('在按一次退出应用',ToastAndroid.SHORT);
		return true;
	};

	componentWillMount() {
		BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
	}

	componentWillUnmount() {
		BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
	}


	changeTab = (selectedTab) => {
		this.setState({selectedTab});
	};

	renderTabBarIcon = (name, color) => {
		return (
			() => <Icon containerStyle={styles.iconContainerStyle} color={color} name={name} size={30}/>
		);
	};

	render() {
		const {selectedTab} = this.state;
		const {navigator} = this.props;
		return (
			<Tabs>
				<Tab
					titleStyle={styles.styles}
					selectedTitleStyle={{}}
					selected={selectedTab === 'practice'}
					title={'练习'}
					renderIcon={this.renderTabBarIcon('whatshot', '#5e6977')}
					renderSelectedIcon={this.renderTabBarIcon('whatshot', '#0f88eb')}
					onPress={() => this.changeTab('practice')}>
					<StPractice navigator={navigator}/>
				</Tab>
				<Tab
					titleStyle={styles.styles}
					selectedTitleStyle={{}}
					selected={selectedTab === 'achievement'}
					title={'成就'}
					renderIcon={this.renderTabBarIcon('assessment', '#5e6977')}
					renderSelectedIcon={this.renderTabBarIcon('assessment', '#0f88eb')}
					onPress={() => this.changeTab('achievement')}>
					<StAchievement navigator={navigator}/>
				</Tab>
				<Tab
					titleStyle={styles.styles}
					selectedTitleStyle={{}}
					selected={selectedTab === 'questionAnswer'}
					title={'问答'}
					renderIcon={this.renderTabBarIcon('library-books', '#5e6977')}
					renderSelectedIcon={this.renderTabBarIcon('library-books', '#0f88eb')}
					onPress={() => this.changeTab('questionAnswer')}>
					<StQuestionAnswer navigator={navigator}/>
				</Tab>
				<Tab
					titleStyle={styles.styles}
					selectedTitleStyle={{}}
					selected={selectedTab === 'me'}
					title={'我的'}
					renderIcon={this.renderTabBarIcon('person', '#5e6977')}
					renderSelectedIcon={this.renderTabBarIcon('person', '#0f88eb')}
					onPress={() => this.changeTab('me')}>
					<StMe navigator={navigator}/>
				</Tab>
			</Tabs>
		);
	}
}

const styles = StyleSheet.create({
	iconContainerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 28
	}
});
