import { combineReducers } from 'redux';
import theme from './theme';
import popular from './popular';
import trending from './trending';
import favorite from './favorite';
import { rootCom, RootNavigator } from '../navigator/AppNavigators';

/**
 * 1.指定默认的state
 */
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

/**
 * 2.创建自己的 nanagation reducer
 * @param {} state 数据
 * @param {} action action
 */
const navReducer = (state = navState, action) => {
	const nextState = RootNavigator.router.getStateForAction(action, state);
	//如果nextState 为null或者undefined ,只需要返回原来的state
	return nextState || state;
};

const index = combineReducers({
	nav: navReducer,
	theme: theme,
	popular: popular,
	trending: trending,
	favorite: favorite
});

export default index;
