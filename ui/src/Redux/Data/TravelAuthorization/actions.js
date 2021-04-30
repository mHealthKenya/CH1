import axios from 'axios';
import * as Types from './types';

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
		const rejected = [];
		const approved = [];
		const pending = [];
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				data.forEach((info) => {
					if (info.supervisor_comment) {
						const url = `http://api-finance-docs.mhealthkenya.co.ke/api/travelauthorization/${info.id}/`;
						axios.get(url).then((res) => {
							const { data } = res;
							const { id } = data;
							rejected.push(id);
							dispatch(getRejectedTravelAuthorization(rejected.length));
							console.log('RejectedTA', rejected.length);
						});
					} else if (!info.supervisor_comment && info.approved) {
						const url = `http://api-finance-docs.mhealthkenya.co.ke/api/travelauthorization/${info.id}/`;
						axios.get(url).then((res) => {
							const { data } = res;
							const { id } = data;
							approved.push(id);
							dispatch(getApprovedTravelAuthorization(approved.length));
							console.log('ApprovedTA', approved.length);
						});
					} else if (!info.approved && !info.supervisor_comment) {
						const url = `http://api-finance-docs.mhealthkenya.co.ke/api/travelauthorization/${info.id}/`;
						axios.get(url).then((res) => {
							const { data } = res;
							const { id } = data;
							pending.push(id);
							dispatch(getPendingTravelAuthorization(pending.length));
							console.log('PendingTA', pending.length);
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
