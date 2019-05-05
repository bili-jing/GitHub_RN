import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtil {
	/**
     * 获取左侧返回按钮
     * @param {function} callBack 回调函数
     */
	static getLeftButton(callBack) {
		return (
			<TouchableOpacity style={{ padding: 8, paddingLeft: 12 }} onPress={callBack}>
				<Ionicons name={'ios-arrow-back'} size={26} style={{ color: 'white' }} />
			</TouchableOpacity>
		);
	}

	/**
	 * 获取分享按钮
	 * @param {function} callBack 回调函数
	 */
	static getShareButton(callBack) {
		return (
			<TouchableOpacity underlayColor={'transparent'} onPress={callBack}>
				<Ionicons name={'md-share'} size={20} style={{ opacity: 0.9, marginRight: 10, color: 'white' }} />
			</TouchableOpacity>
		);
	}

	/**
	 * 获取设置页面的Item
	 * @param {function} callBack 点击item的回调
	 * @param {string} text 显示的文本
	 * @param {string} color 图标颜色
	 * @param {string} Icons react-native-vector-icons组件
	 * @param {string} icon 左侧图标
	 * @param {string} expandableIco 右侧图标
	 */
	static getSettingItem(callBack, text, color, Icons, icon, expandableIco) {
		return (
			<TouchableOpacity onPress={callBack} style={styles.seeting_item_container}>
				<View style={{ alignItems: 'center', flexDirection: 'row' }}>
					{Icons && icon ? (
						<Icons name={icon} size={16} style={{ color: color, marginRight: 10 }} />
					) : (
						<View style={{ opacity: 1, width: 16, height: 16, marginRight: 10 }} />
					)}
					<Text>{text}</Text>
				</View>
				<Ionicons
					name={expandableIco ? expandableIco : 'ios-arrow-forward'}
					size={16}
					style={{ marginRight: 10, alignSelf: 'center', color: color || 'black' }}
				/>
			</TouchableOpacity>
		);
	}

	/**
	 * 获取menu页的item
	 * @param {function} callBack 点击item的回调
	 * @param {any} menu MORE_MENU
	 * @param {string} color 图标的颜色
	 * @param {string} expandableIco 右侧图标
	 */
	static getMenuItem(callBack, menu, color, expandableIco) {
		return ViewUtil.getSettingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIco);
	}
}

const styles = StyleSheet.create({
	seeting_item_container: {
		backgroundColor: 'white',
		padding: 10,
		height: 60,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	}
});
