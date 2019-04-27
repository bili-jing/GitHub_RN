import React, { Component } from 'react';
import { Text, StyleSheet, View, AsyncStorage, TextInput } from 'react-native';

const KEY = 'save_key';

export default class AsyncStorageDemoPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showText: ''
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.AsyncStorage}> AsyncStorageDemoPage </Text>
				<TextInput
					style={styles.input}
					onChangeText={(text) => {
						this.value = text;
					}}
				/>
				<View style={styles.input_container}>
					<Text
						onPress={() => {
							this.doSave();
						}}
					>
						存储
					</Text>
					<Text
						onPress={() => {
							this.doRemove();
						}}
					>
						删除
					</Text>
					<Text
						onPress={() => {
							this.getData();
						}}
					>
						获取
					</Text>
				</View>
				<Text>{this.state.showText}</Text>
			</View>
		);
	}
	async doSave() {
		//用法一
		AsyncStorage.setItem(KEY, this.value, (error) => {
			error && console.log(error.toString());
		});
	}
	async doRemove() {
		AsyncStorage.removeItem(KEY, (err) => {
			err && console.log(err.toString());
		});
	}
	async getData() {
		//用法一
		AsyncStorage.getItem(KEY, (error, value) => {
			this.setState({
				showText: value
			});
			console.log(value);
			error && console.log(error.toString());
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF'
	},
	AsyncStorage: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	},
	input: {
		height: 30,
		borderColor: 'black',
		borderWidth: 1,
		marginRight: 10
	},
	input_container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around'
	}
});
