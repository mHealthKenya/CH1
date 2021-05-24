import React, { Component } from "react";
import { connect } from "react-redux";
import { requestSupervisors } from "../Redux/General/actions";
import { workingDays } from "../utils/dates";
import { Redirect } from "react-router-dom";
import axios from "axios";
import basePath from "../utils/basePath";
import { getAnnualLeave, sum } from "../utils/leaveDetails";

axios.defaults.baseURL = `${basePath}api/`;

export class Leave extends Component {
	state = {
		title: "",
		type: "",
		datefrom: "",
		days: 0,
		dateto: "",
		backDate: "",
		annual: 0,
	};

	componentDidMount = () => {
		this.props.requestSupervisors();
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = auth.user.user;
			this.setState({
				...this.state,
				annual: getAnnualLeave(id, new Date().getFullYear()),
			});
		}
	};

	handleChange = (e) => {
		const { annual, period } = this.state;
		if (sum(annual) > 21) {
			alert("You have exhausted your leave days.");
		}
		const { name, value } = e.target;
		this.setState({
			...this.state,
			[name]: value,
		});
		console.log(this.state);
	};

	handleLeaveDays = () => {
		const { datefrom, dateto } = this.state;
		this.setState({
			...this.state,
			days: workingDays(datefrom, dateto).length,
			backDate: workingDays(datefrom, dateto)[
				workingDays(datefrom, dateto).length - 1
			],
		});
	};
	render() {
		const { auth, supervisors, supervisor } = this.props;
		const { datefrom, backDate, title, dateto } = this.state;
		const { isAuthenticated } = auth;

		let eligibleSupervisors = [];
		if (supervisor.length > 0) {
			const currentSupervisor = supervisor[0].id;
			eligibleSupervisors = supervisors.filter(
				(element) => element.id !== currentSupervisor
			);
		} else {
			eligibleSupervisors = supervisors;
		}
		return (
			<div className="testbox container">
				{isAuthenticated ? (
					<form>
						<div className="banner">
							<h1>Leave Application </h1>
						</div>
						<div>
							{/* You can set className='colums' to put the forms in rows... */}
							<div className="item">
								<label htmlFor="address2">
									Position/Title <span>*</span>
								</label>
								<input
									id="title"
									type="text"
									name="title"
									value={title}
									required
									onChange={this.handleChange}
								/>
							</div>
							<div className="item">
								<label htmlFor="department">
									Leave Type<span>*</span>
								</label>
								<select name="type" onChange={this.handleChange}>
									<option>Select Leave</option>
									<option>Annual</option>
									<option>Maternity</option>
									<option>Paternity</option>
									<option>Exam</option>
									<option>Sick</option>
									<option>Compassionate</option>
								</select>
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
							<div className="item">
								<label htmlFor="supervisor">
									{" "}
									Supervisor<span>*</span>
								</label>
								<select name="supervisor" onChange={this.handleChange}>
									<option>Select supervisor</option>
									{eligibleSupervisors.map((supervisor) => {
										return (
											<option key={supervisor.id} value={supervisor.id}>
												{supervisor.supervisor_name}
											</option>
										);
									})}
								</select>
							</div>
							<div className="btn-block">
								<button onClick={this.handleLeaveDays}>Submit</button>
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
		supervisors: state.supervisors.supervisors,
		supervisor: state.supervisor.supervisor,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestSupervisors: () => dispatch(requestSupervisors()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Leave);
