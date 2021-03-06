import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, WebView, DeviceInfo } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';
import FavoriteDao from '../expand/dao/FavoriteDao';

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

export default class DetailPage extends Component {
	constructor(props) {
		super(props);
		this.params = this.props.navigation.state.params;
		const { projectModel, flag } = this.params;
		console.log('this.params', this.params);
		console.log('flag', flag);
		this.favoriteDao = new FavoriteDao(flag);
		this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
		const title = projectModel.item.full_name || projectModel.item.fullName;
		this.state = {
			title: title,
			url: this.url,
			canGoBack: false,
			isFavorite: projectModel.isFavorite
		};
		this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() });
	}

	componentDidMount() {
		this.backPress.componentDidMount();
	}

	componentWillUnmount() {
		this.backPress.componentWillUnmount();
	}

	onBackPress() {
		this.onBack();
		return true;
	}

	onBack() {
		if (this.state.canGoBack) {
			this.webview.goBack;
		} else {
			NavigationUtil.goBack(this.props);
		}
	}
	onFavoriteButtonClick() {
		const { projectModel, callback } = this.params;
		const isFavorite = (projectModel.isFavorite = !projectModel.isFavorite);
		callback(isFavorite); //更新收藏状态
		this.setState({
			isFavorite: isFavorite
		});
		let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
		if (projectModel.isFavorite) {
			this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
		} else {
			this.favoriteDao.removeFavoriteItem(key);
		}
	}
	renderRightButton() {
		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity onPress={() => this.onFavoriteButtonClick()}>
					<FontAwesome
						name={this.state.isFavorite ? 'star' : 'star-o'}
						size={20}
						style={{ color: 'white', marginRight: 10 }}
					/>
				</TouchableOpacity>
				{ViewUtil.getShareButton(() => {})}
			</View>
		);
	}

	onNavigationStateChange(navState) {
		this.setState({
			canGoBack: navState.canGoBack,
			url: navState.url
		});
	}
	render() {
		const titleLayoutStyle = this.state.title.length > 20 ? { paddingRight: 30 } : null;
		let navigationBar = (
			<NavigationBar
				titleLayoutStyle={titleLayoutStyle}
				leftButton={ViewUtil.getLeftButton(() => this.onBack())}
				title={this.state.title}
				style={{ backgroundColor: THEME_COLOR }}
				rightButton={this.renderRightButton()}
			/>
		);
		return (
			<View style={styles.container}>
				{navigationBar}
				<WebView
					ref={(webview) => (this.webview = webview)}
					startInLoadingState={true} //加载的小菊花
					onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
					source={{ uri: this.state.url }}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
	}
});
