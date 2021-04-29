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
		const rejected = [];
		const approved = [];
		const pending = [];
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				data.forEach((info) => {
					if (info.finance_reviewed && !info.finance_comment) {
						approved.push(info.id);
						dispatch(getApprovedBusinessAdvance(approved.length));
					} else if (info.finance_comment && !info.finance_reviewed) {
						rejected.push(info.id);
						dispatch(getRejectedBusinessAdvance(rejected.length));
					} else if (!info.finance_comment && !info.finance_reviewed) {
						pending.push(info.id);
						dispatch(getPendingBusinessAdvance(pending.length));
					}
				});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
};
