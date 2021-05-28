import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import basePath from "../utils/basePath";
import Modal from "react-bootstrap/Modal";

axios.defaults.baseURL = `${basePath}api/`;

export class LeaveSupervisors extends Component {
	state = {
		leaveRequests: [],
		leaveRequest: {},
		comments: "",
		show: false,
	};

	componentDidMount = () => {
		const { auth, supervisor } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = supervisor[0];
			axios
				.get(`leaveapplications/?supervisor=${id}&approved=false`)
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
		const body = {
			approved: true,
			comments: null,
		};
		axios.patch(`leaveapplications/${id}/`, body).then((res) => {
			const { data } = res;
			const { id } = data;
			const body = {
				approved: true,
				comments: null,
				date_approved: new Date(),
			};
			axios
				.get(`leaveapplicationssupervisor/?application=${id}`)
				.then((res) => {
					const { data } = res;
					if (data.length > 0) {
						const { id } = data[0];
						axios.patch(`leaveapplicationssupervisor/${id}/`, body).then(() => {
							const { supervisor } = this.props;
							const { id } = supervisor[0];
							axios
								.get(`leaveapplications/?supervisor=${id}&approved=false`)
								.then((res) => {
									const { data } = res;
									this.setState({
										...this.state,
										leaveRequests: data,
									});
								});
						});
					} else {
						const body = {
							approved: true,
							application: id,
							comments: null,
							date_approved: new Date(),
						};
						axios.post(`leaveapplicationssupervisor/`, body).then(() => {
							const { supervisor } = this.props;
							const { id } = supervisor[0];
							axios
								.get(`leaveapplications/?supervisor=${id}&approved=false`)
								.then((res) => {
									const { data } = res;
									this.setState({
										...this.state,
										leaveRequests: data,
									});
								});
						});
					}
				});
		});
	};

	handleDisApproveView = (id) => {
		axios.get(`leaveapplications/${id}/`).then((res) => {
			const { data } = res;
			this.setState({
				...this.state,
				leaveRequest: data,
				show: true,
			});
		});
	};

	handleDisApprove = (id) => {
		const { comments } = this.state;
		const body = {
			comments: comments,
			approved: false,
		};
		axios.patch(`leaveapplications/${id}/`, body).then((res) => {
			const { data } = res;
			const { id } = data;
			axios
				.get(`leaveapplicationssupervisor/?application=${id}`)
				.then((res) => {
					const { data } = res;
					if (data.length > 0) {
						const body = {
							comments: comments,
							approved: false,
							date_approved: null,
						};
						const { id } = data[0];
						axios.patch(`leaveapplicationssupervisor/${id}/`, body).then(() => {
							const { supervisor } = this.props;
							const { id } = supervisor[0];
							axios
								.get(`leaveapplications/?supervisor=${id}&approved=false`)
								.then((res) => {
									const { data } = res;
									this.setState({
										...this.state,
										leaveRequests: data,
										show: false,
									});
								});
						});
					} else {
						const body = {
							approved: false,
							application: id,
							comments: comments,
							date_approved: null,
						};
						axios.post(`leaveapplicationssupervisor/`, body).then(() => {
							const { supervisor } = this.props;
							const { id } = supervisor[0];
							axios
								.get(`leaveapplications/?supervisor=${id}&approved=false`)
								.then((res) => {
									const { data } = res;
									this.setState({
										...this.state,
										leaveRequests: data,
										show: false,
									});
								});
						});
					}
				})
				.catch((err) => {
					const { message } = err;
					console.log(message);
				});
		});
	};

	render() {
		const { leaveRequests, leaveRequest, show } = this.state;
		return (
			<div className="testbox container">
				<Modal
					show={show}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							{leaveRequest.staff_name}'s leave request
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="lead">
							Please give a reason for disapproving this request...
						</p>
						<textarea
							name="comments"
							rows={4}
							onChange={this.handleChange}></textarea>
						<div className="flex-wrapper">
							<span style={{ flex: 2, color: "transparent" }}>
								This is to separate buttons
							</span>
							<button
								className="btn-block btn-success btn-sm"
								style={{ flex: 1 }}
								onClick={this.handleClose}>
								Cancel
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
						<h1 className="ml-2 mr-2">Pending/approved leave requests</h1>
					</div>
					<div className="table-responsive">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>Requested By</th>
									<th>Duration</th>
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

											<td>
												<img
													src={request.staff_signature}
													width={50}
													height={50}
													alt="/"
												/>
											</td>
											<td>
												<div
													className="btn btn-success"
													onClick={() => this.handleApprove(request.id)}>
													Approve
												</div>

												{request.comments ? (
													<div
														className="btn btn-secondary"
														style={{ flex: 1 }}
														onClick={() =>
															this.handleDisApproveView(request.id)
														}>
														Disapproved
													</div>
												) : (
													<div
														className="btn btn-danger"
														style={{ flex: 1 }}
														onClick={() =>
															this.handleDisApproveView(request.id)
														}>
														Disapprove
													</div>
												)}
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

export default connect(mapStateToProps)(LeaveSupervisors);
