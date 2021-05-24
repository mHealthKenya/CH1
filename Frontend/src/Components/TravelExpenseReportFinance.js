import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "axios";
import {
	requestTravelExpense,
	getSpecificTravelExpenseData,
} from "../Redux/TravelExpense/actions";
import { financeApprove } from "../Redux/Purchase/actions";
import { requestFinanceStaff } from "../Redux/General/actions";
import { requestLogo } from "../Redux/mHealthImages/actions";
import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

export class TravelExpenseReportFinance extends Component {
	state = {
		show: false,
		showDisapprove: false,
		approved: true,
		finance_comments: "",
		mie: 0,
		lodging: 0,
		times: [],
		amount: "",
		showAmount: false,
		showDownload: false,
	};
	componentDidMount = () => {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = auth.user.user;
			this.props.requestFinanceStaff(id);
			this.props.requestTravelExpense();
			this.props.requestLogo();
			const url = "lodgingmie/";
			axios.get(url).then((res) => {
				const { data } = res;
				const { mie, lodging } = data[0];
				this.setState({
					...this.state,
					mie: mie,
					lodging: lodging,
				});
			});
		}
	};

	handleView = (id) => {
		// const { TES } = this.props;
		// const { mie, lodging } = this.state;
		// const { period } = TES;
		// const times = parseInt(period[0]);
		this.props.getSpecificTravelExpenseData(id);

		this.setState({
			...this.state,
			show: true,
		});
	};

	// handleGenerate = (id) => {
	//   this.props.getSpecificTravelExpenseData(id);
	//   this.setState({
	//     ...this.state,
	//     generate: true,
	//   });
	// };

	handleTotal = () => {
		const { TES } = this.props;
		const { mie, lodging } = this.state;
		const { period } = TES;
		const times = parseInt(period[0]);
		if (times > 1) {
			this.setState({
				...this.state,
				showAmount: true,
				showDownload: true,
				amount: (mie + lodging) * times - 6700,
			});
		}
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

	handleTest = () => {
		const { TES } = this.props;
		const { period } = TES;
		const times = parseInt(period[0]);
		if (times > 1) {
			this.setState({
				...this.state,
				amount: 100,
			});
		}
	};

	handleClose = () => {
		this.setState({
			...this.state,
			show: false,
			showDisapprove: false,
			showAmount: false,
			showDownload: false,
		});

		console.log(this.state.times);
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
			date_finace_officer_review: null,
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
		const { show, showDisapprove, mie, lodging } = this.state;
		const { purchase, auth, travelExpense, TES, otherTES, logo } = this.props;
		const { period, date, receipt_no, total } = TES;
		let times = [];
		try {
			const date_requested = date[0];
			// const date_requested = new Date();

			let today = new Date(date_requested);
			const days = period[0];
			for (let i = 0; i < parseInt(days); i++) {
				times.push(new Date(today.setDate(new Date().getDate() + i)));
			}
		} catch (err) {
			console.log(err.message);
		}

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
							<h2>Travel Expense Report</h2>
						</div>
						<Modal.Body>
							{TES.purpose ? (
								<div className="row ml-3 mr-3">
									<div className="column">
										<p className="lead">
											<b>Purpose : </b>
											{TES.purpose ? TES.purpose[0] : null}
										</p>

										<p className="lead">
											<b>Department : </b>
											{TES.department_name}
										</p>

										<p className="lead">
											<b>Traveller : </b>
											{TES.staff_name}
										</p>

										<p className="lead">
											<b>Signature : </b>
											<img
												src={TES.staff_signature}
												alt="signature is here"
												width={50}
												height={50}
											/>
										</p>

										<p className="lead">
											<b>Date : </b>
											{moment(TES.date[0]).format("YYYY - MM - DD")}
										</p>
									</div>
									<div className="column">
										<p className="lead">
											<b>Travel Period : </b>
											{TES.period} days
										</p>
										<p className="lead">
											<b>Supervisor: </b>
											{TES.supervisor_name}
										</p>

										<p className="lead">
											<b>Supervisor Signature : </b>
											<img
												src={TES.supervisor_signature}
												alt="signature is here"
												width={50}
												height={50}
											/>
										</p>

										<p className="lead">
											<b>Date Approved : </b>
											{moment(TES.date_approved[0]).format("YYYY - MM - DD")}
										</p>
									</div>
								</div>
							) : null}
							<div className="table-responsive">
								<table className="table table-striped">
									<thead>
										<tr>
											<th>Receipt No.</th>
											<th>Day</th>
											<th>Description</th>
											<th>Lodging</th>
											<th>M&IE</th>
											<th>Total</th>
										</tr>
									</thead>
									<tbody>
										{times.map((time, index) => {
											return (
												<tr key={index}>
													<td>{receipt_no}</td>
													<td>{index + 1}</td>
													{index === 0 ? (
														<td>Accomodation and 75% of MIE</td>
													) : index === times.length - 1 ? (
														<td>Last day of travel and 75% of MIE</td>
													) : (
														<td> Accommodation and MIE</td>
													)}

													{index === 0 && time.length === 1 ? (
														<td>0</td>
													) : index === 0 && time.length > 1 ? (
														<td>{0.75 * mie}</td>
													) : index === times.length - 1 ? (
														<td>0</td>
													) : (
														<td> {lodging} </td>
													)}

													{index === 0 ? (
														<td>{0.75 * mie}</td>
													) : index === times.length - 1 ? (
														<td>{0.75 * mie}</td>
													) : (
														<td>{mie}</td>
													)}

													{index === 0 && times.length > 1 ? (
														<td>{lodging + 0.75 * mie}</td>
													) : index === 0 && times.length === 1 ? (
														<td>{0.75 * mie} </td>
													) : index === times.length - 1 ? (
														<td>{0.75 * mie} </td>
													) : (
														<td>{mie + lodging}</td>
													)}
												</tr>
											);
										})}
										<br />
										<tr>
											<td></td>
											<td></td>
											<td></td>

											<td colSpan="3">
												<b> Total Expenses: {total}</b>
											</td>
										</tr>
									</tbody>
								</table>
								{otherTES.length > 0 ? (
									<table className="table table-striped">
										<thead>
											<tr>
												<td colSpan="3">
													<h3>Other Expenses</h3>
												</td>
											</tr>
											<tr>
												<th>Receipt Number</th>
												<th>Description</th>
												<th>Amount</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>{otherTES[0].receipt_no}</td>
												<td>{otherTES[0].description}</td>
												<td>{otherTES[0].amount}</td>
											</tr>
										</tbody>
									</table>
								) : null}
								{otherTES.length > 0 ? (
									<table>
										<thead>
											<tr>
												<th>
													Grand Total:{" "}
													{parseInt(total) + parseInt(otherTES[0].amount)}
												</th>
											</tr>
										</thead>
									</table>
								) : (
									<table>
										<thead>
											<tr>
												<th>Grand Total: {parseInt(total)}</th>
											</tr>
										</thead>
									</table>
								)}
							</div>
							<hr />
							<div>
								<img src={TES.receipt} alt="Ensure a receipt is attaced" />
							</div>
							{otherTES.length > 0 ? (
								<div>
									<img
										src={otherTES[0].receipt}
										alt="Ensure a receipt is attaced"
									/>
								</div>
							) : null}
						</Modal.Body>{" "}
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
								Travel Expense Report Pending Finance Approval
							</h1>
						</div>
						<div className="table-responsive">
							<table className="table table-striped">
								<thead>
									<tr>
										<th>Staff</th>
										{/* <th>Date From</th> */}
										{/* <th>Date To</th> */}
										<th>Purpose</th>
										<th>Supervisor</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{travelExpense.map((request) => {
										return (
											<tr key={request.id}>
												<td>{request.staff_name}</td>
												{/* <td>
                          {moment(request.date[0]).format("YYYY - MM - DD")}
                        </td> */}
												{/* <td>
                          {moment(
                            new Date(request.date[0]).setDate(
                              new Date(request.date[0])
                            )
                          ).format("YYYY - MM - DD")}
                        </td> */}
												<td>{request.purpose[0]}</td>
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
		travelExpense: state.travelExpense.travelExpense,
		TES: state.TES.TES,
		otherTES: state.TES.otherTES,
		logo: state.logo.logo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		financeApprove: () => dispatch(financeApprove()),
		getSpecificTravelExpenseData: (id) =>
			dispatch(getSpecificTravelExpenseData(id)),
		requestFinanceStaff: (id) => dispatch(requestFinanceStaff(id)),
		requestTravelExpense: () => dispatch(requestTravelExpense()),
		requestLogo: () => dispatch(requestLogo()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TravelExpenseReportFinance);
