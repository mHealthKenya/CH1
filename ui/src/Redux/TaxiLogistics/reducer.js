import * as Types from "./types";

const initialState = {
  loading: false,
  logistics: {},
  logisticsError: null,
};

const STL = {
  supervisorLogistics: [],
  supervisorLogisticsError: null,
}; //STL is an acronym for supervisor taxi logistics

const specificTaxiLogistic = {
  logistic: {},
  logisticError: null,
};
// STL is an accronym for Supervisor Taxi Logistics

export const taxiLogisticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.START_TAXI_LOGISTICS:
      return {
        ...state,
        loading: true,
      };
    case Types.TAXI_LOGISTICS:
      return {
        ...state,
        loading: false,
        logistics: action.payload,
        logisticsError: null,
      };
    case Types.TAXI_LOGISTICS_FAIL:
      return {
        ...state,
        loading: false,
        logistics: {},
        logisticsError: action.payload,
      };

    default:
      return state;
  }
};

export const STLReducer = (state = STL, action) => {
  switch (action.type) {
    case Types.GET_SUPERVISOR_TAXILOGISTICS:
      return {
        ...state,
        supervisorLogistics: action.payload,
        supervisorLogisticsError: null,
      };

    case Types.GET_SUPERVISOR_TAXILOGISTICS_FAIL:
      return {
        ...state,
        supervisorLogistics: [],
        supervisorLogisticsError: action.payload,
      };

    default:
      return state;
  }
};

export const specificTaxiLogisticReducer = (
  state = specificTaxiLogistic,
  action
) => {
  switch (action.type) {
    case Types.GET_SPECIFIC_TAXI_LOGISTIC:
      return {
        ...state,
        logistic: action.payload,
        logisticError: null,
      };

    case Types.GET_SPECIFIC_TAXI_LOGISTIC_FAIL:
      return {
        ...state,
        logistic: {},
        logisticError: action.payload,
      };

    default:
      return state;
  }
};
