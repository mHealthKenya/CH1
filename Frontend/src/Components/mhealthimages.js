import React, { Component } from "react";
import axios from "axios";

import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

export class mhealthimages extends Component {
	componentDidMount = () => {
		const url = "mhealthimages/?imagename=mhealthlogo";
		axios.get(url).then((res) => {
			const { data } = res;
			this.setState({
				...this.state,
				image: data,
			});
		});
	};
	render() {
		return (
			<div>
				<h1>Test</h1>
			</div>
		);
	}
}

export default mhealthimages;
