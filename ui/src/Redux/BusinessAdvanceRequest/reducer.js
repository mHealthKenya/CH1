import * as Types from "./types";

const initialState = {
  loading: false,
  BAR: {}, //BAR is an acronym for Business Advance Request
  BARError: null,
};

const SBAR = {
  sBAR: [],
  sBARError: null,
}; //SBAR is an acronym for Supervisor Business Advance Request

const specificBARRequest = {
  specificBAR: {},
  specificBARError: null,
};

export const specificBARRequestReducer = (
  state = specificBARRequest,
  action
) => {
  switch (action.type) {
    case Types.SPECIFIC_BAR:
      return {
        ...state,
        specificBAR: action.payload,
        specificBARError: null,
      };
    case Types.SPECIFIC_BAR_FAIL:
      return {
        ...state,
        specificBAR: {},
        specificBARError: action.payload,
      };

    default:
      return state;
  }
};

export const BARReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.START_BUSINESS_ADVANCE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case Types.BUSINESS_ADVANCE_REQUEST:
      return {
        ...state,
        loading: false,
        BAR: action.payload,
        BARError: null,
      };
    case Types.BUSINESS_ADVANCE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        BAR: {},
        BARError: action.payload,
      };

    default:
      return state;
  }
};

export const SBARReducer = (state = SBAR, action) => {
  switch (action.type) {
    case Types.GET_SUPERVISOR_BUSINESS_ADVANCE_REQUEST:
      return {
        ...state,
        sBAR: action.payload,
        sBARError: null,
      };

    case Types.GET_SUPERVISOR_BUSINESS_ADVANCE_REQUEST_FAIL:
      return {
        ...state,
        sBAR: [],
        sBARError: action.payload,
      };

    default:
      return state;
  }
};
