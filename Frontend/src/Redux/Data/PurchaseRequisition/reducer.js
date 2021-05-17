import * as Types from './types';

const initialState = {
	approvedPR: 0,
	pendingPR: 0,
	rejectedPR: 0,
};

export const statsPR = (state = initialState, action) => {
	switch (action.type) {
		case Types.GET_APPROVED_PURCHASE_REQUESTS:
			return {
				...state,
				approvedPR: action.payload,
			};

		case Types.GET_PENDING_PURCHASE_REQUESTS:
			return {
				...state,
				pendingPR: action.payload,
			};

		case Types.GET_REJECTED_PURCHASE_REQUESTS:
			return {
				...state,
				rejectedPR: action.payload,
			};
		default:
			return state;
	}
};
