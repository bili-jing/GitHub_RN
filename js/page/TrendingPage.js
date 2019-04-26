import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';

export default class TrendingPage extends Component {
	render() {
		const { navigation } = this.props;
		return (
			<View style={styles.container}>
				<Text style={styles.home}> TrendingPage </Text>
				<Button
					title={'改变主题颜色'}
					onPress={() => {
						navigation.setParams({
							theme: {
								tintColor: 'red',
								updateTime: new Date().getTime()
							}
						});
					}}
				/>
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
	home: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	}
});
