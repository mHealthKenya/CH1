import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "axios";
import { requestSupervisor } from "../Redux/General/actions";
import {
	getPurchaseData,
	getSpecificPurchaseData,
	supervisorApprove,
} from "../Redux/Purchase/actions";
import {
	requestSupervisorBusinessAdvanceRequest,
	getSpecificBARData,
} from "../Redux/BusinessAdvanceRequest/actions";
import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

export class BusinessAdvanceRequestSupervisor extends Component {
	state = {
		show: false,
		showDisapprove: false,
		approved: true,
		supervisor_comment: "",
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	handleView = (id) => {
		this.props.getSpecificBARData(id);
		this.setState({
			...this.state,
			show: true,
		});
	};

	handleDisApproveView = (id) => {
		this.props.getSpecificBARData(id);
		this.setState({
			...this.state,
			showDisapprove: true,
		});
	};

	handleClose = () => {
		this.setState({
			...this.state,
			show: false,
			showDisapprove: false,
		});
	};

	handleApprove = (id) => {
		const url = `businessadvancerequest/${id}/`;
		const body = {
			approved: true,
			supervisor_comment: null,
		};
		axios
			.patch(url, body)
			.then((res) => {
				const { supervisor, auth } = this.props;
				const UID = auth.user.user.id;
				const { id } = supervisor.supervisor[0];

				const ID = res.data.id;
				console.log(ID);
				const url = `businessadvancerequestsupervisor/?request=${ID}`;
				axios.get(url).then((res) => {
					try {
						const eid = res.data[0].id; //eid is an accronym for existing id.
						const url = `businessadvancerequestsupervisor/${eid}/`;
						const body = {
							approved: true,
						};
						axios.patch(url, body).then((res) => {
							console.log(res.data);
							this.props.requestSupervisorBusinessAdvanceRequest(id);
						});
					} catch (err) {
						console.log(err.message);
						const url = `businessadvancerequestsupervisor/`;
						const body = {
							approved: true,
							owner: UID,
							request: ID,
						};
						axios
							.post(url, body)
							.then((res) => {
								console.log(res.data);
								this.props.requestSupervisorBusinessAdvanceRequest(id);
							})
							.catch((err) => {
								console.log(err.message);
								console.log(body);
							});
					}
				});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	handleDisApprove = (id) => {
		const { supervisor_comment } = this.state;
		const url = `businessadvancerequest/${id}/`;
		const body = {
			approved: false,
			supervisor_comment: supervisor_comment,
		};
		axios
			.patch(url, body)
			.then((res) => {
				const { supervisor, auth } = this.props;
				const UID = auth.user.user.id;
				const { id } = supervisor.supervisor[0];

				const ID = res.data.id;
				console.log(res.data);
				const url = `businessadvancerequestsupervisor/?request=${ID}`;
				axios.get(url).then((res) => {
					try {
						console.log(res.data);
						const eid = res.data[0].id; //eid is an accronym for existing id.
						const url = `businessadvancerequestsupervisor/${eid}/`;
						const body = {
							approved: false,
						};
						axios.patch(url, body).then((res) => {
							console.log(res.data);
							this.props.requestSupervisorBusinessAdvanceRequest(id);
							this.setState({
								...this.state,
								showDisapprove: false,
							});
						});
					} catch (err) {
						console.log(err.message);
						const url = `businessadvancerequestsupervisor/`;
						const body = {
							approved: false,
							owner: UID,
							request: ID,
						};
						axios
							.post(url, body)
							.then((res) => {
								console.log(res.data);
								this.props.requestSupervisorBusinessAdvanceRequest(id);
								this.setState({
									...this.state,
									showDisapprove: false,
								});
							})
							.catch((err) => {
								console.log(err.message);
								console.log(body);
							});
					}
				});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	componentDidMount = () => {
		const { supervisor } = this.props;
		const { id } = supervisor.supervisor[0];
		this.props.requestSupervisorBusinessAdvanceRequest(id);
	};
	render() {
		let self = this;
		const { show, showDisapprove } = this.state;
		const { auth, sBAR, specificBAR } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className="testbox container">
				<Modal
					show={show}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							{specificBAR.requester_name}'s Request
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="lead">
							<b>Date: </b>
							{moment(specificBAR.date).format("YYYY - MM - DD")}
						</p>
						<p className="lead">
							<b>Description: </b>
							{specificBAR.description}
						</p>
					</Modal.Body>
					<Modal.Footer>
						<div
							className="btn btn-outline btn-secondary"
							onClick={this.handleClose}>
							Close
						</div>
					</Modal.Footer>
				</Modal>
				<Modal
					show={showDisapprove}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							{specificBAR.requester_name}'s Request
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="lead">
							Please give a reason for disapproving this request...
						</p>
						<textarea
							name="supervisor_comment"
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
								onClick={() => this.handleDisApprove(specificBAR.id)}>
								Disapprove
							</button>
						</div>
					</Modal.Body>
				</Modal>
				{isAuthenticated ? (
					<form>
						<div className="banner">
							<h1 className="ml-2 mr-2">
								Pending/approved business advance requests
							</h1>
						</div>
						<div className="table-responsive">
							<table className="table table-striped">
								<thead>
									<tr>
										<th>Requested By</th>
										<th>Amount</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{sBAR.map((request) => {
										return (
											<tr key={request.id}>
												<td>{request.requester_name}</td>
												<td>{request.amount}</td>
												<td className="flex-wrapper">
													<div
														className="btn btn-info"
														style={{ flex: 1 }}
														onClick={() => this.handleView(request.id)}>
														View
													</div>{" "}
													{request.approved ? (
														<div
															className="btn btn-secondary disabled"
															style={{ flex: 2 }}
															onClick={() => self.handleApprove(request.id)}>
															Approved
														</div>
													) : (
														<div
															className="btn btn-success"
															onClick={() => self.handleApprove(request.id)}>
															Approve
														</div>
													)}{" "}
													{request.approved ? null : request.supervisor_comment ? (
														<div
															className="btn btn-secondary disabled"
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
		supervisor: state.supervisor,
		purchases: state.supervisorPurchase,
		purchase: state.specificPurchase,
		sBAR: state.sBAR.sBAR,
		specificBAR: state.specificBAR.specificBAR,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestSupervisor: (id) => dispatch(requestSupervisor(id)),
		getPurchaseData: (id) => dispatch(getPurchaseData(id)),
		getSpecificPurchaseData: (id) => dispatch(getSpecificPurchaseData(id)),
		supervisorApprove: (id) => dispatch(supervisorApprove(id)),
		requestSupervisorBusinessAdvanceRequest: (id) =>
			dispatch(requestSupervisorBusinessAdvanceRequest(id)),
		getSpecificBARData: (id) => dispatch(getSpecificBARData(id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BusinessAdvanceRequestSupervisor);
