import * as Types from './types';

const initialState = {
	approvedBA: 0,
	pendingBA: 0,
	rejectedBA: 0,
};

export const statsBA = (state = initialState, action) => {
	switch (action.type) {
		case Types.GET_APPROVED_BUSINESS_ADVANCE_REQUEST:
			return {
				...state,
				approvedBA: action.payload,
			};

		case Types.GET_PENDING_BUSINESS_ADVANCE_REQUEST:
			return {
				...state,
				pendingBA: action.payload,
			};

		case Types.GET_REJECTED_BUSINESS_ADVANCE_REQUEST:
			return {
				...state,
				rejectedBA: action.payload,
			};
		default:
			return state;
	}
};
