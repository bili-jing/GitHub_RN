import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, View, Button, TouchableOpacity, DeviceInfo } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import actions from '../actions';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil';
import { MORE_MENU } from '../common/MORE_MENU';
import GlobalStyle from '../res/styles/GlobalStyle';
import ViewUtil from '../util/ViewUtil';

const THEME_COLOR = '#678';
class MyPage extends Component {
	onClick(menu) {
		let RouteName,
			params = {};
		switch (menu) {
			case MORE_MENU.Tutorial:
				RouteName = 'WebViewPage';
				params.title = '教程';
				params.url = 'https://blog.lyyideng.com/';
				break;
			case MORE_MENU.About:
				RouteName = 'AboutPage';
				break;
			case MORE_MENU.About_Author:
				RouteName = 'AboutMePage';
				break;
		}
		if (RouteName) {
			NavigationUtil.goPage(params, RouteName);
		}
	}
	getItem(menu) {
		return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
	}
	render() {
		let statusBar = {
			backgroundColor: THEME_COLOR,
			barStyle: 'light-content'
		};
		let navigationBar = (
			<NavigationBar title={'我的'} statusBar={statusBar} style={{ backgroundColor: THEME_COLOR }} />
		);
		return (
			<View style={styles.container}>
				{navigationBar}
				<ScrollView>
					<TouchableOpacity style={styles.item} onPress={() => this.onClick(MORE_MENU.About)}>
						<View style={styles.about_left}>
							<Ionicons
								name={MORE_MENU.About.icon}
								size={40}
								style={{ marginRight: 10, color: THEME_COLOR }}
							/>
							<Text>Github Pupular</Text>
						</View>
					</TouchableOpacity>
					<View style={GlobalStyle.line} />
					{this.getItem(MORE_MENU.Tutorial)}
					{/* 趋势管理 */}
					<Text style={styles.groupTitle}>趋势管理</Text>
					{/* 自定义语言 */}
					{this.getItem(MORE_MENU.Custom_Language)}
					{/* 语言排序 */}
					<View style={GlobalStyle.line} />
					{this.getItem(MORE_MENU.Sort_Language)}
					{/* 最热管理 */}
					<Text style={styles.groupTitle}>最热管理</Text>
					{/* 自定义标签 */}
					{this.getItem(MORE_MENU.Custom_Key)}
					{/* 标签排序 */}
					<View style={GlobalStyle.line} />
					{this.getItem(MORE_MENU.Sort_Key)}
					{/* 标签移除 */}
					<View style={GlobalStyle.line} />
					{this.getItem(MORE_MENU.Remove_Key)}

					{/* 设置 */}
					<Text style={styles.groupTitle}>设置</Text>
					{/* 自定义主题 */}
					{this.getItem(MORE_MENU.Custom_Theme)}
					{/* 关于作者 */}
					<View style={GlobalStyle.line} />
					{this.getItem(MORE_MENU.About_Author)}
					<View style={GlobalStyle.line} />
					{/* 反馈 */}
					{this.getItem(MORE_MENU.Feedback)}
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
	onThemeChange: (theme) => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);

const marginTop = DeviceInfo.isIPhoneX_deprecated ? 30 : 0;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'pink',
		marginTop: marginTop
	},
	home: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	},
	about_left: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	item: {
		backgroundColor: 'white',
		padding: 10,
		height: 60,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	groupTitle: {
		marginLeft: 10,
		marginTop: 10,
		marginBottom: 12,
		fontSize: 12,
		color: 'gray'
	}
});
