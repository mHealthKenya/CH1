import * as Types from './types';

const initialState = {
	approvedTA: 0,
	pendingTA: 0,
	rejectedTA: 0,
};

export const statsTA = (state = initialState, action) => {
	switch (action.type) {
		case Types.APPROVED_TRAVEL_AUTHORIZATIONS:
			return {
				...state,
				approvedTA: action.payload,
			};

		case Types.PENDING_TRAVEL_AUTHORIZATIONS:
			return {
				...state,
				pendingTA: action.payload,
			};

		case Types.REJECTED_TRAVEL_AUTHORIZATIONS:
			return {
				...state,
				rejectedTA: action.payload,
			};
		default:
			return state;
	}
};
