import actionTypes from '../actionTypes';
import DataStore from '../../expand/dao/DataStore';

/**
 * 获取最热数据的异步action
 * @param {string} storeName 顶部导航的哪一个数据
 * @param {string} url 请求地址
 * @param {number} pageSize 每页显示多少数据
 * @returns {function(*=)}
 */
export function onLoadPopularData(storeName, url, pageSize) {
	return (dispatch) => {
		dispatch({
			type: actionTypes.POPULAR_REFRESH,
			storeName
		});
		let dataStore = new DataStore();
		dataStore
			.fetchData(url) //异步action与数据流
			.then((data) => {
				handleData(dispatch, storeName, data, pageSize);
			})
			.catch((err) => {
				console.log(err);
				dispatch({
					type: actionTypes.POPULAR_REFRESH_FAIL,
					storeName,
					err
				});
			});
	};
}

/**
 * 加载更多
 * @param {string} storeName 分类的信息
 * @param {number} pageIndex 当前页数
 * @param {number} pageSize 每页显示多少数据
 * @param {array} dataArray 数据数组
 * @param {function} callback 回调
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callback) {
	return (dispatch) => {
		setTimeout(() => {
			//模拟网络请求
			if ((pageIndex - 1) * pageSize >= dataArray.length) {
				//已经加载全部数据
				if (typeof callback === 'function') {
					callback('no more');
				}
				dispatch({
					type: actionTypes.POPULAR_LOAD_MORE_FAIL,
					error: 'no more',
					storeName,
					pageIndex: --pageIndex,
					projectModes: dataArray
				});
			} else {
				//本次和载入的最大数量:
				let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
				dispatch({
					type: actionTypes.POPULAR_LOAD_MORE_SUCCESS,
					storeName,
					pageIndex,
					projectModes: dataArray.slice(0, max)
				});
			}
		}, 500);
	};
}

/**
 * 
 * @param {*} dispatch 
 * @param {string} storeName 
 * @param {} data
 * @param {} pageSize 
 */
function handleData(dispatch, storeName, data, pageSize) {
	let fixItems = [];
	if (data && data.data && data.data.items) {
		fixItems = data.data.items;
	}
	dispatch({
		type: actionTypes.POPULAR_REFRESH_SUCCESS,
		items: fixItems,
		projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),
		storeName,
		pageIndex: 1
	});
}
