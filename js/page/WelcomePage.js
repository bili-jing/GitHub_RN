import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

export default class WelcomePage extends Component {
	componentDidMount() {
		this.timer = setTimeout(() => {
			NavigationUtil.resetToHomePage({
				navigation: this.props.navigation
			});
		}, 500);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}> WelcomePage </Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	}
});
