import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { BottomTabBar } from 'react-navigation-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import PopularPage from '../page/PopularPage';
import MyPage from '../page/MyPage';
import FavoritePage from '../page/FavoritePage';
import TrendingPage from '../page/TrendingPage';

const TABS = {
	//这里配置路由页面
	PopularPage: {
		screen: PopularPage,
		navigationOptions: {
			tabBarLabel: '热门',
			tabBarIcon: ({ initColor, focuesed }) => (
				<MaterialIcons name={'whatshot'} size={26} style={{ color: initColor }} />
			)
		}
	},
	TrendingPage: {
		screen: TrendingPage,
		navigationOptions: {
			tabBarLabel: '趋势',
			tabBarIcon: ({ initColor, focuesed }) => (
				<Ionicons name={'md-trending-up'} size={26} style={{ color: initColor }} />
			)
		}
	},
	FavoritePage: {
		screen: FavoritePage,
		navigationOptions: {
			tabBarLabel: '收藏',
			tabBarIcon: ({ initColor, focuesed }) => (
				<MaterialIcons name={'favorite'} size={26} style={{ color: initColor }} />
			)
		}
	},
	MyPage: {
		screen: MyPage,
		navigationOptions: {
			tabBarLabel: '我的',
			tabBarIcon: ({ initColor, focuesed }) => <Entypo name={'user'} size={26} style={{ color: initColor }} />
		}
	}
};

export default class DynamicTabNavigator extends Component {
	constructor(props) {
		super(props);
		console.disableYellowBox = true;
	}

	_tabNavigator() {
		const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
		const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
		PopularPage.navigationOptions.tabBarLabel = '最新';
		return createAppContainer(
			createBottomTabNavigator(tabs, {
				tabBarComponent: TabBarComponent
			})
		);
	}

	render() {
		const Tab = this._tabNavigator();
		return <Tab />;
	}
}

class TabBarComponent extends React.Component {
	constructor(props) {
		super(props);
		this.theme = {
			tintColor: props.activeTintColor,
			updateTime: new Date().getTime()
		};
	}

	render() {
		const { routes, index } = this.props.navigation.state;
		if (routes[index].params) {
			const { theme } = routes[index].params;
			//以更细的时间为主,防止被其他的tab之前的修改覆盖掉
			if (theme && theme.updateTime > this.theme.updateTime) {
				this.theme = theme;
			}
		}
		return <BottomTabBar {...this.props} activeTintColor={this.theme.tintColor || this.props.activeTintColor} />;
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
