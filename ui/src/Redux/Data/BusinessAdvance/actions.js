import axios from 'axios';
import * as Types from './types';

export const getApprovedBusinessAdvance = (data) => {
	return {
		type: Types.GET_APPROVED_BUSINESS_ADVANCE_REQUEST,
		payload: data,
	};
};

export const getPendingBusinessAdvance = (data) => {
	return {
		type: Types.GET_PENDING_BUSINESS_ADVANCE_REQUEST,
		payload: data,
	};
};

export const getRejectedBusinessAdvance = (data) => {
	return {
		type: Types.GET_REJECTED_BUSINESS_ADVANCE_REQUEST,
		payload: data,
	};
};

export const requestBusinessAdvanceData = (id) => {
	return (dispatch) => {
		const url = `http://api-finance-docs.mhealthkenya.co.ke/api/businessadvancerequest/?staff=${id}`;
		let rejected = 0;
		let approved = 0;
		let pending = 0;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				console.log('Test');
				data.forEach((info) => {
					if (info.finance_reviewed && !info.finance_comment) {
						const url = `http://api-finance-docs.mhealthkenya.co.ke/api/businessadvancerequest/${info.id}/`;
						axios.get(url).then(() => {
							approved += 1;
							dispatch(getApprovedBusinessAdvance(approved));
							dispatch(getPendingBusinessAdvance(pending));
							dispatch(getRejectedBusinessAdvance(rejected));
						});
					} else if (info.finance_comment && !info.finance_reviewed) {
						const url = `http://api-finance-docs.mhealthkenya.co.ke/api/businessadvancerequest/${info.id}/`;
						axios.get(url).then(() => {
							rejected += 1;
							dispatch(getApprovedBusinessAdvance(approved));
							dispatch(getPendingBusinessAdvance(pending));
							dispatch(getRejectedBusinessAdvance(rejected));
						});
					} else if (!info.finance_comment && !info.finance_reviewed) {
						const url = `http://api-finance-docs.mhealthkenya.co.ke/api/businessadvancerequest/${info.id}/`;
						axios.get(url).then(() => {
							pending += 1;
							dispatch(getApprovedBusinessAdvance(approved));
							dispatch(getPendingBusinessAdvance(pending));
							dispatch(getRejectedBusinessAdvance(rejected));
						});
					}
				});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
};
