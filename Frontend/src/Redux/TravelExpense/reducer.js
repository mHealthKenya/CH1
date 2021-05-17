import * as Types from "./types";

const initialState = {
  travelExpense: [],
  travelExpenseError: null,
};
//TES is an acronym for Travel Expense Specific
const travelExpenseSpecific = {
  TES: {},
  TESError: null,
  otherTES: [],
  otherTESError: null,
};

export const travelExpenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_TRAVEL_EXPENSE_REPORT:
      return {
        ...state,
        travelExpense: action.payload,
        travelExpenseError: null,
      };
    case Types.GET_TRAVEL_EXPENSE_REPORT_FAIL:
      return {
        ...state,
        travelExpense: [],
        travelExpenseError: action.payload,
      };
    default:
      return state;
  }
};

export const specificTravelExpenseReducer = (
  state = travelExpenseSpecific,
  action
) => {
  switch (action.type) {
    case Types.SPECIFIC_TRAVEL_EXPENSE_REPORT:
      return {
        ...state,
        TES: action.payload,
        TESError: null,
      };
    case Types.SPECIFIC_TRAVEL_EXPENSE_REPORT_FAIL:
      return {
        ...state,
        TES: {},
        TESError: action.payload,
      };

    case Types.GET_OTHER_TRAVEL_EXPENSE_REPORT:
      return {
        ...state,
        otherTES: action.payload,
        otherTESError: null,
      };

    case Types.GET_OTHER_TRAVEL_EXPENSE_REPORT_FAIL:
      return {
        ...state,
        otherTES: [],
        otherTESError: action.payload,
      };

    default:
      return state;
  }
};
