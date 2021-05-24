import axios from "axios";
import * as Types from "./types";
import basePath from "../../utils/basePath";
axios.defaults.baseURL = `${basePath}api/`;

export const requestPurchase = (data) => {
	return {
		type: Types.PURCHASE_REQUEST,
		payload: data,
	};
};

export const requestPurchaseFail = (message) => {
	return {
		type: Types.PURCHASE_REQUEST_FAIL,
		payload: message,
	};
};

export const requestSpecificPurchase = (data) => {
	return {
		type: Types.SPECIFIC_PURCHASE_REQUEST,
		payload: data,
	};
};

export const requestSpecificPurchaseFail = (message) => {
	return {
		type: Types.SPECIFIC_PURCHASE_REQUEST_FAIL,
		payload: message,
	};
};

export const requestPurchaseData = (data) => {
	return {
		type: Types.PURCHASE_REQUEST_DATA,
		payload: data,
	};
};

export const requestPurchaseDataFail = (message) => {
	return {
		type: Types.PURCHASE_REQUEST_DATA_FAIL,
		payload: message,
	};
};

export const makePurchaseRequest = (
	activity,
	description,
	amount,
	account_code,
	reviewing_supervisor,
	requested_by
) => {
	return (dispatch) => {
		const body = {
			activity,
			description,
			amount,
			account_code,
			reviewing_supervisor,
			requested_by,
		};
		const url = "purchaserequisition/";
		axios
			.post(url, body)
			.then((res) => {
				const { data } = res;
				dispatch(requestPurchase(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(requestPurchaseFail(message));
			});
	};
};

export const getPurchaseData = (id) => {
	return (dispatch) => {
		const url = `purchaserequisition/?reviewing_supervisor=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(requestPurchaseData(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(requestPurchaseDataFail(message));
			});
	};
};

export const getSpecificPurchaseData = (id) => {
	return (dispatch) => {
		const url = `purchaserequisition/${id}/`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(requestSpecificPurchase(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(requestSpecificPurchaseFail(message));
			});
	};
};

export const supervisorApprove = (id) => {
	const url = `purchaserequisition/${id}/`;
	const body = {
		supervisor_approved: true,
		date_supervisor_review: new Date(),
	};
	axios
		.patch(url, body)
		.then((res) => {
			console.log(res.data);
		})
		.catch((err) => {
			console.log(err.message);
		});
};

export const financeApprove = () => {
	return (dispatch) => {
		const url = `purchaserequisition/?supervisor_approved=true`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(requestPurchaseData(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(requestPurchaseDataFail(message));
			});
	};
};

export const CEOApprove = () => {
	return (dispatch) => {
		const url = `purchaserequisition/?supervisor_approved=true&finance_approved=true&ceo_approved=false`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(requestPurchaseData(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(requestPurchaseDataFail(message));
			});
	};
};

export const getEmployeePurchaseData = (id) => {
	return (dispatch) => {
		const url = `purchaserequisition/?requested_by=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(requestPurchaseData(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(requestPurchaseDataFail(message));
			});
	};
};
