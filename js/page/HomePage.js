import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';

export default class HomePage extends Component {
	render() {
		NavigationUtil.navigation = this.props.navigation;
		return <DynamicTabNavigator />;
	}
}
