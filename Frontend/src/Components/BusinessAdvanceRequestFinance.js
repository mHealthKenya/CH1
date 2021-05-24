import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "axios";
import {
	financeApprove,
	getSpecificPurchaseData,
} from "../Redux/Purchase/actions";
import { requestFinanceStaff } from "../Redux/General/actions";
import {
	BARFinanceApprove,
	getSpecificBARData,
} from "../Redux/BusinessAdvanceRequest/actions";
import { requestLogo } from "../Redux/mHealthImages/actions";
import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

export class BusinessAdvanceRequestFinance extends Component {
	state = {
		show: false,
		showDisapprove: false,
		approved: true,
		finance_comment: "",
	};
	componentDidMount = () => {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = auth.user.user;
			this.props.requestFinanceStaff(id);
			this.props.BARFinanceApprove();
			this.props.requestLogo();
		}
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

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
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
		const { finStaff } = this.props;
		const finStaffID = finStaff.financeStaff[0].id;
		const url = `businessadvancerequest/${id}/`; // ? This url gets a specific purchase requisition. We rely on id
		const body = {
			finance_staff: finStaffID,
			finance_reviewed: true,
			finance_comment: null,
		};
		axios
			.patch(url, body)
			.then((res) => {
				console.log(res.data);
				const ID = res.data.id;
				const { auth } = this.props;
				// const { financeStaff } = finStaff;
				// const { id } = financeStaff[0];
				const UID = auth.user.user.id;
				const url = `businessadvancerequestsupervisor/?request=${ID}`;
				axios
					.get(url)
					.then((res) => {
						console.log(res.data);
						const eid = res.data[0].id; //eid is an accronym for existing id.
						const url = `businessadvancerequestfinance/?request=${eid}`;
						axios.get(url).then((res) => {
							try {
								const eid = res.data[0].id;
								const url = `businessadvancerequestfinance/${eid}/`;
								const body = {
									approved: true,
									owner: UID,
								};

								axios.patch(url, body).then(() => {
									this.props.BARFinanceApprove();
								});
							} catch (err) {
								console.log(err.message);
								const url = "businessadvancerequestfinance/";
								const body = {
									approved: true,
									owner: UID,
									request: eid,
								};

								axios
									.post(url, body)
									.then(() => {
										this.props.BARFinanceApprove();
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
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	handleDisApprove = (id) => {
		const { finance_comment } = this.state;
		const { finStaff } = this.props;
		const finStaffID = finStaff.financeStaff[0].id;
		const url = `businessadvancerequest/${id}/`; //This url gets a specific purchase requisition. We rely on id
		const body = {
			finance_staff: finStaffID,
			finance_reviewed: false,
			finance_comment: finance_comment,
		};
		axios
			.patch(url, body)
			.then((res) => {
				console.log(res.data);
				const ID = res.data.id;
				const { auth } = this.props;
				// const { financeStaff } = finStaff;
				// // const { id } = financeStaff[0];
				const UID = auth.user.user.id;
				const url = `businessadvancerequestsupervisor/?request=${ID}`;
				axios
					.get(url)
					.then((res) => {
						console.log(res.data);
						const eid = res.data[0].id; //eid is an accronym for existing id.
						const url = `businessadvancerequestfinance/?request=${eid}`;
						axios.get(url).then((res) => {
							try {
								const eid = res.data[0].id;
								const url = `businessadvancerequestfinance/${eid}/`;
								const body = {
									approved: false,
									owner: UID,
								};

								axios.patch(url, body).then(() => {
									this.props.BARFinanceApprove();
									this.setState({
										...this.state,
										show: false,
										showDisapprove: false,
									});
								});
							} catch (err) {
								console.log(err.message);
								const url = "businessadvancerequestfinance/";
								const body = {
									approved: false,
									owner: UID,
									request: eid,
								};

								axios
									.post(url, body)
									.then(() => {
										this.props.BARFinanceApprove();
										this.setState({
											...this.state,
											show: false,
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
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	printDiv = (divName) => {
		var printContents = document.getElementById(divName).innerHTML;
		var originalContents = document.body.innerHTML;

		document.body.innerHTML = printContents;

		window.print();
		window.location.reload();

		document.body.innerHTML = originalContents;
	};

	handleDownload = () => {
		this.printDiv("report");
		this.setState({
			...this.state,
			show: false,
		});
	};

	render() {
		let self = this;
		const { show, showDisapprove } = this.state;
		const { auth, sBAR, specificBAR, logo } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className="testbox container">
				<Modal
					show={show}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered>
					<div id="report">
						<br />
						<div style={{ textAlign: "center" }}>
							<img src={logo} width={500} height={100} alt="logo" />
							<br />
							<h2>Business Advance Report</h2>
						</div>
						<Modal.Body>
							<div className="table-responsive">
								<table className="table table-striped">
									<thead>
										<th>Department</th>
										<td>{specificBAR.department_name}</td>
										<th>Date Submitted</th>
										<td>{moment(specificBAR.date).format("YYYY - MM - DD")}</td>
									</thead>
									<thead>
										<th>Amount Requested</th>
										<td>{specificBAR.amount}</td>
										<th>Account Number</th>
										<td>{specificBAR.account_code_value}</td>
									</thead>
									<thead>
										<th>Requested by</th>
										<td>
											{specificBAR.requester_name}{" "}
											<img
												src={specificBAR.staff_signature}
												alt="signature is here"
												width={50}
												height={50}
											/>
										</td>

										<th>Project</th>
										<td>{specificBAR.project_name} </td>
									</thead>
									<thead>
										<th>Description</th>
										<td>{specificBAR.description}</td>
									</thead>
									<thead>
										<th>Approved by</th>
										<td>{specificBAR.supervisor_name}</td>
										<th>Signature</th>
										<td>
											{" "}
											<img
												src={specificBAR.supervisor_signature}
												alt="supervisor signature"
												width={50}
												height={50}
											/>
										</td>
									</thead>
									<thead>
										<th>Received by</th>
										<td>{specificBAR.finance_name} </td>
										<th>Signature</th>
										<td>
											<img
												src={specificBAR.finance_signature}
												alt="finance signature"
												width={50}
												height={50}
											/>
										</td>
									</thead>
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
							className="btn btn-outline btn-success"
							onClick={this.handleDownload}>
							Download
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
							name="finance_comment"
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
								onClick={() => this.handleDisApprove(specificBAR.id)}
								style={{ flex: 1 }}>
								Disapprove
							</button>
						</div>
					</Modal.Body>
				</Modal>
				{isAuthenticated ? (
					<form>
						<div className="banner">
							<h1 className="ml-2 mr-2">
								Business advance requests pending finance approval
							</h1>
						</div>
						<div className="table-responsive">
							<table className="table table-striped">
								<thead>
									<tr>
										<th>Staff</th>
										<th>Amount</th>
										<th>Supervisor</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{sBAR.map((request) => {
										return (
											<tr key={request.id}>
												<td>{request.requester_name}</td>
												<td>{request.amount}</td>
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
														className="btn btn-info btn-sm"
														onClick={() => this.handleView(request.id)}>
														View
													</div>

													{request.finance_reviewed ? (
														<div
															className="btn btn-secondary btn-sm"
															style={{ flex: 1 }}
															disabled>
															Approved
														</div>
													) : (
														<div
															className="btn btn-success btn-sm"
															style={{ flex: 1 }}
															onClick={() => self.handleApprove(request.id)}>
															Approve
														</div>
													)}

													{request.finance_comment ? (
														<div
															className="btn btn-danger btn-sm disabled"
															style={{ flex: 1 }}>
															Disapproved
														</div>
													) : (
														<div
															className="btn btn-danger btn-sm"
															onClick={() =>
																self.handleDisApproveView(request.id)
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
		finStaff: state.finStaff,
		sBAR: state.sBAR.sBAR,
		specificBAR: state.specificBAR.specificBAR,
		logo: state.logo.logo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		financeApprove: () => dispatch(financeApprove()),
		getSpecificPurchaseData: (id) => dispatch(getSpecificPurchaseData(id)),
		requestFinanceStaff: (id) => dispatch(requestFinanceStaff(id)),
		BARFinanceApprove: () => dispatch(BARFinanceApprove()),
		getSpecificBARData: (id) => dispatch(getSpecificBARData(id)),
		requestLogo: () => dispatch(requestLogo()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BusinessAdvanceRequestFinance);
