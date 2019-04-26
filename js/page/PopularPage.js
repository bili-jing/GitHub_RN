import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

export default class PopularPage extends Component {
	constructor(props) {
		super(props);
		this.tabNames = [ 'Java', 'Android', 'Python', 'Go', 'JavaScript', 'C++', 'IOS' ];
	}

	_genTab() {
		const tabs = {};
		this.tabNames.forEach((item, index) => {
			tabs[`tab${index}`] = {
				screen: (props) => <PopularTab {...props} tabLabel={item} />,
				navigationOptions: {
					title: item
				}
			};
		});
		return tabs;
	}
	render() {
		const TabNavigator = createAppContainer(
			createMaterialTopTabNavigator(this._genTab(), {
				tabBarOptions: {
					tabStyle: styles.tabStyle,
					upperCaseLabel: false, //是否使标签大写,默认是true
					scrollEnabled: true, //是否支持,选项卡滚动,默认是false
					style: {
						backgroundColor: '#678'
					},
					indicatorStyle: styles.indicatorStyle, //标签指示器(下边框)的样式
					labelStyle: styles.labelStyle //文字的样式
				}
			})
		);
		return (
			<View style={{ flex: 1, marginTop: 30 }}>
				<TabNavigator />
			</View>
		);
	}
}

class PopularTab extends Component {
	render() {
		const { tabLabel } = this.props;
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>{tabLabel}</Text>
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
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F5FCFF'
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	},
	tabStyle: {
		minWidth: 50
	},
	indicatorStyle: {
		height: 2,
		backgroundColor: 'white'
	},
	labelStyle: {
		fontSize: 13,
		marginTop: 6,
		marginBottom: 6
	}
});
