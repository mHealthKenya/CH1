import axios from "axios";
import * as Types from "./types";
import { configHelper } from "../../helper";
import basePath from "../../utils/basePath";

const authStart = () => {
	return {
		type: Types.START_LOGIN,
	};
};

export const authSuccess = (data) => {
	return {
		type: Types.LOGIN_SUCCESS,
		payload: data,
	};
};

export const authFail = (error) => {
	return {
		type: Types.LOGIN_FAIL,
		payload: error,
	};
};

export const logoutStart = () => {
	return {
		type: Types.START_LOGOUT,
	};
};

export const logoutSuccess = () => {
	return {
		type: Types.LOGOUT_SUCCESS,
	};
};

export const logoutFail = (error) => {
	return {
		type: Types.LOGOUT_FAIL,
		payload: error,
	};
};

export const activeTime = () => {
	return {
		type: Types.ACTIVETIME,
	};
};

export const checkAuthTimeOut = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(userLogout());
		}, expirationTime * 60 * 60 * 8); // !This means that the user will be automatically logged out after the said time
	};
};

export const userLogin = (email, password) => {
	return (dispatch) => {
		dispatch(authStart());
		const loginUrl = `${basePath}auth/api/login/`;
		const body = { email, password };
		axios
			.post(loginUrl, body)
			.then((res) => {
				dispatch(checkAuthTimeOut(1000)); // !This is time in ms
				const { data } = res;
				dispatch(authSuccess(data));
				dispatch(activeTime());
			})
			.catch((err) => {
				const { message } = err;
				dispatch(authFail(message));
			});
	};
};

export const userLogout = () => {
	return (dispatch, getState) => {
		dispatch(logoutStart());
		const logoutUrl = `${basePath}auth/api/logout/`;
		axios
			.post(logoutUrl, null, configHelper(getState))
			.then(() => {
				dispatch(logoutSuccess());
			})
			.catch((err) => {
				const { message } = err;
				dispatch(logoutFail(message));
			});
	};
};
