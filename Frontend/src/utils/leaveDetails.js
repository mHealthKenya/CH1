import axios from "axios";
import basePath from "./basePath";

axios.defaults.baseURL = `${basePath}api/`;

let annual = [];
export const getAnnualLeave = (ID, year) => {
	const url = `leavedefinitions/?leave=Annual`;
	axios
		.get(url)
		.then((res) => {
			const { data } = res;
			const { id } = data[0];
			const url = `leaveapplications/?staff=${ID}&year=${year}&leave=${id}`;
			axios.get(url).then((res) => {
				const { data } = res;
				data.forEach((info) => {
					annual.push(info.duration);
				});
			});
		})
		.catch((err) => {
			const { message } = err;
			return message;
		});
	return annual;
};

export const sum = (data) => {
	return data.reduce((a, b) => a + b, 0);
};
