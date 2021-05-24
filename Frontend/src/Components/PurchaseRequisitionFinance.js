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
import { requestLogo } from "../Redux/mHealthImages/actions";
import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

export class PurchaseRequisitionFinance extends Component {
	state = {
		show: false,
		showDisapprove: false,
		approved: true,
		finance_comments: "",
	};
	componentDidMount = () => {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = auth.user.user;
			this.props.requestFinanceStaff(id);
			this.props.financeApprove();
			this.props.requestLogo();
		}
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

	handleView = (id) => {
		this.props.getSpecificPurchaseData(id);
		this.setState({
			...this.state,
			show: true,
		});
	};

	handleDisApproveView = (id) => {
		this.props.getSpecificPurchaseData(id);
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
		const url = `purchaserequisition/${id}/`; //This url gets a specific purchase requisition. We rely on id
		const body = {
			reviewing_finance_officer: finStaffID,
			finance_approved: true,
			finance_comments: null,
			date_finace_officer_review: new Date(),
		};
		axios
			.patch(url, body)
			.then((res) => {
				console.log(res.data);
				const ID = res.data.id;
				const { finStaff, auth } = this.props;
				const { financeStaff } = finStaff;
				const { id } = financeStaff[0];
				const UID = auth.user.user.id;
				const url = `SAPR/?requisition=${ID}`;
				axios
					.get(url)
					.then((res) => {
						console.log(res.data);
						const eid = res.data[0].id; //eid is an accronym for existing id.
						const url = `FAPR/?requisition=${eid}`;
						axios.get(url).then((res) => {
							try {
								const eid = res.data[0].id;
								const url = `FAPR/${eid}/`;
								const body = {
									finance_approved: true,
									finance_disapproved: false,
									disapproval_message: null,
									owner: UID,
									finance_staff: id,
								};

								axios.patch(url, body).then(() => {
									this.props.financeApprove();
								});
							} catch (err) {
								console.log(err.message);
								const url = "FAPR/";
								const body = {
									finance_approved: true,
									finance_disapproved: false,
									disapproval_message: null,
									owner: UID,
									requisition: eid,
									finance_staff: id,
								};

								axios
									.post(url, body)
									.then(() => {
										this.props.financeApprove();
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
		const { finance_comments } = this.state;
		const { finStaff } = this.props;
		const finStaffID = finStaff.financeStaff[0].id;
		const url = `purchaserequisition/${id}/`; //This url gets a specific purchase requisition. We rely on id
		const body = {
			reviewing_finance_officer: finStaffID,
			finance_approved: false,
			finance_comments: finance_comments,
			date_finance_officer_review: null,
		};
		axios
			.patch(url, body)
			.then((res) => {
				console.log(res.data);
				const ID = res.data.id;
				const { finStaff, auth } = this.props;
				const { financeStaff } = finStaff;
				const { id } = financeStaff[0];
				const UID = auth.user.user.id;
				const url = `SAPR/?requisition=${ID}`;
				axios
					.get(url)
					.then((res) => {
						console.log(res.data);
						const eid = res.data[0].id; //eid is an accronym for existing id.
						const url = `FAPR/?requisition=${eid}`;
						axios.get(url).then((res) => {
							try {
								const eid = res.data[0].id;
								const url = `FAPR/${eid}/`;
								const body = {
									finance_approved: false,
									finance_disapproved: true,
									owner: UID,
									requisition: eid,
									finance_staff: id,
									disapproval_message: finance_comments,
								};

								axios.patch(url, body).then(() => {
									this.props.financeApprove();
									this.setState({
										...this.state,
										showDisapprove: false,
									});
								});
							} catch (err) {
								console.log(err.message);
								const url = "FAPR/";
								const body = {
									finance_approved: false,
									finance_disapproved: true,
									owner: UID,
									requisition: eid,
									finance_staff: id,
									disapproval_message: finance_comments,
								};

								axios
									.post(url, body)
									.then(() => {
										this.props.financeApprove();
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
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	render() {
		let self = this;
		const { show, showDisapprove } = this.state;
		const { purchases, purchase, auth, logo } = this.props;
		const { purchaseRequests } = purchases;
		const { purchaseRequest } = purchase;
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
							<h2>Purchase Requisition Form</h2>
						</div>

						<Modal.Body>
							<div className="table-responsive">
								<table className="table table-striped">
									<thead>
										<tr>
											<th>Date Requested</th>
											<th>Activity</th>
											<th>Description</th>
											<th>Account Code</th>
											<th>Amount</th>
											<th>Supervisor</th>
											{purchaseRequest.ceo_approved ? (
												<th>CEO signature</th>
											) : (
												<th>CEO comments</th>
											)}
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												{moment(purchaseRequest.date_requested).format(
													"YYYY - MM - DD"
												)}
											</td>
											<td>{purchaseRequest.activity}</td>
											<td>{purchaseRequest.description}</td>
											<td>{purchaseRequest.account_code_value}</td>
											<td>{purchaseRequest.amount}</td>
											<td>
												<img
													src={purchaseRequest.supervisor_signature}
													alt="signature"
													width={50}
													height={50}
												/>
											</td>
											{purchaseRequest.ceo_comments ? (
												<td style={{ color: "red" }}>
													{purchaseRequest.ceo_comments}
												</td>
											) : purchaseRequest.ceo_approved ? (
												<td>
													<img
														src={purchaseRequest.CEO_signature}
														alt="signature"
														width={50}
														height={50}
													/>
												</td>
											) : (
												<td>N/A</td>
											)}
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
							{purchaseRequest.requester_name}'s Request
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="lead">
							Please give a reason for disapproving this request...
						</p>
						<textarea
							name="finance_comments"
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
								onClick={() => this.handleDisApprove(purchaseRequest.id)}
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
								Purchase requests pending finance approval
							</h1>
						</div>
						<div className="table-responsive">
							<table className="table table-striped">
								<thead>
									<tr>
										<th>Staff</th>
										<th>Amount</th>
										<th>Supervisor</th>
										<th>Status</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{purchaseRequests.map((request) => {
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
												{request.ceo_comments ? (
													<td style={{ color: "red" }}>Rejected</td>
												) : request.ceo_approved ? (
													<td style={{ color: "green" }}>Approved</td>
												) : (
													<td style={{ color: "#ffbb00" }}>Under review</td>
												)}
												<td>
													<div
														className="btn btn-info btn-sm"
														onClick={() => this.handleView(request.id)}>
														View
													</div>

													{request.finance_approved && request.ceo_approved ? (
														<div
															className="btn btn-success btn-sm disabled"
															style={{ flex: 1 }}
															onClick={() => self.handleApprove(request.id)}>
															Approved
														</div>
													) : !request.finance_approved &&
													  !request.ceo_approved ? (
														<div
															className="btn btn-success btn-sm"
															style={{ flex: 1 }}
															onClick={() => self.handleApprove(request.id)}>
															Approve
														</div>
													) : null}

													{/* <div
														className='btn btn-success btn-sm'
														style={{ flex: 1 }}
														onClick={() => self.handleApprove(request.id)}>
														Approve
													</div> */}
													{request.finance_comments ? (
														<div
															className="btn btn-danger btn-sm disabled"
															style={{ flex: 1 }}>
															Disapproved
														</div>
													) : request.ceo_approved ? null : (
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
		logo: state.logo.logo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		financeApprove: () => dispatch(financeApprove()),
		getSpecificPurchaseData: (id) => dispatch(getSpecificPurchaseData(id)),
		requestFinanceStaff: (id) => dispatch(requestFinanceStaff(id)),
		requestLogo: () => dispatch(requestLogo()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PurchaseRequisitionFinance);
