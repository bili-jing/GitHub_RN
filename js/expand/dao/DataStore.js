// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Trending from 'GitHubTrending';
export const FLAG_STORAGE = { falg_popular: 'popular', flag_trending: 'trending' };

export default class DataStore {
	/**
     * 获取数据,首先获取本地数据,如果没有本地数据或本地数据过期,则获取网络数据
     * @param {string} url 请求地址
	 * @param {string} flag 标示
     * @returns {Promise}
     */
	fetchData(url, flag) {
		return new Promise((resolve, reject) => {
			this.fetchLoacaldata(url)
				.then((warpData) => {
					//请求到数据并且时间在有效期之内
					if (warpData && DataStore.cheackTimestampValid(warpData.timestamp)) {
						resolve(warpData);
					} else {
						this.fetchNetData(url, flag)
							.then((data) => {
								resolve(this._wrapData(data));
							})
							.catch((err) => {
								reject(err);
							});
					}
				})
				.catch((err) => {
					this.fetchNetData(url, falg)
						.then((data) => {
							resolve(this._wrapData(data));
						})
						.catch((err) => {
							reject(err);
						});
				});
		});
	}

	/**
     * 保存数据
     * @param {strng} url 
     * @param {data} data 数据
     * @param {cb} callback 回调函数
     */
	saveData(url, data, callback) {
		if (!data || !url) {
			return;
		}
		AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
	}

	/**
     * 请求网络数据
     * @param {string} url 请求地址
     * @returns {Promise}
     */
	fetchNetData(url, flag) {
		return new Promise((resolve, reject) => {
			if (flag !== FLAG_STORAGE.flag_trending) {
				fetch(url, flag)
					.then((response) => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('Network response was not ok');
						}
					})
					.then((responseData) => {
						this.saveData(url, responseData);
						resolve(responseData);
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				new Trending()
					.fetchTrending(url)
					.then((items) => {
						if (!items) {
							throw new Error('responseData is null');
						}
						this.saveData(url, items);
						resolve(items);
					})
					.catch((err) => {
						reject(err);
					});
			}
		});
	}

	/**
     * 获取本地数据
     * @param {string} url 请求地址
     * @returns {Promise}
     */
	fetchLoacaldata(url) {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(url, (error, result) => {
				if (!error) {
					try {
						resolve(JSON.parse(result));
					} catch (err) {
						reject(err);
						console.error(err);
					}
				} else {
					reject(error);
					console.error(error);
				}
			});
		});
	}

	/**
     * 获取数据和时间戳
     * @param {any} data 数据
     */
	_wrapData(data) {
		return { data: data, timestamp: new Date().getTime() };
	}

	/**
     * 检查timestamp是否在有效期
     * @param {string} timestamp 项目更新时间
     * @returns {boolean} true 不需要更新 false 需要更新 
     */
	static cheackTimestampValid(timestamp) {
		const currentDate = new Date();
		const targetDate = new Date();
		targetDate.setTime(timestamp);
		if (currentDate.getMonth() !== targetDate.getMonth()) return false;
		if (currentDate.getDate() !== targetDate.getDate()) return false;
		if (currentDate.getHours() - targetDate.getHours() > 4) return false;
		return true;
	}
}
