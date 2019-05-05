import actionTypes from '../../actions/actionTypes';
const defaultState = {};

/**
 * 0.state树,横向扩展
 * 1.动态设置store,动态获取store(storekey不固定)
 * 节点数据结构设计:
 * favorite:{
 *  popular:{
 *      projectModels:[],
 *      isLoading:false    
 *   },
 * trending:{
 *      projectModels:[],
 *      isLoading:false    
 *   }
 * }
 * @param {state} state 老数据
 * @param {objct} action 处理方法
 */
export default function onAction(state = defaultState, action) {
	switch (action.type) {
		case actionTypes.FAVORITE_LOAD_DATA: //获取数据
			return {
				...state,
				[action.storeName]: {
					...state[action.storeName],
					isLoading: true
				}
			};
		case actionTypes.FAVORITE_LOAD_SUCCESS: //下拉获取数据成功
			return {
				...state,
				[action.storeName]: {
					...state[action.storeName],
					projectModels: action.projectModels, //此次要展示的数据
					isLoading: false
				}
			};
		case actionTypes.FAVORITE_LOAD_FAIL: //下拉刷新失败
			return {
				...state,
				[action.storeName]: {
					...state[action.storeName],
					isLoading: false
				}
			};
		default:
			return state;
	}
}
