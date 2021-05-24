import * as Types from "./types";
import axios from "axios";
import basePath from "../../utils/basePath";
axios.defaults.baseURL = `${basePath}api/`;

const startTaxiLogistics = () => {
	return {
		type: Types.START_TAXI_LOGISTICS,
	};
};

const taxiLogisticsSuccess = (data) => {
	return {
		type: Types.TAXI_LOGISTICS,
		payload: data,
	};
};

const taxiLogisticsFail = (message) => {
	return {
		type: Types.TAXI_LOGISTICS_FAIL,
		payload: message,
	};
};

const taxiSpecificLogisticsSuccess = (data) => {
	return {
		type: Types.GET_SPECIFIC_TAXI_LOGISTIC,
		payload: data,
	};
};

const taxiSpecificLogisticsFail = (message) => {
	return {
		type: Types.GET_SPECIFIC_TAXI_LOGISTIC_FAIL,
		payload: message,
	};
};

const getSupervisorTaxiLogistics = (data) => {
	return {
		type: Types.GET_SUPERVISOR_TAXILOGISTICS,
		payload: data,
	};
};

const getSupervisorTaxiLogisticsFail = (message) => {
	return {
		type: Types.GET_SUPERVISOR_TAXILOGISTICS_FAIL,
		payload: message,
	};
};

export const requestSupervisorTaxiLogistics = (id) => {
	return (dispatch) => {
		const url = `taxilogistics/?supervisor=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getSupervisorTaxiLogistics(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getSupervisorTaxiLogisticsFail(message));
			});
	};
};

export const taxiLogistics = (
	location_from,
	location_to,
	project,
	supervisor,
	staff_booking_taxi
) => {
	return (dispatch) => {
		dispatch(startTaxiLogistics());

		const body = {
			location_from,
			location_to,
			project,
			supervisor,
			staff_booking_taxi,
		};
		const url = "taxilogistics/";

		axios
			.post(url, body)
			.then((res) => {
				const { data } = res;
				dispatch(taxiLogisticsSuccess(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(taxiLogisticsFail(message));
			});
	};
};

export const requestEmployeeTaxiLogistics = (id) => {
	return (dispatch) => {
		const url = `taxilogistics/?staff_booking_taxi=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getSupervisorTaxiLogistics(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getSupervisorTaxiLogisticsFail(message));
			});
	};
};

export const requestSpecificTaxiLogistic = (id) => {
	return (dispatch) => {
		const url = `taxilogistics/${id}/`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(taxiSpecificLogisticsSuccess(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(taxiSpecificLogisticsFail(message));
			});
	};
};
