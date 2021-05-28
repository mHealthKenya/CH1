import axios from "axios";
import basePath from "./basePath";

axios.defaults.baseURL = `${basePath}api/`;
let leaveRequests = [];

export const getSupervisorLeave = (id) => {
	axios.get(`leaveapplications/?supervisor=${id}`).then((res) => {
		const { data } = res;
		leaveRequests.push(data);
		return leaveRequests[0];
	});
};
