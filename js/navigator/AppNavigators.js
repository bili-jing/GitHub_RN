import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createReactNavigationReduxMiddleware, createReduxContainer } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';

import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WebViewPage from '../page/WebViewPage';
import AboutPage from '../page/about/AboutPage';
import AboutMePage from '../page/about/AboutMePage';

export const rootCom = 'Init'; //设置根路由

const InitNavigator = createStackNavigator({
	WelcomePage: {
		screen: WelcomePage,
		navigationOptions: {
			header: null //可以通过将header设为null,来禁用StackNavigator的Navigation Bar
		}
	}
});

const MainNavigator = createStackNavigator({
	HomePage: {
		screen: HomePage,
		navigationOptions: {
			header: null
		}
	},
	DetailPage: {
		screen: DetailPage,
		navigationOptions: {
			header: null
		}
	},
	WebViewPage: {
		screen: WebViewPage,
		navigationOptions: {
			header: null
		}
	},
	AboutPage: {
		screen: AboutPage,
		navigationOptions: {
			header: null
		}
	},
	AboutMePage: {
		screen: AboutMePage,
		navigationOptions: {
			header: null
		}
	}
});

export const RootNavigator = createAppContainer(
	createSwitchNavigator(
		{
			Init: InitNavigator,
			Main: MainNavigator
		},
		{
			navigationOptions: {
				header: null // 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
			}
		}
	)
);
/**
 * 1.初始化react-navigation与redux的中间件，
 * 该方法的一个很大的作用就是为createReduxContainer的key设置actionSubscribers(行为订阅者)
 * 设置订阅者@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L29
 * 检测订阅者是否存在@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L97
 * @type {Middleware}
 */
export const middleware = createReactNavigationReduxMiddleware((state) => state.nav, 'root');

/**
 * 2.将根导航器组件传递给 reduxifyNavigator 函数,
 * 并返回一个将navigation state 和 dispatch 函数作为 props的新组件；
 * 注意：要在createReactNavigationReduxMiddleware之后执行
 */
const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

/**
 * State到Props的映射关系
 * @param state
 */

const mapStateToProps = (state) => ({
	state: state.nav
});

/**
 * 3.链接 React 组件与 React Store
 */

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export default AppNavigator;
