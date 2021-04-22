import * as Types from "./types";

const logoState = {
  logo: [],
  logoError: null,
};

export const logoReducer = (state = logoState, action) => {
  switch (action.type) {
    case Types.GET_LOGO:
      return {
        ...state,
        logo: action.payload,
        logoError: null,
      };

    case Types.GET_LOGO_FAIL:
      return {
        ...state,
        logo: [],
        logoError: action.payload,
      };

    default:
      return state;
  }
};
