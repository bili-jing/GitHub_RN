import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, StyleSheet, View, FlatList, RefreshControl, Text } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import actions from '../actions';
import PopularItem from '../common/PopularItem';

const THEME_COLOR = 'red';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'; //点赞数的排序
const pageSize = 10;

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

const mapStateToProps = (state) => ({
	popular: state.popular
});

const mapDispatchToProps = (dispatch) => ({
	onLoadPopularData: (storeName, url, pagaSize) => dispatch(actions.onLoadPopularData(storeName, url, pagaSize)),
	onLoadMorePopular: (storeName, pageIndex, pageSize, items, callback) =>
		dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callback))
});

class PopularTab extends Component {
	constructor(props) {
		super(props);
		const { tabLabel } = this.props;
		this.storeName = tabLabel;
	}

	componentDidMount() {
		this.loadData();
	}

	loadData(loadMore) {
		const { onLoadPopularData, onLoadMorePopular } = this.props;
		const store = this._store();
		const url = this.genFetchUrl(this.storeName);
		if (loadMore) {
			onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, (callback) => {
				this.refs.toast.show('没有更多了');
			});
		} else {
			onLoadPopularData(this.storeName, url, pageSize);
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
				projectModes: [], //要显示的数据,
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
		return <PopularItem item={item} onSelect={() => {}} />;
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
					data={store.projectModes}
					renderItem={(data) => this.renderItem(data)}
					keyExtractor={(item) => '' + item.id}
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
	},
	indicatorContainer: {
		alignItems: 'center'
	},
	indicator: {
		color: 'red',
		margin: 10
	}
});
