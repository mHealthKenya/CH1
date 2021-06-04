import React, { Component } from "react";
import { connect } from "react-redux";
import { requestProjects } from "../Redux/Projects/actions";
import basePath from "../utils/basePath";
import { workingDays, workingHours, firstDate, lastDate } from "../utils/dates";
import { aggregateHoursT } from "../utils/aggregate";
import axios from "axios";
import { Redirect } from "react-router";

axios.defaults.baseURL = `${basePath}api/`;

export class NonProjectTimeSheet extends Component {
	state = {
		dateto: "",
		datefom: "",
		nonproject: [],
		off_duty: "",
		activity: "",
		hours: "",
	};

	componentDidMount = () => {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			axios.get("nonproject/").then((res) => {
				const { data } = res;
				this.setState({
					...this.state,
					nonproject: data,
				});
			});
		}
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			...this.state,
			[name]: value,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { datefrom, dateto, activities, hours, description } = this.state;
		const year = new Date(datefrom).getFullYear().toString();
		const month = new Date(datefrom).toLocaleString("default", {
			month: "long",
		});

		workingHours(firstDate(datefrom), lastDate(dateto));

		const { auth } = this.props;
		const { id } = auth.user.user;
		console.log(aggregateHoursT(id, year, month));
		let testHours = 0;
		workingDays(datefrom, dateto).forEach((element) => {
			testHours += parseInt(hours);
			axios
				.post("nonprojecttimesheet/", {
					staff: id,
					date: element,
					description: description,
					activities: activities,
					hours: hours,
				})
				.then(() => {
					console.log("Test was successful");
				})
				.catch((err) => {
					console.log(err.message);
					console.log({
						element,
						description,
					});
				});
		});
		// console.log(
		// 	workingHours(firstDate(datefrom), lastDate(dateto)) -
		// 		parseInt(aggregateHoursT(id, year, month))
		// );
	};

	render() {
		const { nonproject, datefrom, dateto, hours } = this.state;
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className="testbox container mt-3 mb-3">
				{isAuthenticated ? (
					<form>
						<div className="banner">
							<h1>Non Project Time Sheet</h1>
						</div>
						<div>
							{/* You can set className='colums' to put the forms in rows... */}

							<div className="item">
								<label htmlFor="off_duty">
									{" "}
									Description<span>*</span>
								</label>
								<select name="description" onChange={this.handleChange}>
									<option>Select Type</option>
									{nonproject.map((type) => {
										return (
											<option key={type.id} value={type.id}>
												{type.name}
											</option>
										);
									})}
								</select>
							</div>

							<div className="item">
								<label htmlFor="activities">
									{" "}
									Activities<span>*</span>
								</label>
								<textarea
									id="activities"
									type="text"
									rows={5}
									name="activities"
									required
									onChange={this.handleChange}
								/>
							</div>
						</div>

						<div className="item">
							<label htmlFor="hours">
								{" "}
								Hours spent<span>*</span>
							</label>
							<input
								id="hours"
								type="number"
								name="hours"
								value={hours}
								required
								onChange={this.handleChange}
							/>
						</div>

						<div className="item">
							<label htmlFor="datefrom">
								{" "}
								From<span>*</span>
							</label>
							<input
								id="datefrom"
								type="date"
								name="datefrom"
								value={datefrom}
								onChange={this.handleChange}
								required
							/>
						</div>
						<div className="item">
							<label htmlFor="dateto">
								{" "}
								To<span>*</span>
							</label>
							<input
								id="dateto"
								type="date"
								name="dateto"
								value={dateto}
								onChange={this.handleChange}
								required
							/>
						</div>
						<div>
							<div className="btn-block">
								<button onClick={this.handleSubmit}>Submit</button>{" "}
							</div>
						</div>
					</form>
				) : (
					<Redirect to="/auth/login" />
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		projects: state.projects,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestProjects: () => dispatch(requestProjects()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NonProjectTimeSheet);
