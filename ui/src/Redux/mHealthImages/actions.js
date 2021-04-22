import axios from "axios";
import * as Types from "./types";
axios.defaults.baseURL = "http://api-finance-docs.mhealthkenya.co.ke/api/";

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
        dispatch(getLogo(data));
      })
      .catch((err) => {
        const { message } = err;
        dispatch(getLogoFail(message));
      });
  };
};
