import * as Types from './types';

const initialState = {
	approvedTL: 0,
	pendingTL: 0,
	rejectedTL: 0,
};

export const statsTL = (state = initialState, action) => {
	switch (action.type) {
		case Types.GET_APPROVED_TAXI_LOGISTICS:
			return {
				...state,
				approvedTL: action.payload,
			};

		case Types.GET_PENDING_TAXI_LOGISTICS:
			return {
				...state,
				pendingTL: action.payload,
			};

		case Types.GET_REJECTED_TAXI_LOGISTICS:
			return {
				...state,
				rejectedTL: action.payload,
			};
		default:
			return state;
	}
};
