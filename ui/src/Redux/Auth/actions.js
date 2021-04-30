import axios from 'axios';
import * as Types from './types';
import { configHelper } from '../../helper';

// axios.defaults.baseURL = 'http://api-finance-docs.mhealthkenya.co.ke/';

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

export const userLogin = (email, password) => {
	return (dispatch) => {
		dispatch(authStart());
		const loginUrl =
			'http://api-finance-docs.mhealthkenya.co.ke/auth/api/login/';
		const body = { email, password };
		axios
			.post(loginUrl, body)
			.then((res) => {
				const { data } = res;
				dispatch(authSuccess(data));
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
		const logoutUrl =
			'http://api-finance-docs.mhealthkenya.co.ke/auth/api/logout/';
		axios
			.post(logoutUrl, null, configHelper(getState))
			.then(() => {
				dispatch(logoutSuccess());
				window.localStorage.clear();
			})
			.catch((err) => {
				const { message } = err;
				dispatch(logoutFail(message));
				window.localStorage.clear();
			});
	};
};
