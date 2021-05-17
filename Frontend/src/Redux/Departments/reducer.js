import * as Types from './types';

const initialState = {
	MHKdepartments: [],
	departmentsError: null,
};

const departmentsReducer = (state = initialState, action) => {
	switch (action.type) {
		case Types.GET_DEPARTMENTS:
			return {
				...state,
				MHKdepartments: action.payload,
				departmentsError: null,
			};
		case Types.GET_DEPARTMENTS_FAIL:
			return {
				...state,
				MHKdepartments: [],
				departmentsError: action.payload,
			};

		default:
			return state;
	}
};

export default departmentsReducer;
