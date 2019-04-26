import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';

export default class MyPage extends Component {
	render() {
		const { navigation } = this.props;
		return (
			<View style= {styles.container}>
				<Text style={styles.home}> MyPage </Text>
				<Button
					title={'改变主题颜色'}
					onPress={() => {
						navigation.setParams({
							theme: {
								tintColor: 'pink',
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
