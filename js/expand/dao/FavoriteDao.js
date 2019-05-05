import { AsyncStorage } from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
	constructor(flag) {
		this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
	}

	/**
     * 收藏项目,保存收藏的项目
     * @param {string} key 项目的id
     * @param {any} value 收藏的项目
     * @param {function} callback 回调
     */
	saveFavoriteItem(key, value, callback) {
		AsyncStorage.setItem(key, value, (error, result) => {
			if (!error) {
				this.updateFavoriteKeys(key, true);
			}
		});
	}

	/**
     * 更新Favorite Key 集合
     * @param {string} key 项目id
     * @param {boolean} isAdd true 添加,flase 删除
     */
	updateFavoriteKeys(key, isAdd) {
		AsyncStorage.getItem(this.favoriteKey, (error, result) => {
			if (!error) {
				let favoriteKeys = [];
				if (result) {
					favoriteKeys = JSON.parse(result);
				}
				let index = favoriteKeys.indexOf(key);
				if (isAdd) {
					if (index === -1) {
						//如果是添加且key不存在则添加到数组中
						favoriteKeys.push(key);
					}
				} else {
					if (index !== -1) {
						//如果是删除且key已经存在,则删除
						favoriteKeys.splice(index, 1);
					}
				}
				//将更新后的key集合保存到本地
				AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
			}
		});
	}

	/**
     * 获取收藏的项目对应的key
     */
	getFavoriteKeys() {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(this.favoriteKey, (err, result) => {
				if (!err) {
					try {
						resolve(JSON.parse(result));
					} catch (e) {
						reject(e);
					}
				} else {
					reject(err);
				}
			});
		});
	}

	/**
     * 取消收藏,移除已经收藏的项目
     * @param {string} key 项目id
     */
	removeFavoriteItem(key) {
		AsyncStorage.removeItem(key, (err, result) => {
			if (!err) {
				this.updateFavoriteKeys(key, false);
			}
		});
	}

	/**
     * 获取所有的收藏项目
     * @returns {Promise}
     */
	getAllItems() {
		return new Promise((resolve, reject) => {
			this.getFavoriteKeys()
				.then((keys) => {
					let items = [];
					if (keys) {
						AsyncStorage.multiGet(keys, (err, stores) => {
							try {
								stores.map((result, i, store) => {
									let key = store[i][0];
									let value = store[i][1];
									if (value) items.push(JSON.parse(value));
								});
								resolve(items);
							} catch (error) {
								reject(error);
							}
						});
					} else {
						resolve(items);
					}
				})
				.catch((e) => {
					reject(e);
				});
		});
	}
}
