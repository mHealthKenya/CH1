import React, { Component } from "react";
import { connect } from "react-redux";
import { requestProjects } from "../Redux/Projects/actions";
import basePath from "../utils/basePath";
import { workingDays } from "../utils/dates";
import axios from "axios";
import { Redirect } from "react-router";

axios.defaults.baseURL = `${basePath}api/`;

export class OffDuty extends Component {
	state = {
		dateto: "",
		types: [],
		datefom: "",
		offduty: [],
		off_duty: "",
		activity: "",
	};

	componentDidMount = () => {
		axios.get("offduty/").then((res) => {
			const { data } = res;
			this.setState({
				...this.state,
				offduty: data,
			});
		});
		axios.get("leavedefinitions/").then((res) => {
			const { data } = res;
			this.setState({
				...this.state,
				types: data,
			});
		});
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
		const { datefrom, dateto, off_duty, activity } = this.state;
		const { auth } = this.props;
		const { id } = auth.user.user;
		workingDays(datefrom, dateto).forEach((element) => {
			axios
				.post("offdutytimesheet/", {
					staff: id,
					date: element,
					description: off_duty,
					activity: activity,
				})
				.then(() => {
					console.log("Test was successful");
				})
				.catch((err) => {
					console.log(err.message);
					console.log({
						element,
					});
				});
		});
	};

	render() {
		const { offduty, datefrom, dateto, types } = this.state;
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className="testbox container mt-3 mb-3">
				{isAuthenticated ? (
					<form>
						<div className="banner">
							<h1>Off Duty Time Sheet</h1>
						</div>
						<div>
							{/* You can set className='colums' to put the forms in rows... */}

							<div className="item">
								<label htmlFor="off_duty">
									{" "}
									Type<span>*</span>
								</label>
								<select name="off_duty" onChange={this.handleChange}>
									<option>Select Type</option>
									{offduty.map((type) => {
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
								<select name="activity" onChange={this.handleChange}>
									<option>Select Activity</option>
									{types.map((type) => {
										return (
											<option key={type.id} value={type.id}>
												{type.leave}
											</option>
										);
									})}
								</select>
							</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OffDuty);
