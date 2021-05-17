import axios from 'axios';
import * as Types from './types';

export const getTravelExpenseApproved = (data) => {
	return {
		type: Types.GET_TRAVEL_EXPENSE_APPROVED,
		payload: data,
	};
};

export const getTravelExpensePending = (data) => {
	return {
		type: Types.GET_TRAVEL_EXPENSE_PENDING,
		payload: data,
	};
};

export const getTravelExpenseApprovedFail = (message) => {
	return {
		type: Types.GET_TRAVEL_EXPENSE_APPROVED_FAIL,
		payload: message,
	};
};

export const getTravelExpensePendingFail = (message) => {
	return {
		type: Types.GET_TRAVEL_EXPENSE_PENDING_FAIL,
		payload: message,
	};
};

export const requestTravelExpenseData = (id) => {
	const url = `http://127.0.0.1:8000/api/travelauthorization/?staff=3`;
	axios.get(url).then((res) => {
		const { data } = res;
		data.forEach((info) => {
			if (info.approved && !info.supervisor_comment) {
				const { request } = info;
				const url = `http://127.0.0.1:8000/api/travelauthorizationsupervisor/?request=${request}`;
				axios.get(url).then((res) => {
					const { data } = res;
					try {
						const { id } = data[0];
						const url = `http://127.0.0.1:8000/api/travelexpensereport/?request=${id}`;
						axios.get(url).then((res) => {
							const { data } = res;
						});
					} catch (err) {
						console.log('Supervisor must approve before you report!');
					}
				});
			}
		});
	});
};
