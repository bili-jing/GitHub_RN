import React, { Component } from 'react';
import { Text, StyleSheet, View, Button, TouchableOpacity,DeviceInfo } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import actions from '../actions';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil';
const THEME_COLOR = '#678';
class MyPage extends Component {
	getRightButton() {
		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity onPress={() => {}}>
					<View style={{ padding: 5, marginRight: 8 }}>
						<Feather name={'search'} size={24} style={{ color: 'white' }} />
					</View>
				</TouchableOpacity>
			</View>
		);
	}
	getLeftButton() {
		return (
			<TouchableOpacity style={{ padding: 8, paddingLeft: 12 }} onPress={() => {}}>
				<Ionicons name={'ios-arrow-back'} size={26} style={{ color: 'white' }} />
			</TouchableOpacity>
		);
	}
	render() {
		let statusBar = {
			backgroundColor: THEME_COLOR,
			barStyle: 'light-content'
		};
		let navigationBar = (
			<NavigationBar
				title={'我的'}
				statusBar={statusBar}
				style={{ backgroundColor: THEME_COLOR }}
				rightButton={this.getRightButton()}
				leftButton={this.getLeftButton()}
			/>
		);
		return (
			<View style={styles.container}>
				{navigationBar}
				<Text style={styles.home}> MyPage </Text>
				<Button
					title={'改变主题颜色'}
					onPress={() => {
						this.props.onThemeChange('pink');
					}}
				/>
				<Text
					onPress={() => {
						NavigationUtil.goPage(
							{
								// navigation: this.props.navigation
							},
							'DetailPage'
						);
					}}
				>
					跳转到详情页
				</Text>
				<Button
					title={'Fetch 使用'}
					onPress={() => {
						NavigationUtil.goPage({}, 'FetchDemo');
					}}
				/>
				<Button
					title={'AsyncStorage 使用'}
					onPress={() => {
						NavigationUtil.goPage({}, 'AsyncStorageDemoPage');
					}}
				/>
				<Button
					title={'离线缓存框架'}
					onPress={() => {
						NavigationUtil.goPage({}, 'DataStorageDemoPage');
					}}
				/>
			</View>
		);
	}
}
const marginTop = DeviceInfo.isIPhoneX_deprecated ? 30 :0
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
		marginTop: marginTop
	},
	home: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	}
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
	onThemeChange: (theme) => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
