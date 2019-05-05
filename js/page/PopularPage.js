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
import EventTypes from '../util/EventTypes';

const THEME_COLOR = '#678';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'; //点赞数的排序
const pageSize = 10;
const favoriteDao = new FavoriteDao(FLAG_STORAGE.falg_popular);

export default class PopularPage extends Component {
	constructor(props) {
		super(props);
		this.tabNames = [ 'Java', 'Android', 'Python', 'Go', 'JavaScript', 'C++', 'IOS' ];
	}

	_genTab() {
		const tabs = {};
		this.tabNames.forEach((item, index) => {
			tabs[`tab${index}`] = {
				screen: (props) => <PopularTabPage {...props} tabLabel={item} />,
				navigationOptions: {
					title: item
				}
			};
		});
		return tabs;
	}
	render() {
		let statusBar = {
			backgroundColor: THEME_COLOR,
			barStyle: 'light-content'
		};
		let navigationBar = (
			<NavigationBar title={'最热'} statusBar={statusBar} style={{ backgroundColor: THEME_COLOR }} />
		);
		const TabNavigator = createAppContainer(
			createMaterialTopTabNavigator(this._genTab(), {
				tabBarOptions: {
					tabStyle: styles.tabStyle,
					upperCaseLabel: false, //是否使标签大写,默认是true
					scrollEnabled: true, //是否支持,选项卡滚动,默认是false
					style: {
						backgroundColor: '#678',
						height: 30 //解决scrollEnabled后在android上初次加载时闪烁问题
					},
					indicatorStyle: styles.indicatorStyle, //标签指示器(下边框)的样式
					labelStyle: styles.labelStyle //文字的样式
				}
			})
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
	popular: state.popular
});

const mapDispatchToProps = (dispatch) => ({
	onLoadPopularData: (storeName, url, pagaSize, favoriteDao) =>
		dispatch(actions.onLoadPopularData(storeName, url, pagaSize, favoriteDao)),
	onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) =>
		dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
	onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) =>
		dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});

class PopularTab extends Component {
	constructor(props) {
		super(props);
		const { tabLabel } = this.props;
		this.storeName = tabLabel;
		this.isFavoriteChanged = false;
	}

	componentDidMount() {
		this.loadData();
		EventBus.getInstance().addListener(
			EventTypes.favorite_change_popular,
			(this.favoriteChangeListener = () => {
				this.isFavoriteChanged = true;
			})
		);
		EventBus.getInstance().addListener(
			EventTypes.bottom_tab_select,
			(this.bottomTabSelectListener = (data) => {
				if (data.to === 0 && this.isFavoriteChanged) {
					this.loadData(null, true);
				}
			})
		);
	}

	componentWillUnmount() {
		EventBus.getInstance().removeListener(this.favoriteChangeListener);
		EventBus.getInstance().removeListener(this.bottomTabSelectListener);
	}

	loadData(loadMore, refreshFavorite) {
		const { onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite } = this.props;
		const store = this._store();
		const url = this.genFetchUrl(this.storeName);
		if (loadMore) {
			onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (callback) => {
				this.refs.toast.show('没有更多了');
			});
		} else if (refreshFavorite) {
			onFlushPopularFavorite(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao);
		} else {
			onLoadPopularData(this.storeName, url, pageSize, favoriteDao);
		}
	}

	/**
	 * 获取与当前页面有关的数据
	 */
	_store() {
		const { popular } = this.props;
		let store = popular[this.storeName];
		if (!store) {
			store = {
				items: [],
				isLoading: false,
				projectModels: [], //要显示的数据,
				hideLoadingMore: true //默认隐藏加载更多
			};
		}
		return store;
	}

	genFetchUrl(key) {
		return URL + key + QUERY_STR;
	}

	renderItem(data) {
		const item = data.item;
		return (
			<PopularItem
				projectModel={item}
				onSelect={(callback) => {
					NavigationUtil.goPage(
						{ projectModel: item, flag: FLAG_STORAGE.falg_popular, callback },
						'DetailPage'
					);
				}}
				onFavorite={(item, isFavorite) =>
					FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.falg_popular)}
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
					keyExtractor={(item) => '' + item.item.id}
					refreshControl={
						// 下拉刷新
						<RefreshControl
							title={'Loading'}
							titleColor={THEME_COLOR}
							colors={[ THEME_COLOR ]}
							refreshing={store.isLoading}
							onRefresh={() => this.loadData()}
							titleColor={THEME_COLOR}
						/>
					}
					//上拉刷新
					ListFooterComponent={() => this.genIndicator()}
					//用户滚动道底部
					onEndReached={() => {
						setTimeout(() => {
							if (this.canLoadMore) {
								this.loadData(true);
								this.canLoadMore = false;
							}
						}, 100);
					}}
					//与底部的接触距离比例
					onEndReachedThreshold={0.5}
					onMomentumScrollBegin={() => {
						this.canLoadMore = true; //fix 初始化滚动的时候调用onEndReached的问题
					}}
				/>
				<Toast ref={'toast'} position={'center'} />
			</View>
		);
	}
}

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

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
