import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import basePath from "../utils/basePath";
import { requestLogo } from "../Redux/mHealthImages/actions";
import { printDiv } from "../utils/print";
import Modal from "react-bootstrap/Modal";
import moment from "moment";

axios.defaults.baseURL = `${basePath}api/`;

export class MyLeaveApplications extends Component {
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
			const { id } = auth.user.user;
			this.props.requestLogo();
			axios
				.get(
					`leaveapplicationscoo/?approved=true&application__application__staff=${id}`
				)
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

	handleView = (id) => {
		let daysGone = 0;
		axios.get(`leaveapplicationscoo/${id}/`).then((res) => {
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

	handleDownload = (e) => {
		printDiv("test");
		this.setState({
			...this.state,
			show: false,
		});
	};

	render() {
		const { leaveRequests, leaveRequest, show, availableDays, daysGone } =
			this.state;
		const { logo } = this.props;
		return (
			<div className="testbox container">
				<Modal
					show={show}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered>
					<div id="test">
						<br />
						<div style={{ textAlign: "center" }}>
							<img src={logo} width={500} height={100} alt="logo" />
							<br />
							<h2>Leave Application Form</h2>
						</div>
						<Modal.Body>
							<table className=" table ">
								<tbody>
									<tr>
										<td>Full Name</td>
										<td>{leaveRequest.staff_name}</td>
									</tr>

									<tr>
										<td>Staff ID</td>
										<td>{leaveRequest.staff_id}</td>
									</tr>

									<tr>
										<td>Position/Tile</td>
										<td>{leaveRequest.position}</td>
									</tr>
								</tbody>
							</table>
							<div>
								<h2>Leave Days Breakdown</h2>
								<table className="table">
									<tbody>
										<tr>
											<td>Leave Type</td>
											<td>{leaveRequest.leave}</td>
										</tr>

										<tr>
											<td>Working Days</td>
											<td>{leaveRequest.duration}</td>
										</tr>

										<tr>
											<td>Start Date</td>
											<td>
												{moment(leaveRequest.start_date).format(
													"YYYY - MM - DD"
												)}
											</td>
										</tr>
										<tr>
											<td>Last Date</td>
											<td>
												{moment(leaveRequest.last_date).format(
													"YYYY - MM - DD"
												)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div>
								<h2>Approval Authority</h2>
								<table className="table">
									<tbody>
										<tr>
											<td>Applicant</td>
											<td>{leaveRequest.staff_name}</td>
											<td>
												<img
													src={leaveRequest.staff_signature}
													alt="Not signed"
													style={{ width: 50, height: 50 }}
												/>
											</td>
											<td>
												{moment(leaveRequest.start_date).format(
													"YYYY - MM - DD"
												)}
											</td>
										</tr>
										<tr>
											<td>Supervisor</td>
											<td>{leaveRequest.supervisor_name}</td>
											<td>
												<img
													src={leaveRequest.supervisor_signature}
													alt="Not signed"
													style={{ width: 50, height: 50 }}
												/>
											</td>
											<td>
												{moment(leaveRequest.date_approved).format(
													"YYYY - MM - DD"
												)}
											</td>
										</tr>
										<tr>
											<td>Chief Operations Officer</td>
											<td>{leaveRequest.coo_name}</td>
											<td>
												<img
													src={leaveRequest.coo_signature}
													alt="Not signed"
													style={{ width: 50, height: 50 }}
												/>
											</td>
											<td>
												{moment(leaveRequest.approval_date).format(
													"YYYY - MM - DD"
												)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</Modal.Body>
					</div>
					<Modal.Footer>
						<div
							className="btn btn-outline btn-secondary"
							onClick={this.handleClose}>
							Close
						</div>
						<div
							className="btn btn-outline btn-primary"
							onClick={this.handleDownload}>
							Download
						</div>
					</Modal.Footer>
				</Modal>
				<form>
					<div className="banner">
						<h1 className="ml-2 mr-2">Approved Leave Requests</h1>
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
		logo: state.logo.logo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestLogo: () => dispatch(requestLogo()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MyLeaveApplications);
