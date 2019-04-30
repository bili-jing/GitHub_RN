import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, WebView, DeviceInfo } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

export default class DetailPage extends Component {
	constructor(props) {
		super(props);
		this.params = this.props.navigation.state.params;
		const { projectModel } = this.params;
		this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName;
		const title = projectModel.full_name || projectModel.fullName;
		this.state = {
			title: title,
			url: this.url,
			canGoBack: false
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
	renderRightButton() {
		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity onPress={() => {}}>
					<FontAwesome name={'star-o'} size={20} style={{ color: 'white', marginRight: 10 }} />
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
