import axios from "axios";
import * as Types from "./types";
import basePath from "../../utils/basePath";
axios.defaults.baseURL = `${basePath}api/`;

const getLogo = (data) => {
	return {
		type: Types.GET_LOGO,
		payload: data,
	};
};

const getLogoFail = (mesage) => {
	return {
		type: Types.GET_LOGO_FAIL,
		payload: mesage,
	};
};

export const requestLogo = () => {
	return (dispatch) => {
		const url = "mhealthimages/?imagename=mhealthlogo";
		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				const { image } = data[0];
				console.log(image);
				dispatch(getLogo(image));
			})
			.catch((err) => {
				const { message } = err;
				dispatch(getLogoFail(message));
			});
	};
};
