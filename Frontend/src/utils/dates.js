export const workingDays = (dateFrom, dateTo) => {
	let weekdays = [];
	let weekends = [];
	let diff = (new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24);
	for (let i = 0; i < diff + 1; i += 1) {
		const firstDay = new Date(dateFrom);
		const lastDay = new Date(firstDay);
		lastDay.setDate(lastDay.getDate() + i);
		if (lastDay.getDay() === 0 || lastDay.getDay() === 6) {
			weekends.push(lastDay);
		} else {
			weekdays.push(lastDay);
		}
	}
	return weekdays;
};
