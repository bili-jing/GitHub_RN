import actionTypes from '../../actions/actionTypes';

const defaultState = {
	theme: 'blue'
};

export default function onAction(state = defaultState, action) {
	switch (action.type) {
		case actionTypes.THEME_CHANGE:
			return {
				...state,
				theme: action.theme
			};

		default:
			return state;
	}
}
