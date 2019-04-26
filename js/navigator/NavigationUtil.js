// 全局导航跳转工具

export default class NavigationUtil {
	/**
	 * 返回上一页
	 * @param {navigation} param0 
	 */
	static goBack({ navigation }) {
		navigation.goBack();
	}

	/**
	 * 返回到主页
	 * @param {params} params navigation
	 */
	static resetToHomePage(params) {
		const { navigation } = params;
		navigation.navigate('Main');
	}

	/**
	 * 跳转到指定页面
	 * @param {params} params 要传递的参数
	 * @param {page} page 要跳转的页面
	 */
	static goPage(params, page) {
		const navigation = NavigationUtil.navigation;
		console.log('NavigationUtil.navigation', NavigationUtil.navigation);
		if (!navigation) {
			console.warn('NavigationUtil.navigation is not be null');
		}
		navigation.navigate(page, {
			...params
		});
	}
}
