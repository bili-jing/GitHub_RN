import actionTypes from '../actionTypes';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';

/**
 * 加载收藏的项目	
 * @param {sting} flag 标示
 * @param {boolean} isShowLoading 是否显示loading
 */
export function onLoadFavoriteData(flag, isShowLoading) {
	return (dispatch) => {
		if (isShowLoading) {
			dispatch({
				type: actionTypes.FAVORITE_LOAD_DATA,
				storeName: flag
			});
		}
		new FavoriteDao(flag)
			.getAllItems()
			.then((items) => {
				let resultData = [];
				for (let i = 0, len = items.length; i < len; i++) {
					resultData.push(new ProjectModel(items[i], true));
				}
				dispatch({
					type: actionTypes.FAVORITE_LOAD_SUCCESS,
					projectModels: resultData,
					storeName: flag
				});
			})
			.catch((e) => {
				console.log(e);
				dispatch({
					type: actionTypes.FAVORITE_LOAD_FAIL,
					error: e,
					storeName: flag
				});
			});
	};
}
