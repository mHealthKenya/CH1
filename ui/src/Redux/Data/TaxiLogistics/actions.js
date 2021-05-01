import axios from 'axios';
import * as Types from './types';

export const getApprovedTaxiLogistics = (data) => {
	return {
		type: Types.GET_APPROVED_TAXI_LOGISTICS,
		payload: data,
	};
};

export const getPendingTaxiLogistics = (data) => {
	return {
		type: Types.GET_PENDING_TAXI_LOGISTICS,
		payload: data,
	};
};

export const getRejectedTaxiLogistics = (data) => {
	return {
		type: Types.GET_REJECTED_TAXI_LOGISTICS,
		payload: data,
	};
};

export const getTaxiLogisticsData = (id) => {
	return (dispatch) => {
		const url = `http://api-finance-docs.mhealthkenya.co.ke/api/taxilogistics/?staff_booking_taxi=${id}`;
		let rejected = 0;
		let approved = 0;
		let pending = 0;
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				console.log(data);
				if (data.length > 0) {
					data.forEach((info) => {
						if (info.supervisor_approved && !info.supervisor_comment) {
							axios
								.get(
									`http://api-finance-docs.mhealthkenya.co.ke/api/taxilogistics/${info.id}/`
								)
								.then((res) => {
									approved += 1;
									// const { data } = res;
									// const { id } = data;
									// approved.push(id);
									dispatch(getApprovedTaxiLogistics(approved));
									dispatch(getPendingTaxiLogistics(pending));
									dispatch(getRejectedTaxiLogistics(rejected));
									console.log('Approved TL', approved);
								});
						} else if (!info.supervisor_approved && !info.supervisor_comment) {
							axios
								.get(
									`http://api-finance-docs.mhealthkenya.co.ke/api/taxilogistics/${info.id}/`
								)
								.then(() => {
									pending += 1;
									dispatch(getPendingTaxiLogistics(pending));
									dispatch(getApprovedTaxiLogistics(approved));
									dispatch(getRejectedTaxiLogistics(rejected));
									console.log('PendingTL', pending);
								});
						} else if (!info.supervisor_approved && info.supervisor_comment) {
							axios
								.get(
									`http://api-finance-docs.mhealthkenya.co.ke/api/taxilogistics/${info.id}/`
								)
								.then((res) => {
									rejected += 1;
									dispatch(getPendingTaxiLogistics(pending));
									dispatch(getApprovedTaxiLogistics(approved));
									dispatch(getRejectedTaxiLogistics(rejected));
									console.log('Rejected', rejected);
								});
						}
					});
				}
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
};
