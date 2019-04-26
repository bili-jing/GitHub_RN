import actionTypes from '../actionTypes';

export function onThemeChange(theme) {
	return {
		type: actionTypes.THEME_CHANGE,
		theme: theme
	};
}
