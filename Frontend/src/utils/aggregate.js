import basePath from "../utils/basePath";
import axios from "axios";
axios.defaults.baseURL = `${basePath}api/`;

export const aggregateHoursT = (id, year, month) => {
	let hours = 0;
	axios.get(`monthlytimesheet/?staff=${id}`).then((res) => {
		const { data } = res;
		data.forEach((element) => {
			if (element.year === year && element.month === month) {
				hours += element.hours;
			}
		});
		return hours;
	});
};
