import * as Types from './types';
import axios from 'axios';

axios.defaults.baseURL = 'http://api-finance-docs.mhealthkenya.co.ke/api/';

const getTravelAuthorizationSupervisor = (data) => {
	return {
		type: Types.GET_SUPERVISOR_TRAVEL_AUTHORIZATION,
		payload: data,
	};
};

const getTravelAuthorizationSupervisorFail = (message) => {
	return {
		type: Types.GET_SUPERVISOR_TRAVEL_AUTHORIZATION_FAIL,
		payload: message,
	};
};

const travelAuthorizationSuccess = (data) => {
	return {
		type: Types.GET_SPECIFIC_TRAVEL_AUTHORIZATION,
		payload: data,
	};
};

const travelAuthorizationFail = (message) => {
	return {
		type: Types.GET_SPECIFIC_TRAVEL_AUTHORIZATION_FAIL,
		payload: message,
	};
};

const getOther = (data) => {
	return {
		type: Types.GET_OTHER,
		payload: data,
	};
};

const getOtherFail = (message) => {
	return {
		type: Types.GET_OTHER_FAIL,
		payload: message,
	};
};

const getApprovedTravelAuthorizations = (data) => {
	return {
		type: Types.GET_SUPERVISOR_TRAVEL_AUTHORIZATION,
		payload: data,
	};
};

const getApprovedTravelAuthorizationsFail = (message) => {
	return {
		type: Types.GET_SUPERVISOR_TRAVEL_AUTHORIZATION_FAIL,
		payload: message,
	};
};

export const requestApprovedTravelAuthorizations = () => {
	return (dispatch) => {
		const url = 'travelauthorization/?approved=true';
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getApprovedTravelAuthorizations(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getApprovedTravelAuthorizationsFail(message));
			});
	};
};

export const requestSpecificTravelAuthorization = (id) => {
	return (dispatch) => {
		const url = `travelauthorization/${id}/`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(travelAuthorizationSuccess(data));
				const { id } = data;
				const url = `other/?request=${id}`;
				axios
					.get(url)
					.then((res) => {
						const { data } = res;
						dispatch(getOther(data));
					})
					.catch((err) => {
						const { message } = err;
						dispatch(getOtherFail(message));
					});
			})
			.catch((err) => {
				const { message } = err;
				dispatch(travelAuthorizationFail(message));
			});
	};
};

export const requestSupervisorTravelAuthorization = (id) => {
	return (dispatch) => {
		const url = `travelauthorization/?supervisor=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getTravelAuthorizationSupervisor(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getTravelAuthorizationSupervisorFail(message));
			});
	};
};

export const requestEmployeeTravelAuthorization = (id) => {
	return (dispatch) => {
		const url = `travelauthorization/?staff=${id}`;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getTravelAuthorizationSupervisor(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getTravelAuthorizationSupervisorFail(message));
			});
	};
};
