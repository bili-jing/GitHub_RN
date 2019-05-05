import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, StyleSheet, View, FlatList, RefreshControl, Text, DeviceInfo } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import EventBus from 'react-native-event-bus';

import actions from '../actions';
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import TrendingItem from '../common/TrendingItem';
import EventTypes from '../util/EventTypes';

const THEME_COLOR = '#678';
export default class FavoritePage extends Component {
	constructor(props) {
		super(props);
		this.tabNames = [ '最热', '趋势' ];
	}

	render() {
		let statusBar = {
			backgroundColor: THEME_COLOR,
			barStyle: 'light-content'
		};
		let navigationBar = (
			<NavigationBar title={'收藏'} statusBar={statusBar} style={{ backgroundColor: THEME_COLOR }} />
		);
		const TabNavigator = createAppContainer(
			createMaterialTopTabNavigator(
				{
					Popular: {
						screen: (props) => <FavoriteTabPage {...props} flag={FLAG_STORAGE.falg_popular} />, //初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
						navigationOptions: {
							title: '最热'
						}
					},
					Trending: {
						screen: (props) => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />, //初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
						navigationOptions: {
							title: '趋势'
						}
					}
				},
				{
					tabBarOptions: {
						tabStyle: styles.tabStyle,
						upperCaseLabel: false, //是否使标签大写,默认是true
						scrollEnabled: false, //是否支持,选项卡滚动,默认是false
						style: {
							backgroundColor: '#678',
							height: 30 //解决scrollEnabled后在android上初次加载时闪烁问题
						},
						indicatorStyle: styles.indicatorStyle, //标签指示器(下边框)的样式
						labelStyle: styles.labelStyle //文字的样式
					}
				}
			)
		);
		return (
			<View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
				{navigationBar}
				<TabNavigator />
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	favorite: state.favorite
});

const mapDispatchToProps = (dispatch) => ({
	onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading))
});

class FavoriteTab extends Component {
	constructor(props) {
		super(props);
		const { flag } = this.props;
		this.storeName = flag;
		this.favoriteDao = new FavoriteDao(flag);
	}

	componentDidMount() {
		this.loadData();
		EventBus.getInstance().addListener(
			EventTypes.bottom_tab_select,
			(this.listener = (data) => {
				if (data.to === 2) {
					this.loadData(false);
				}
			})
		);
	}

	componentWillUnmount() {
		EventBus.getInstance().removeListener(this.listener);
	}

	loadData(isShowLoading) {
		const { onLoadFavoriteData } = this.props;
		onLoadFavoriteData(this.storeName, isShowLoading);
	}

	/**
	 * 获取与当前页面有关的数据
	 */
	_store() {
		const { favorite } = this.props;
		let store = favorite[this.storeName];
		if (!store) {
			store = {
				items: [],
				isLoading: false,
				projectModels: [] //要显示的数据,
			};
		}
		return store;
	}

	onFavorite(item, isFavorite) {
		FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
		if (this.storeName === FLAG_STORAGE.falg_popular) {
			EventBus.getInstance().fireEvent(EventTypes.favorite_change_popular);
		} else {
			EventBus.getInstance().fireEvent(EventTypes.favorite_change_trending);
		}
	}

	renderItem(data) {
		const item = data.item;
		console.log('item', item);
		const Item = this.storeName === FLAG_STORAGE.falg_popular ? PopularItem : TrendingItem;
		return (
			<Item
				projectModel={item}
				onSelect={(callback) => {
					NavigationUtil.goPage(
						{
							projectModel: item,
							flag: this.storeName,
							callback
						},
						'DetailPage'
					);
				}}
				onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
			/>
		);
	}

	genIndicator() {
		return this._store().hideLoadingMore ? null : (
			<View style={styles.indicatorContainer}>
				<ActivityIndicator style={styles.indicator} />
				<Text>正在加载更多</Text>
			</View>
		);
	}

	render() {
		let store = this._store();
		return (
			<View style={styles.container}>
				<FlatList
					data={store.projectModels}
					renderItem={(data) => this.renderItem(data)}
					keyExtractor={(item) => '' + (item.item.id || item.item.fullName)}
					refreshControl={
						// 下拉刷新
						<RefreshControl
							title={'Loading'}
							titleColor={THEME_COLOR}
							colors={[ THEME_COLOR ]}
							refreshing={store.isLoading}
							onRefresh={() => this.loadData(true)}
							titleColor={THEME_COLOR}
						/>
					}
				/>
				<Toast ref={'toast'} position={'center'} />
			</View>
		);
	}
}

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	},
	tabStyle: {
		// minWidth: 50
		padding: 0
	},
	indicatorStyle: {
		height: 2,
		backgroundColor: 'white'
	},
	labelStyle: {
		fontSize: 13,
		margin: 0
	},
	indicatorContainer: {
		alignItems: 'center'
	},
	indicator: {
		color: 'red',
		margin: 10
	}
});
