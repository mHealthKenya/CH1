import * as Types from "./types";

const initialState = {
	user: {},
	error: null,
	isAuthenticated: false,
	loading: false,
	loadingLogout: false,
	errorLogout: null,
	activeTime: 0,
};

export const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case Types.START_LOGIN:
			return {
				...state,
				loading: true,
			};
		case Types.LOGIN_SUCCESS:
			return {
				...state,
				loading: false,
				user: action.payload,
				error: null,
				isAuthenticated: true,
			};
		case Types.LOGIN_FAIL:
			return {
				...state,
				loading: false,
				user: {},
				error: action.payload,
				isAuthenticated: false,
			};
		case Types.START_LOGOUT:
			return {
				...state,
				loadingLogout: true,
			};

		case Types.LOGOUT_SUCCESS:
			return {
				...state,
				user: {},
				error: null,
				isAuthenticated: false,
				loading: false,
				loadingLogout: false,
				errorLogout: null,
			};

		case Types.LOGOUT_FAIL:
			return {
				...state,
				user: {},
				error: null,
				isAuthenticated: false,
				loading: false,
				loadingLogout: false,
				errorLogout: action.payload,
			};

		case Types.ACTIVETIME:
			return {
				...state,
				activeTime: new Date().getTime() + 8 * 60 * 60 * 1000,
			};

		default:
			return state;
	}
};

export default authReducer;
