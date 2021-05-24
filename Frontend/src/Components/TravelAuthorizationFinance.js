import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "axios";
import {
	requestApprovedTravelAuthorizations,
	requestSpecificTravelAuthorization,
} from "../Redux/TravelAuthorization/actions";
import { requestLogo } from "../Redux/mHealthImages/actions";
import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

export class TravelAuthorizationFinance extends Component {
	state = {
		mie: null,
		lodging: null,
		show: false,
	};
	componentDidMount = () => {
		this.props.requestApprovedTravelAuthorizations();
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
	};

	handleView = (id) => {
		this.props.requestSpecificTravelAuthorization(id);
		this.setState({
			...this.state,
			show: true,
		});
	};

	handleClose = () => {
		this.setState({
			...this.state,
			show: false,
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
		const { auth, sTAS, specificTA, logo } = this.props;
		const { travelAuthorization, other } = specificTA;
		const { period, total } = travelAuthorization;
		const { supervisorTravelAuthorization } = sTAS;
		const { show, mie, lodging } = this.state;
		const { isAuthenticated } = auth;
		let times = [];
		for (let i = 0; i < parseInt(period); i++) {
			times.push(i);
		}
		return (
			<div className="container mb-3 mt-3">
				{isAuthenticated ? (
					<div>
						<Modal
							show={show}
							size="lg"
							aria-labelledby="contained-modal-title-vcenter"
							centered>
							<div id="report">
								{/* <Modal.Header closeButton onClick={this.handleClose}>
                  <Modal.Title id="contained-modal-title-vcenter"> */}
								<br />
								<div style={{ textAlign: "center" }}>
									<img src={logo} width={500} height={100} alt="logo" />
									<br />
									<h2>Travel Authorization Form</h2>
								</div>

								{/* </Modal.Title>
                </Modal.Header> */}
								<Modal.Body>
									<div className="table-responsive">
										<table className="table table-striped">
											<thead>
												<th>Date Submitted</th>
												<td>
													{moment(travelAuthorization.date).format(
														"YYYY - MM - DD"
													)}
												</td>
												<th>Traveller Mobile No.</th>
												<td>{travelAuthorization.staff_phone}</td>
											</thead>
											<thead>
												<th>Department</th>
												<td>{travelAuthorization.staff_department}</td>
												<th>Traveller</th>
												<td>{travelAuthorization.staff_name}</td>
												<td>
													<img
														src={travelAuthorization.staff_signature}
														alt="signature is here"
														width={50}
														height={50}
													/>
												</td>
											</thead>
											<thead>
												<th>Destination</th>
												<td>{travelAuthorization.destination}</td>
												<th>Requirements</th>
												{travelAuthorization.taxi ? <td>Taxi</td> : null}
												{travelAuthorization.airticket ? (
													<td>Air Ticket</td>
												) : null}
												{travelAuthorization.accommodation ? (
													<td>Accommodation</td>
												) : null}
											</thead>
											<thead>
												<th>Purpose</th>
												<td>{travelAuthorization.purpose}</td>
											</thead>
											<thead>
												<th>Travel Period</th>
												<td>{travelAuthorization.period} days </td>
											</thead>
											<thead>
												<th>Project to Charger</th>
												<td>{travelAuthorization.project_name} </td>
											</thead>
											<thead>
												<th>Approved by</th>
												<td>{travelAuthorization.supervisor_name}</td>
												<td>
													{" "}
													<img
														src={travelAuthorization.supervisor_signature}
														alt="supervisor signature"
														width={50}
														height={50}
													/>
												</td>
												<td>
													{moment(travelAuthorization.date_approved).format(
														"YYYY - MM - DD"
													)}
												</td>
											</thead>
											<br />
											<thead>
												<tr>
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
													<td colSpan="5">
														<b>Total Expenses: Ksh. {total}</b>
													</td>
												</tr>
												{other.length > 0 ? (
													<tr>
														<td colSpan="5">
															<b>Other Expenses: Ksh. {other[0].amount}</b>
														</td>
													</tr>
												) : (
													<td colSpan="5">
														<b>Other Expenses: Ksh. 0</b>
													</td>
												)}
												{other.length > 0 ? (
													<tr>
														<td colSpan="5">
															<b>Grand Total: Ksh. {other[0].amount + total}</b>
														</td>
													</tr>
												) : (
													<tr>
														<td colSpan="5">
															<b>Grand Total: Ksh. {total}</b>
														</td>
													</tr>
												)}
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
						<form>
							<div className="banner">
								<h1 className="ml-2 mr-2">View Travel Authorizations</h1>
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
										{supervisorTravelAuthorization.map((request) => {
											return (
												<tr key={request.id}>
													<td>{request.staff_name}</td>
													<td>{request.total}</td>

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
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</form>
					</div>
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
		sTAS: state.sTAS,
		specificTA: state.specificTA,
		logo: state.logo.logo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestApprovedTravelAuthorizations: () =>
			dispatch(requestApprovedTravelAuthorizations()),
		requestSpecificTravelAuthorization: (id) =>
			dispatch(requestSpecificTravelAuthorization(id)),
		requestLogo: () => dispatch(requestLogo()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TravelAuthorizationFinance);
