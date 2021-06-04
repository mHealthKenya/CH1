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

export const firstDate = (date) => {
	let firstDay = new Date(
		new Date(date).getFullYear(),
		new Date(date).getMonth(),
		1
	);
	return firstDay;
};

export const lastDate = (date) => {
	let lastDay = new Date(
		new Date(date).getFullYear(),
		new Date(date).getMonth() + 1,
		0
	);
	return lastDay;
};

export const workingHours = (dayOne, dayN) => {
	let days = workingDays(firstDate(dayOne), lastDate(dayN));
	return days.length * 8;
};
