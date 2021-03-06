import React, { Component } from 'react';
import { Text, StyleSheet, View, BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import BackPressComponent from '../common/BackPressComponent';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.backPress = new BackPressComponent({ backPress: this.onBackPress() });
	}

	componentDidMount() {
		this.backPress.componentDidMount();
	}

	componentWillUnmount() {
		this.backPress.componentWillUnmount();
	}
	/**
	 * 处理android 中的物理返回键
	 * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
	 *@returns {boolean}
	 */

	onBackPress = () => {
		const { dispatch, nav } = this.props;
		if (nav.routes[1].index === 0) {
			//如果RootNavigation中的MainNavigator的index为0,则不处理返回
			return false;
		}
		dispatch(NavigationActions.back());
		return true;
	};

	render() {
		NavigationUtil.navigation = this.props.navigation;
		return <DynamicTabNavigator />;
	}
}

const mapStateToProps = (state) => ({
	nav: state.nav
});

export default connect(mapStateToProps)(HomePage);
