import * as Types from './types';

const initialState = {
	loading: false,
	purchaseRequistion: {},
	purchaseRequistionError: null,
};

const supervisorPurchaseRequest = {
	purchaseRequests: [],
	purchaseRequestsError: null,
};

const specificPurchaseRequest = {
	purchaseRequest: {},
	purchaseRequestError: null,
};

export const supervisorPurchaseRequestReducer = (
	state = supervisorPurchaseRequest,
	action
) => {
	switch (action.type) {
		case Types.PURCHASE_REQUEST_DATA:
			return {
				...state,
				purchaseRequests: action.payload,
				purchaseRequestsError: null,
			};
		case Types.PURCHASE_REQUEST_DATA_FAIL:
			return {
				...state,
				purchaseRequests: [],
				purchaseRequestsError: action.payload,
			};

		default:
			return state;
	}
};

const purchaseRequisitionReducer = (state = initialState, action) => {
	switch (action.type) {
		case Types.PURCHASE_REQUEST:
			return {
				...state,
				loading: false,
				purchaseRequistion: action.payload,
				purchaseRequistionError: null,
			};
		case Types.PURCHASE_REQUEST_FAIL:
			return {
				...state,
				loading: false,
				purchaseRequistion: {},
				purchaseRequistionError: action.payload,
			};

		default:
			return state;
	}
};

export const specificPurchaseRequestReducer = (
	state = specificPurchaseRequest,
	action
) => {
	switch (action.type) {
		case Types.SPECIFIC_PURCHASE_REQUEST:
			return {
				...state,
				purchaseRequest: action.payload,
				purchaseRequestError: null,
			};
		case Types.SPECIFIC_PURCHASE_REQUEST_FAIL:
			return {
				...state,
				purchaseRequest: {},
				purchaseRequestError: action.payload,
			};

		default:
			return state;
	}
};

export default purchaseRequisitionReducer;
