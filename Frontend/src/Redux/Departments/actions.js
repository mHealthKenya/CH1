import * as Types from "./types";
import axios from "axios";
import basePath from "../../utils/basePath";
axios.defaults.baseURL = `${basePath}api/`;

export const getDepartments = (data) => {
	return {
		type: Types.GET_DEPARTMENTS,
		payload: data,
	};
};

export const getDepartmentsFail = (error) => {
	return {
		type: Types.GET_DEPARTMENTS_FAIL,
		payload: error,
	};
};

export const requestDepartments = () => {
	return (dispatch) => {
		const url = "departments/";
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				dispatch(getDepartments(data));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getDepartmentsFail(message));
			});
	};
};
