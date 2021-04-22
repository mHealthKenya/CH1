import * as Types from "./types";

const initialState = {
  MHKprojects: [],
  projectsError: null,
};

const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_PROJECTS:
      return {
        ...state,
        MHKprojects: action.payload,
        projectsError: null,
      };
    case Types.GET_PROJECTS_FAIL:
      return {
        ...state,
        MHKprojects: [],
        projectsError: action.payload,
      };

    default:
      return state;
  }
};

export default projectsReducer;
