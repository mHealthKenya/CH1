import * as Types from './types';

const initialState = {
	test: null,
};

export const testReducer = (state = initialState, action) => {
	switch (action.type) {
		case Types.TEST_ONE:
			return {
				...state,
				test: 'successfull',
			};

		default:
			return state;
	}
};

export default testReducer;
