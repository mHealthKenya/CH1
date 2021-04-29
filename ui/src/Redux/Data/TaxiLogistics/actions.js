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
		const url = `http://127.0.0.1:8000/api/taxilogistics/?staff_booking_taxi=${id}`;
		const rejected = [];
		const approved = [];
		const pending = [];
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				console.log(data);
				data.forEach((info) => {
					if (info.supervisor_approved && !info.supervisor_comment) {
						approved.push(info.id);
						dispatch(getApprovedTaxiLogistics(approved.length));
					} else if (!info.supervisor_approved && !info.supervisor_comment) {
						pending.push(info.id);
						dispatch(getPendingTaxiLogistics(pending.length));
					} else if (!info.supervisor_approved && info.supervisor_comment) {
						rejected.push(info.id);
						dispatch(getRejectedTaxiLogistics(rejected.length));
					}
				});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
};
