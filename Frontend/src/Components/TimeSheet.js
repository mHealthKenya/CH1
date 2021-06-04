import React, { Component } from "react";
import basePath from "../utils/basePath";
import axios from "axios";
import { connect } from "react-redux";
import { requestProjects } from "../Redux/Projects/actions";
import { workingDays } from "../utils/dates";
import { Redirect } from "react-router";

axios.defaults.baseURL = `${basePath}api/`;

export class TimeSheet extends Component {
	state = {
		grants: [],
		grant: "",
		hours: 0,
		dateto: "",
		datefrom: "",
		acrivities: "",
	};

	componentDidMount = () => {
		this.props.requestProjects();
		axios.get("grant/").then((res) => {
			const { data } = res;
			this.setState({
				...this.state,
				grants: data,
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
		const { datefrom, dateto, grant, project, activities, hours } = this.state;
		const { auth } = this.props;
		const { id } = auth.user.user;
		workingDays(datefrom, dateto).forEach((element) => {
			axios
				.post("monthlytimesheet/", {
					staff: id,
					date: element,
					hours: hours,
					grant: grant,
					activities: activities,
					project: project,
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
		const { grants, hours, datefrom, dateto } = this.state;
		const { projects, auth } = this.props;
		const { isAuthenticated } = auth;
		const { MHKprojects } = projects;
		return (
			<div className="testbox container mt-3 mb-3">
				{isAuthenticated ? (
					<form>
						<div className="banner">
							<h1>Time Sheet</h1>
						</div>
						<div>
							{/* You can set className='colums' to put the forms in rows... */}
							<div className="item">
								<label htmlFor="amount">
									{" "}
									Grant<span>*</span>
								</label>
								<select name="grant" onChange={this.handleChange}>
									<option>Select grant</option>
									{grants.map((grant) => {
										return (
											<option key={grant.id} value={grant.id}>
												{grant.name}
											</option>
										);
									})}
								</select>
							</div>
							<div className="item">
								<label htmlFor="project">
									{" "}
									Project<span>*</span>
								</label>
								<select name="project" onChange={this.handleChange}>
									<option>Select project</option>
									{MHKprojects.map((project) => {
										return (
											<option key={project.id} value={project.id}>
												{project.project}
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

export default connect(mapStateToProps, mapDispatchToProps)(TimeSheet);
