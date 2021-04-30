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
		console.log(url);
		const rejected = [];
		const approved = [];
		const pending = [];
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
									const { data } = res;
									const { id } = data;
									approved.push(id);
									dispatch(getApprovedTaxiLogistics(approved.length));
									console.log(approved.length);
								});
						} else if (!info.supervisor_approved && !info.supervisor_comment) {
							axios
								.get(
									`http://api-finance-docs.mhealthkenya.co.ke/api/taxilogistics/${info.id}/`
								)
								.then((res) => {
									const { data } = res;
									const { id } = data;
									pending.push(id);
									dispatch(getPendingTaxiLogistics(pending.length));
									console.log(pending.length);
								});
						} else if (!info.supervisor_approved && info.supervisor_comment) {
							axios
								.get(
									`http://api-finance-docs.mhealthkenya.co.ke/api/taxilogistics/${info.id}/`
								)
								.then((res) => {
									const { data } = res;
									const { id } = data;
									rejected.push(id);
									dispatch(getRejectedTaxiLogistics(rejected.length));
									console.log('Rejected', rejected.length);
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
