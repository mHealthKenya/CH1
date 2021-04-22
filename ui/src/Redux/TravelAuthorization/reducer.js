import * as Types from "./types";

const TAS = {
  supervisorTravelAuthorization: [],
  supervisorTravelAuthorizationError: null,
};

const specificTA = {
  travelAuthorization: {},
  travelAuthorizationError: null,
  other: [],
  otherError: null,
};

export const specificTravelAuthorization = (state = specificTA, action) => {
  switch (action.type) {
    case Types.GET_SPECIFIC_TRAVEL_AUTHORIZATION:
      return {
        ...state,
        travelAuthorization: action.payload,
        travelAuthorizationError: null,
      };

    case Types.GET_SPECIFIC_TRAVEL_AUTHORIZATION_FAIL:
      return {
        ...state,
        travelAuthorization: {},
        travelAuthorizationError: action.payload,
      };

    case Types.GET_OTHER:
      return {
        ...state,
        other: action.payload,
        otherError: null,
      };

    case Types.GET_OTHER_FAIL:
      return {
        ...state,
        other: [],
        otherError: action.payload,
      };

    default:
      return state;
  }
};

//TAS is an acronym for Travel Authorization Supervisor
export const TASReducer = (state = TAS, action) => {
  switch (action.type) {
    case Types.GET_SUPERVISOR_TRAVEL_AUTHORIZATION:
      return {
        ...state,
        supervisorTravelAuthorization: action.payload,
        supervisorTravelAuthorizationError: null,
      };

    case Types.GET_SUPERVISOR_TRAVEL_AUTHORIZATION_FAIL:
      return {
        ...state,
        supervisorTravelAuthorization: [],
        supervisorTravelAuthorizationError: action.payload,
      };

    default:
      return state;
  }
};
