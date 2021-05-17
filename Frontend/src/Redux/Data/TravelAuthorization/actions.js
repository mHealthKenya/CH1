import axios from "axios";
import * as Types from "./types";

export const getApprovedTravelAuthorization = (data) => {
	return {
		type: Types.APPROVED_TRAVEL_AUTHORIZATIONS,
		payload: data,
	};
};

export const getPendingTravelAuthorization = (data) => {
	return {
		type: Types.PENDING_TRAVEL_AUTHORIZATIONS,
		payload: data,
	};
};

export const getRejectedTravelAuthorization = (data) => {
	return {
		type: Types.REJECTED_TRAVEL_AUTHORIZATIONS,
		payload: data,
	};
};

export const getApprovedTravelAuthorizationFail = (error) => {
	return {
		type: Types.APPROVED_TRAVEL_AUTHORIZATIONS_FAIL,
		payload: error,
	};
};

export const getPendingTravelAuthorizationFail = (error) => {
	return {
		type: Types.PENDING_TRAVEL_AUTHORIZATIONS_FAIL,
		payload: error,
	};
};

export const getRejectedTravelAuthorizationFail = (error) => {
	return {
		type: Types.REJECTED_TRAVEL_AUTHORIZATIONS_FAIL,
		payload: error,
	};
};

export const requestTravelAuthorizationData = (id) => {
	return (dispatch) => {
		const url = `http://api-finance-docs.mhealthkenya.co.ke/api/travelauthorization/?staff=${id}`;
		let rejected = 0;
		let approved = 0;
		let pending = 0;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				data.forEach((info) => {
					if (info.supervisor_comment) {
						const url = `http://api-finance-docs.mhealthkenya.co.ke/api/travelauthorization/${info.id}/`;
						axios.get(url).then(() => {
							rejected += 1;
							dispatch(getApprovedTravelAuthorization(approved));
							dispatch(getPendingTravelAuthorization(pending));
							dispatch(getRejectedTravelAuthorization(rejected));
						});
					} else if (!info.supervisor_comment && info.approved) {
						const url = `http://api-finance-docs.mhealthkenya.co.ke/api/travelauthorization/${info.id}/`;
						axios.get(url).then(() => {
							approved += 1;
							dispatch(getApprovedTravelAuthorization(approved));
							dispatch(getPendingTravelAuthorization(pending));
							dispatch(getRejectedTravelAuthorization(rejected));
						});
					} else if (!info.approved && !info.supervisor_comment) {
						const url = `http://api-finance-docs.mhealthkenya.co.ke/api/travelauthorization/${info.id}/`;
						axios.get(url).then(() => {
							pending += 1;
							dispatch(getApprovedTravelAuthorization(approved));
							dispatch(getPendingTravelAuthorization(pending));
							dispatch(getRejectedTravelAuthorization(rejected));
						});
					}
				});
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getApprovedTravelAuthorizationFail(message));
			});
	};
};
