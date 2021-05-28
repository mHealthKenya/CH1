import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import basePath from "../utils/basePath";
import Modal from "react-bootstrap/Modal";

axios.defaults.baseURL = `${basePath}api/`;

export class LeaveCOO extends Component {
	state = {
		leaveRequests: [],
		leaveRequest: {},
		comments: "",
		show: false,
		availableDays: 0,
		daysGone: 0,
	};

	componentDidMount = () => {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			axios
				.get(`leaveapplicationssupervisor/?approved=true&coo_approved=false`)
				.then((res) => {
					const { data } = res;
					this.setState({
						...this.state,
						leaveRequests: data,
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

	handleClose = (e) => {
		this.setState({
			...this.state,
			show: false,
		});
	};

	handleApprove = (id) => {
		const { auth } = this.props;
		const ID = auth.user.user.id;
		const body = {
			coo_approved: true,
			coo_comments: null,
		};
		axios
			.patch(`leaveapplicationssupervisor/${id}/`, body)
			.then(() => {
				axios
					.get(`leaveapplicationscoo/?application=${id}`)
					.then((res) => {
						const { data } = res;
						if (data.length > 0) {
							const { id } = data[0];
							const body = {
								approved: true,
								comments: null,
								approval_date: new Date(),
								coo: ID,
							};
							axios
								.patch(`leaveapplicationscoo/${id}/`, body)
								.then(() => {
									axios
										.get(
											`leaveapplicationssupervisor/?approved=true&coo_approved=false`
										)
										.then((res) => {
											const { data } = res;
											this.setState({
												...this.state,
												leaveRequests: data,
												show: false,
											});
										})
										.catch((err) => {
											console.log(err.message);
										});
								})
								.catch((err) => {
									console.log(err.message);
								});
						} else {
							const body = {
								approved: true,
								comments: null,
								application: id,
								approval_date: new Date(),
								coo: ID,
							};

							axios
								.post(`leaveapplicationscoo/`, body)
								.then((res) => {
									axios
										.get(
											`leaveapplicationssupervisor/?approved=true&coo_approved=false`
										)
										.then((res) => {
											const { data } = res;
											this.setState({
												...this.state,
												leaveRequests: data,
												show: false,
											});
										})
										.catch((err) => {
											console.log(err.message);
										});
								})
								.catch((err) => {
									console.log(err.message);
								});
						}
					})
					.catch((err) => {
						console.log(err.message);
					});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	handleView = (id) => {
		let daysGone = 0;
		axios.get(`leaveapplicationssupervisor/${id}/`).then((res) => {
			const { data } = res;
			// console.log(data);
			this.setState({
				...this.state,
				leaveRequest: data,
				show: true,
			});
			const { leave, staff } = data;
			axios.get(`leavedefinitions/?leave=${leave}`).then((res) => {
				const { data } = res;
				const { duration } = data[0];
				this.setState({
					...this.state,
					availableDays: duration,
				});
				axios
					.get(
						`leaveapplicationscoo/?application__application__staff=${parseInt(
							staff
						)}&approved=true`
					)
					.then((res) => {
						const { data } = res;
						if (data.length > 0) {
							data.forEach((info) => {
								if (info.leave === leave) {
									daysGone += parseInt(info.duration);
								}
							});
							this.setState({
								...this.state,
								daysGone: daysGone,
							});
						}
					});
			});
		});
	};

	handleDisApprove = (id) => {
		const { coo_comments } = this.state;
		const { auth } = this.props;
		const ID = auth.user.user.id;
		const body = {
			approved: false,
		};
		axios
			.get(`leaveapplicationssupervisor/${id}/`)
			.then((res) => {
				const { data } = res;
				const { application } = data;
				axios
					.patch(`/leaveapplications/${application}/`, body)
					.then((res) => {
						const body = {
							coo_approved: false,
							coo_comments: coo_comments,
							approved: false,
							date_approved: null,
						};
						axios
							.patch(`leaveapplicationssupervisor/${id}/`, body)
							.then(() => {
								axios
									.get(`leaveapplicationscoo/?application=${id}`)
									.then((res) => {
										const { data } = res;
										if (data.length > 0) {
											const { id } = data[0];
											const body = {
												approved: false,
												comments: coo_comments,
												approval_date: null,
												coo: ID,
											};
											axios
												.patch(`leaveapplicationscoo/${id}/`, body)
												.then(() => {
													axios
														.get(
															`leaveapplicationssupervisor/?approved=true&coo_approved=false`
														)
														.then((res) => {
															const { data } = res;
															this.setState({
																...this.state,
																leaveRequests: data,
																show: false,
															});
														})
														.catch((err) => {
															console.log(err.message);
														});
												})
												.catch((err) => {
													console.log(err.message);
												});
										} else {
											const body = {
												approved: false,
												comments: coo_comments,
												application: id,
												approval_date: null,
												coo: ID,
											};

											axios
												.post(`leaveapplicationscoo/`, body)
												.then((res) => {
													axios
														.get(
															`leaveapplicationssupervisor/?approved=true&coo_approved=false`
														)
														.then((res) => {
															const { data } = res;
															this.setState({
																...this.state,
																leaveRequests: data,
																show: false,
															});
														})
														.catch((err) => {
															console.log(err.message);
														});
												})
												.catch((err) => {
													console.log(err.message);
												});
										}
									})
									.catch((err) => {
										console.log(err.message);
									});
							})
							.catch((err) => {
								console.log(err.message);
							});
					})
					.catch((err) => {
						console.log(err.message);
					});
			})
			.catch((err) => console.log(err.message));
	};

	render() {
		const { leaveRequests, leaveRequest, show, availableDays, daysGone } =
			this.state;
		return (
			<div className="testbox container">
				<Modal
					show={show}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered>
					<Modal.Header closeButton onClick={this.handleClose}>
						<Modal.Title id="contained-modal-title-vcenter">
							{leaveRequest.staff_name}'s leave request
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="row ml-1">
							<div className="column">
								<p className="lead">
									<b>Leave Type:</b> {leaveRequest.leave}
								</p>
								<p className="lead">
									<b>Duration:</b> {leaveRequest.duration} working days
								</p>
								<p className="lead">
									<b>Supervisor:</b> {leaveRequest.supervisor_name}
								</p>
							</div>
							<div className="column">
								<p className="lead">
									<b>Maximum Available Days: </b> {availableDays}
								</p>
								<p className="lead">
									<b>Days previously on leave: </b> {daysGone}
								</p>
								<p className="lead">
									<b>Available leave days: </b>{" "}
									{parseInt(availableDays) - parseInt(daysGone)}
								</p>
							</div>
						</div>
						<small style={{ color: "red" }}>
							Only fill this field if you are rejecting a leave request.
						</small>
						<p className="lead">
							Please give a reason for disapproving this request...
						</p>
						<textarea
							name="coo_comments"
							rows={4}
							onChange={this.handleChange}></textarea>
						<div className="flex-wrapper">
							<span style={{ flex: 2, color: "transparent" }}>
								This is to separate buttons
							</span>
							<button
								className="btn-block btn-success btn-sm"
								style={{ flex: 1 }}
								onClick={() => this.handleApprove(leaveRequest.id)}>
								Approve
							</button>
							<span style={{ color: "transparent" }}>is</span>
							<button
								className="btn-block btn-danger sm"
								style={{ flex: 1 }}
								onClick={() => this.handleDisApprove(leaveRequest.id)}>
								Disapprove
							</button>
						</div>
					</Modal.Body>
				</Modal>
				<form>
					<div className="banner">
						<h1 className="ml-2 mr-2">Pending leave requests</h1>
					</div>
					<div className="table-responsive">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>Requested By</th>
									<th>Duration</th>
									<th>Approved By</th>
									<th>Signature</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{leaveRequests.map((request) => {
									return (
										<tr key={request.id}>
											<td>{request.staff_name}</td>
											<td>{request.duration} Days</td>
											<td>{request.supervisor_name}</td>

											<td>
												<img
													src={request.supervisor_signature}
													width={50}
													height={50}
													alt="/"
												/>
											</td>
											<td>
												{request.coo_comments ? (
													<div className="btn btn-danger disabled">
														Rejected
													</div>
												) : null}
												<div
													className="btn btn-success"
													onClick={() => this.handleView(request.id)}>
													View
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		supervisor: state.supervisor.supervisor,
	};
};

export default connect(mapStateToProps)(LeaveCOO);
