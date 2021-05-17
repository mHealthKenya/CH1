import * as Types from './types';

const initialState = {
	accountCodes: [],
	accountCodesError: null,
};

const supervisorsState = {
	supervisors: [],
	supervisorsError: null,
};

const supervisorState = {
	supervisor: [],
	supervisorError: null,
};

const financeStaffState = {
	financeStaff: [],
	financeStaffError: null,
};

const CEOState = {
	CEO: [],
	CEOError: null,
};

export const CEOReducer = (state = CEOState, action) => {
	switch (action.type) {
		case Types.GET_CEO:
			return {
				CEO: action.payload,
				CEOError: null,
			};
		case Types.GET_CEO_FAIL:
			return {
				CEO: [],
				CEOError: action.payload,
			};
		default:
			return state;
	}
};

export const financeStaffReducer = (state = financeStaffState, action) => {
	switch (action.type) {
		case Types.GET_FINANCE_STAFF:
			return {
				...state,
				financeStaff: action.payload,
				financeStaffError: null,
			};
		case Types.GET_FINANCE_STAFF_FAIL:
			return {
				...state,
				financeStaff: [],
				financeStaffError: action.payload,
			};

		default:
			return state;
	}
};
export const accountCodesReducer = (state = initialState, action) => {
	switch (action.type) {
		case Types.GET_ACCOUNT_CODES:
			return {
				...state,
				accountCodes: action.payload,
				accountCodesError: null,
			};
		case Types.GET_ACCOUNT_CODES_FAIL:
			return {
				...state,
				accountCodes: [],
				accountCodesError: action.payload,
			};

		default:
			return state;
	}
};

export const supervisorsReducer = (state = supervisorsState, action) => {
	switch (action.type) {
		case Types.GET_SUPERVISORS:
			return {
				...state,
				supervisors: action.payload,
				supervisorsError: null,
			};
		case Types.GET_SUPERVISORS_FAIL:
			return {
				...state,
				supervisors: [],
				supervisorsError: action.payload,
			};

		default:
			return state;
	}
};

export const supervisorReducer = (state = supervisorState, action) => {
	switch (action.type) {
		case Types.GET_SUPERVISOR:
			return {
				...state,
				supervisor: action.payload,
				supervisorError: null,
			};
		case Types.GET_SUPERVISOR_FAIL:
			return {
				...state,
				supervisor: [],
				supervisorError: action.payload,
			};

		default:
			return state;
	}
};
