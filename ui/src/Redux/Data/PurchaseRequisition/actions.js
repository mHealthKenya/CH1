import * as Types from './types';
import axios from 'axios';

export const getApprovedPurchaseRequests = (data) => {
	return {
		type: Types.GET_APPROVED_PURCHASE_REQUESTS,
		payload: data,
	};
};

export const getPendingPurchaseRequests = (data) => {
	return {
		type: Types.GET_PENDING_PURCHASE_REQUESTS,
		payload: data,
	};
};

export const getRejectedPurchaseRequests = (data) => {
	return {
		type: Types.GET_REJECTED_PURCHASE_REQUESTS,
		payload: data,
	};
};

export const getPurchaseRequisitionData = (id) => {
	return (dispatch) => {
		const url = `http://api-finance-docs.mhealthkenya.co.ke/api/purchaserequisition/?requested_by=${id}`;
		const rejected = [];
		const approved = [];
		const pending = [];
		axios.get(url).then((res) => {
			const { data } = res;
			data.forEach((info) => {
				if (info.ceo_approved && !info.ceo_comments) {
					approved.push(info.id);
					dispatch(getApprovedPurchaseRequests(approved.length));
				} else if (info.ceo_comments && !info.ceo_approved) {
					rejected.push(info.id);
					dispatch(getRejectedPurchaseRequests(rejected.length));
				} else if (!info.ceo_comments && !info.ceo_approved) {
					pending.push(info.id);
					dispatch(getPendingPurchaseRequests(pending.length));
				}
			});
		});
	};
};
