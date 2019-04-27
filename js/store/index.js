import { applyMiddleware, createStore ,compose} from 'redux';
import reducers from '../reducer';
import thunk from 'redux-thunk';
import { middleware } from '../navigator/AppNavigators';

//自定义中间件:
const logger = (store) => (next) => (action) => {
	if (typeof action === 'function') {
		console.log('dispatching a function');
	} else {
		console.log('dispacthing', action);
	}
	const result = next(action);
	console.log('nextState', store.getState());
};

const middlewares = [ middleware, logger, thunk ];

/**
 * 创建store
 */

export default createStore(reducers, applyMiddleware(...middlewares));
