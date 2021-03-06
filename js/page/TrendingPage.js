import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	ActivityIndicator,
	StyleSheet,
	View,
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	DeviceEventEmitter
} from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import { DeviceInfo } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EventBus from 'react-native-event-bus';

import actions from '../actions';
import NavigationBar from '../common/NavigationBar';
import TrendingItem from '../common/TrendingItem';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog';
import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteUtil from '../util/FavoriteUtil';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteDao from '../expand/dao/FavoriteDao';
import EventTypes from '../util/EventTypes';

const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const THEME_COLOR = '#678';
const URL = 'https://github.com/trending/';
const pageSize = 10;
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

export default class TrendingPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeSpan: TimeSpans[0]
		};
		this.tabNames = [ 'All', 'Java', 'Android', 'Python', 'Go', 'JavaScript', 'C++', 'IOS' ];
	}

	_genTab() {
		const tabs = {};
		this.tabNames.forEach((item, index) => {
			tabs[`tab${index}`] = {
				screen: (props) => <TrendingTabPage timeSpan={this.state.timeSpan} {...props} tabLabel={item} />,
				navigationOptions: {
					title: item
				}
			};
		});
		return tabs;
	}
	rendertitleView() {
		return (
			<View>
				<TouchableOpacity underlayColor="transparent" onPress={() => this.dialog.show()}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text
							style={{
								fontSize: 18,
								color: '#FFFFFF',
								fontWeight: '400'
							}}
						>
							趋势 {this.state.timeSpan.showText}
						</Text>
						<MaterialIcons name={'arrow-drop-down'} size={22} style={{ color: 'white' }} />
					</View>
				</TouchableOpacity>
			</View>
		);
	}
	onSelectTimeSpan(tab) {
		this.dialog.dismiss();
		this.setState({
			timeSpan: tab
		});
		DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
	}
	renderTrendingDialog() {
		return (
			<TrendingDialog ref={(dialog) => (this.dialog = dialog)} onSelect={(tab) => this.onSelectTimeSpan(tab)} />
		);
	}
	_tabNav() {
		if (!this.tabNav) {
			//优化效率：根据需要选择是否重新创建建TabNavigator，通常tab改变后才重新创建
			this.tabNav = createAppContainer(
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
		}
		return this.tabNav;
	}
	render() {
		let statusBar = {
			backgroundColor: THEME_COLOR,
			barStyle: 'light-content'
		};
		let navigationBar = (
			<NavigationBar
				titleView={this.rendertitleView()}
				statusBar={statusBar}
				style={{ backgroundColor: THEME_COLOR }}
			/>
		);
		const TabNavigator = this._tabNav();
		return (
			<View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
				{navigationBar}
				<TabNavigator />
				{this.renderTrendingDialog()}
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	trending: state.trending
});

const mapDispatchToProps = (dispatch) => ({
	onLoadTrendingData: (storeName, url, pagaSize, favoriteDao) =>
		dispatch(actions.onLoadTrendingData(storeName, url, pagaSize, favoriteDao)),
	onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callback) =>
		dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
	onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) =>
		dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});

class TrendingTab extends Component {
	constructor(props) {
		super(props);
		const { tabLabel, timeSpan } = this.props;
		this.storeName = tabLabel;
		this.timeSpan = timeSpan;
		this.isFavoriteChanged = false;
	}

	componentDidMount() {
		this.loadData();
		this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
			this.timeSpan = timeSpan;
			this.loadData();
		});
		EventBus.getInstance().addListener(
			EventTypes.favorite_change_trending,
			(this.favoriteChangeListener = () => {
				this.isFavoriteChanged = true;
			})
		);
		EventBus.getInstance().addListener(
			EventTypes.bottom_tab_select,
			(this.bottomTabSelectListener = (data) => {
				if (data.to === 1 && this.isFavoriteChanged) {
					this.loadData(null, true);
				}
			})
		);
	}

	componentWillUnmount() {
		if (this.timeSpanChangeListener) {
			this.timeSpanChangeListener.remove();
		}
		EventBus.getInstance().removeListener(this.favoriteChangeListener);
		EventBus.getInstance().removeListener(this.bottomTabSelectListener);
	}

	loadData(loadMore, refreshFavorite) {
		const { onLoadMoreTrending, onLoadTrendingData, onFlushTrendingFavorite } = this.props;
		const store = this._store();
		const url = this.genFetchUrl(this.storeName);
		if (loadMore) {
			onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (callback) => {
				this.refs.toast.show('没有更多了');
			});
		} else if (refreshFavorite) {
			onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
			this.isFavoriteChanged = false;
		} else {
			onLoadTrendingData(this.storeName, url, pageSize, favoriteDao);
		}
	}

	/**
	 * 获取与当前页面有关的数据
	 */
	_store() {
		const { trending } = this.props;
		let store = trending[this.storeName];
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
		return URL + key + '?' + this.timeSpan.searchText;
	}

	renderItem(data) {
		const item = data.item;
		return (
			<TrendingItem
				projectModel={item}
				onSelect={(callback) => {
					NavigationUtil.goPage(
						{ projectModel: item, flag: FLAG_STORAGE.flag_trending, callback },
						'DetailPage'
					);
				}}
				onFavorite={(item, isFavorite) =>
					FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
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
							onRefresh={() => this.loadData()}
							titleColor={THEME_COLOR}
						/>
					}
					//上拉加载更多
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

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

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
