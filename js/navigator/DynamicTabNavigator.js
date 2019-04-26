import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { BottomTabBar } from 'react-navigation-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';

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

export class DynamicTabNavigator extends Component {
	constructor(props) {
		super(props);
		console.disableYellowBox = true;
	}

	_tabNavigator() {
		if (this.TABS) {
			return this.TABS;
		}
		const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
		const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
		PopularPage.navigationOptions.tabBarLabel = '最新';
		return (this.TABS = createAppContainer(
			createBottomTabNavigator(tabs, {
				tabBarComponent: (props) => {
					return <TabBarComponent theme={this.props.theme} {...props} />;
				}
			})
		));
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
		return <BottomTabBar {...this.props} activeTintColor={this.props.theme} />;
	}
}

const mapStateToProps = (state) => ({
	theme: state.theme.theme
});

export default connect(mapStateToProps)(DynamicTabNavigator);
