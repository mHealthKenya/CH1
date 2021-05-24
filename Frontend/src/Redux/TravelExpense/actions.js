import * as Types from "./types";
import axios from "axios";
import basePath from "../../utils/basePath";
axios.defaults.baseURL = `${basePath}api/`;

export const getTravelExpense = (data) => {
	return {
		type: Types.GET_TRAVEL_EXPENSE_REPORT,
		payload: data,
	};
};

export const getTravelExpenseFail = (error) => {
	return {
		type: Types.GET_TRAVEL_EXPENSE_REPORT_FAIL,
		payload: error,
	};
};

export const requestSpecificTravelExpense = (data) => {
	return {
		type: Types.SPECIFIC_TRAVEL_EXPENSE_REPORT,
		payload: data,
	};
};

export const requestSpecificTravelExpenseFail = (message) => {
	return {
		type: Types.SPECIFIC_TRAVEL_EXPENSE_REPORT_FAIL,
		payload: message,
	};
};

export const otherTravelExpenses = (data) => {
	return {
		type: Types.GET_OTHER_TRAVEL_EXPENSE_REPORT,
		payload: data,
	};
};

export const otherTravelExpensesFail = (message) => {
	return {
		type: Types.GET_OTHER_TRAVEL_EXPENSE_REPORT_FAIL,
		payload: message,
	};
};

export const requestTravelExpense = () => {
	return (dispatch) => {
		const url = "travelexpensereport/";
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getTravelExpense(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getTravelExpenseFail(message));
			});
	};
};

export const getSpecificTravelExpenseData = (id) => {
	return (dispatch) => {
		const url = `travelexpensereport/${id}/`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(requestSpecificTravelExpense(data));
				const { request } = data;
				const url = `travelauthorizationsupervisor/${request}/`;
				axios.get(url).then((res) => {
					const { data } = res;
					const { request } = data;
					const url = `travelauthorization/${request}/`;
					axios.get(url).then((res) => {
						const { data } = res;
						const { id } = data;
						const url = `other/?request=${id}`;
						axios.get(url).then((res) => {
							try {
								const { data } = res;
								dispatch(otherTravelExpenses(data));
							} catch (err) {
								const { message } = err;
								dispatch(otherTravelExpensesFail(message));
							}
						});
					});
				});
			})
			.catch((err) => {
				const { message } = err;
				dispatch(requestSpecificTravelExpenseFail(message));
			});
	};
};
