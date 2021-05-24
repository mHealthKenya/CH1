import axios from "axios";
import * as Types from "./types";
import basePath from "../../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

const startBusinessAdvanceRequest = () => {
	return {
		type: Types.START_BUSINESS_ADVANCE_REQUEST,
	};
};

const businessAdvanceRequest = (data) => {
	return {
		type: Types.BUSINESS_ADVANCE_REQUEST,
		payload: data,
	};
};

const businessAdvanceRequestFail = (message) => {
	return {
		type: Types.BUSINESS_ADVANCE_REQUEST_FAIL,
		payload: message,
	};
};

export const makeBusinessAdvanceRequest = (
	staff,
	amount,
	description,
	account,
	project,
	supervisor
) => {
	return (dispatch) => {
		dispatch(startBusinessAdvanceRequest());
		const body = {
			staff,
			amount,
			description,
			account,
			project,
			supervisor,
		};
		const url = "businessadvancerequest/";
		console.log(url);
		axios
			.post(url, body)
			.then((res) => {
				const { data } = res;
				dispatch(businessAdvanceRequest(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(businessAdvanceRequestFail(message));
			});
	};
};

const getSupervisorBusinessAdvanceRequest = (data) => {
	return {
		type: Types.GET_SUPERVISOR_BUSINESS_ADVANCE_REQUEST,
		payload: data,
	};
};

const getSupervisorBusinessAdvanceRequestFail = (message) => {
	return {
		type: Types.GET_SUPERVISOR_BUSINESS_ADVANCE_REQUEST_FAIL,
		payload: message,
	};
};

export const requestSupervisorBusinessAdvanceRequest = (id) => {
	return (dispatch) => {
		const url = `businessadvancerequest/?supervisor=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getSupervisorBusinessAdvanceRequest(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getSupervisorBusinessAdvanceRequestFail(message));
			});
	};
};

export const requestSpecificBAR = (data) => {
	return {
		type: Types.SPECIFIC_BAR,
		payload: data,
	};
};

export const requestSpecificBARFail = (message) => {
	return {
		type: Types.SPECIFIC_BAR_FAIL,
		payload: message,
	};
};

export const getSpecificBARData = (id) => {
	return (dispatch) => {
		const url = `businessadvancerequest/${id}/`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(requestSpecificBAR(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(requestSpecificBARFail(message));
			});
	};
};

//for this finance function, it uses the same "getSupervisorBusinessAdvanceRequest" reducer
export const BARFinanceApprove = () => {
	return (dispatch) => {
		const url = `businessadvancerequest/?approved=true`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getSupervisorBusinessAdvanceRequest(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getSupervisorBusinessAdvanceRequestFail(message));
			});
	};
};

export const requestEmployeeBusinessAdvanceRequest = (id) => {
	return (dispatch) => {
		const url = `businessadvancerequest/?staff=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getSupervisorBusinessAdvanceRequest(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getSupervisorBusinessAdvanceRequestFail(message));
			});
	};
};

//This functions fetches all business expense reports.
export const requestBusinessExpenseReports = () => {
	return (dispatch) => {
		const url = "businessexpensereport/";
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				console.log(data);
				dispatch(getSupervisorBusinessAdvanceRequest(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getSupervisorBusinessAdvanceRequestFail(message));
			});
	};
};

//This functions fetches a specific Business Expense Report as predifined by it's id.

export const getSpecificBERData = (id) => {
	//BER is an acronym for Business Expense Report
	return (dispatch) => {
		const url = `businessexpensereport/${id}/`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(requestSpecificBAR(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(requestSpecificBARFail(message));
			});
	};
};
