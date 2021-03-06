import * as Types from "./types";
import axios from "axios";
import basePath from "../../../utils/basePath";

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
		const url = `${basePath}api/purchaserequisition/?requested_by=${id}`;
		let rejected = 0;
		let approved = 0;
		let pending = 0;
		axios.get(url).then((res) => {
			const { data } = res;
			data.forEach((info) => {
				if (info.ceo_approved && !info.ceo_comments) {
					const url = `${basePath}api/purchaserequisition/${info.id}`;
					axios.get(url).then(() => {
						approved += 1;
						dispatch(getApprovedPurchaseRequests(approved));
						dispatch(getRejectedPurchaseRequests(rejected));
						dispatch(getPendingPurchaseRequests(pending));
					});
				} else if (
					(info.ceo_comments && !info.ceo_approved) ||
					info.supervisor_comments ||
					info.finance_comments
				) {
					const url = `${basePath}api/purchaserequisition/${info.id}`;
					axios.get(url).then(() => {
						rejected += 1;
						dispatch(getApprovedPurchaseRequests(approved));
						dispatch(getRejectedPurchaseRequests(rejected));
						dispatch(getPendingPurchaseRequests(pending));
					});
				} else if (!info.ceo_comments && !info.ceo_approved) {
					const url = `${basePath}api/purchaserequisition/${info.id}`;
					axios.get(url).then(() => {
						pending += 1;
						dispatch(getApprovedPurchaseRequests(approved));
						dispatch(getRejectedPurchaseRequests(rejected));
						dispatch(getPendingPurchaseRequests(pending));
					});
				}
			});
		});
	};
};
