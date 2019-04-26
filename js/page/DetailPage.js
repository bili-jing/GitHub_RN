import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default class DetailPage extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.detail}> DetailPage </Text>
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
	detail: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	}
});
