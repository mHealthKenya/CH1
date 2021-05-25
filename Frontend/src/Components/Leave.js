import React, { Component } from "react";
import { connect } from "react-redux";
import { requestSupervisors } from "../Redux/General/actions";
import { workingDays } from "../utils/dates";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import CircularProgress from "@material-ui/core/CircularProgress";
import basePath from "../utils/basePath";
import { getAnnualLeave, sum } from "../utils/leaveDetails";

axios.defaults.baseURL = `${basePath}api/`;

export class Leave extends Component {
	state = {
		position: "",
		types: [],
		datefrom: "",
		duration: 0,
		dateto: "",
		backDate: "",
		annual: 0,
		leave: "",
		show: false,
		loading: false,
		error: null,
		supervisor: null,
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
			axios.get(`leavedefinitions/`).then((res) => {
				const { data } = res;
				this.setState({
					...this.state,
					types: data,
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

	handleHome = () => {
		this.props.history.push("/");
	};

	handleClose = () => {
		this.setState({
			...this.state,
			show: false,
			position: "",
			datefrom: "",
			dateto: "",
			leave: "",
			supervisor: null,
		});

		console.log(this.state);
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({
			...this.state,
			loading: true,
		});
		const { position, supervisor, leave, datefrom, dateto } = this.state;
		const duration = workingDays(datefrom, dateto).length;
		const backDate = workingDays(datefrom, dateto)[
			workingDays(datefrom, dateto).length - 1
		];
		const { auth } = this.props;
		const { id } = auth.user.user;
		const staff = id;
		const year = new Date().getFullYear();
		const body = {
			position,
			duration,
			supervisor,
			leave,
			year,
			staff,
		};

		console.log(body);

		axios
			.post(`leaveapplications/`, body)
			.then(() => {
				this.setState({
					...this.state,
					duration: duration,
					backDate: backDate,
					show: true,
					loading: false,
				});
			})
			.catch((err) => {
				const { message } = err;
				this.setState({
					...this.state,
					error: message,
					loading: false,
				});
				setTimeout(() => {
					this.setState({
						...this.state,
						error: null,
					});
				}, 5000);
			});
	};

	render() {
		const { auth, supervisors, supervisor } = this.props;
		const {
			datefrom,
			backDate,
			position,
			dateto,
			types,
			show,
			duration,
			loading,
			error,
		} = this.state;
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
				<Modal
					show={show}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered>
					<Modal.Header closeButton onClick={this.handleClose}>
						<Modal.Title id="contained-modal-title-vcenter">
							Success!
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="Lead">
							You have applied for a leave for a duration of <b>{duration}</b>{" "}
							days.
						</p>
						<p className="Lead">
							Should this be approved, your leave will end on{" "}
							{new Date(backDate).toDateString()}
						</p>
					</Modal.Body>
					<Modal.Footer>
						<button className="btn btn-secondary" onClick={this.handleClose}>
							Close
						</button>
						<button className="btn btn-success" onClick={this.handleHome}>
							Go Home
						</button>
					</Modal.Footer>
				</Modal>
				{isAuthenticated ? (
					<form>
						<div className="banner">
							<h1>Leave Application </h1>
						</div>
						<div>
							{error ? (
								<div className="alert alert-danger mt-3">
									{" "}
									Your request was not successful. Please check your connection
									and try again.
								</div>
							) : null}
							{/* You can set className='colums' to put the forms in rows... */}
							<div className="item">
								<label htmlFor="address2">
									Position/Title <span>*</span>
								</label>
								<input
									id="position"
									type="text"
									name="position"
									value={position}
									required
									onChange={this.handleChange}
								/>
							</div>
							<div className="item">
								<label htmlFor="department">
									Leave Type<span>*</span>
								</label>
								<select name="leave" onChange={this.handleChange}>
									<option>Select Leave</option>
									{types.map((hol) => {
										return (
											<option key={hol.id} value={hol.id}>
												{hol.leave}
											</option>
										);
									})}
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
								{loading ? (
									<CircularProgress />
								) : (
									<button onClick={this.handleSubmit}>Submit</button>
								)}
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
