import * as Types from "./types";
import axios from "axios";
import basePath from "../../utils/basePath";
axios.defaults.baseURL = `${basePath}api/`;

export const getAccountCodes = (data) => {
	return {
		type: Types.GET_ACCOUNT_CODES,
		payload: data,
	};
};

export const getAccountCodesFail = (message) => {
	return {
		type: Types.GET_ACCOUNT_CODES_FAIL,
		payload: message,
	};
};

export const getSupervisors = (data) => {
	return {
		type: Types.GET_SUPERVISORS,
		payload: data,
	};
};

export const getSupervisorsFail = (message) => {
	return {
		type: Types.GET_SUPERVISORS_FAIL,
		payload: message,
	};
};

export const getSupervisor = (data) => {
	return {
		type: Types.GET_SUPERVISOR,
		payload: data,
	};
};

export const getSupervisorFail = (message) => {
	return {
		type: Types.GET_SUPERVISOR_FAIL,
		payload: message,
	};
};

export const getFinanceStaff = (data) => {
	return {
		type: Types.GET_FINANCE_STAFF,
		payload: data,
	};
};

export const getFinanceStaffFail = (message) => {
	return {
		type: Types.GET_FINANCE_STAFF_FAIL,
		payload: message,
	};
};

export const getCEO = (data) => {
	return {
		type: Types.GET_CEO,
		payload: data,
	};
};

export const getCEOFail = (message) => {
	return {
		type: Types.GET_CEO_FAIL,
		payload: message,
	};
};

export const requestCEO = () => {
	return (dispatch) => {
		const url = "ceo/";
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getCEO(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getCEOFail(message));
			});
	};
};

export const requestFinanceStaff = (id) => {
	return (dispatch) => {
		const url = `financestaff/?staff=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getFinanceStaff(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getFinanceStaffFail(message));
			});
	};
};

export const requestAccountCodes = () => {
	return (dispatch) => {
		const url = "accountcodes/";
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getAccountCodes(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getAccountCodesFail(message));
			});
	};
};

export const requestSupervisors = () => {
	return (dispatch) => {
		const url = "supervisors/";
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getSupervisors(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getSupervisorsFail(message));
			});
	};
};

export const requestSupervisor = (id) => {
	return (dispatch) => {
		const url = `supervisors/?name=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				console.log(data);
				dispatch(getSupervisor(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getSupervisorFail(message));
			});
	};
};
