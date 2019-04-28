import actionTypes from '../../actions/actionTypes';
const defaultState = {};

/**
 * 0.state树,横向扩展
 * 1.动态设置store,动态获取store(storekey不固定)
 * 节点数据结构设计:
 * popular:{
 *  java:{
 *      items:[],
 *      isLoading:false    
 *   },
 * ios:{
 *      items:[],
 *      isLoading:false    
 *   }
 * }
 * @param {state} state 老数据
 * @param {objct} action 处理方法
 */
export default function onAction(state = defaultState, action) {
	switch (action.type) {
		case actionTypes.POPULAR_REFRESH_SUCCESS: //下拉刷新成功
			return {
				...state,
				[action.storeName]: {
					...state[action.storeName],
					items: action.items, //原始数据
					projectModes: action.projectModes, //此次要展示的数据
					isLoading: false,
					hideLoadingMore: false,
					pageIndex: action.pageIndex
				}
			};
		case actionTypes.POPULAR_REFRESH: //下拉刷新
			return {
				...state,
				[action.storeName]: {
					...state[action.storeName],
					isLoading: false,
					hideLoadingMore: true,
				}
			};
		case actionTypes.POPULAR_REFRESH_FAIL: //下拉刷新失败
			return {
				...state,
				[action.storeName]: {
					...state[action.storeName],
					isLoading: true
				}
			};
		case actionTypes.POPULAR_LOAD_MORE_SUCCESS: //上拉加载更多成功
			return {
				...state,
				[action.storeName]: {
					...state[action.storeName],
					projectModes: action.projectModes,
					hideLoadingMore: false,
					pageIndex: action.pageIndex
				}
			};
		case actionTypes.POPULAR_LOAD_MORE_FAIL: //上拉加载更多失败
			return {
				...state,
				[action.storeName]: {
					...state[action.storeName],
					hideLoadingMore: true,
					pageIndex: action.pageIndex
				}
			};
		default:
			return state;
	}
}
