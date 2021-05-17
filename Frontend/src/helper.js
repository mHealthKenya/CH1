export const configHelper = (getState) => {
	const { token } = getState().auth.user;
	let config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	if (token) {
		config.headers['Authorization'] = `Token ${token}`;
	}

	return config;
};
