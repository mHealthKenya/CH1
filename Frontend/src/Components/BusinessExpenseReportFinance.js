import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import axios from 'axios';
import {
	financeApprove,
	getSpecificPurchaseData,
} from '../Redux/Purchase/actions';
import { requestFinanceStaff } from '../Redux/General/actions';
import {
	BARFinanceApprove,
	getSpecificBARData,
	requestBusinessExpenseReports,
	getSpecificBERData,
} from '../Redux/BusinessAdvanceRequest/actions';
import { requestLogo } from '../Redux/mHealthImages/actions';

axios.defaults.baseURL = 'http://api-finance-docs.mhealthkenya.co.ke/api/';

export class BusinessExpenseReportFinance extends Component {
	state = {
		show: false,
		showDisapprove: false,
		approved: true,
		finance_comments: '',
	};
	componentDidMount = () => {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = auth.user.user;
			this.props.requestFinanceStaff(id);
			this.props.requestBusinessExpenseReports();
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

	handleView = (id) => {
		this.props.getSpecificBERData(id);
		this.setState({
			...this.state,
			show: true,
		});
	};

	handleDisApproveView = (id) => {
		this.props.getSpecificBERData(id);
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
		const url = `businessexpensereport/${id}/`;
		const body = {
			Finance_staff: finStaffID,
			approved: true,
			date_approved: new Date(),
			finance_comments: null,
		};
		axios.patch(url, body).then((res) => {
			const { id } = res.data;
			const url = `businessexpensereportfinance/?request=${id}`;
			axios.get(url).then((res) => {
				try {
					const { id } = res.data[0];
					const url = `businessexpensereportfinance/${id}/`;
					const body = {
						approved: true,
					};
					axios.patch(url, body).then((res) => console.log(res.data));
				} catch (err) {
					const url = 'businessexpensereportfinance/';

					const body = {
						finance_staff: finStaffID,
						request: id,
						approved: true,
					};
					axios.post(url, body).then((res) => {
						console.log(res.data);
					});
				}
			});
		});
	};

	handleDownload = (e) => {
		this.printDiv('test');
		this.setState({
			...this.state,
			show: false,
		});
	};

	handleDisApprove = (id) => {
		const { finance_comments } = this.state;
		const { finStaff } = this.props;
		const finStaffID = finStaff.financeStaff[0].id;
		const url = `businessexpensereport/${id}/`;
		const body = {
			Finance_staff: finStaffID,
			approved: false,
			date_approved: null,
			finance_comments: finance_comments,
		};
		axios.patch(url, body).then((res) => {
			const { id } = res.data;
			const url = `businessexpensereportfinance/?request=${id}`;
			axios.get(url).then((res) => {
				try {
					const { id } = res.data[0];
					const url = `businessexpensereportfinance/${id}/`;
					const body = {
						approved: false,
					};
					axios.patch(url, body).then(() => {
						this.setState({
							...this.state,
							showDisapprove: false,
						});
					});
				} catch (err) {
					const url = 'businessexpensereportfinance/';

					const body = {
						finance_staff: finStaffID,
						request: id,
						approved: false,
					};
					axios.post(url, body).then(() => {
						this.setState({
							...this.state,
							showDisapprove: false,
						});
					});
				}
			});
		});
	};

	render() {
		let self = this;
		const { show, showDisapprove } = this.state;
		const { auth, sBAR, specificBAR, logo } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className='testbox container'>
				<Modal
					show={show}
					size='lg'
					aria-labelledby='contained-modal-title-vcenter'
					centered>
					<div id='test'>
						<br />
						<div style={{ textAlign: 'center' }}>
							<img src={logo} width={500} height={100} alt='logo' />
							<br />
							<h2>Business Expense Report</h2>
						</div>
						<Modal.Body>
							<p className='lead'>
								<b>Purpose: </b>
								{specificBAR.purpose}
							</p>

							<p className='lead'>
								<b>Department: </b>
								{specificBAR.department_name}
							</p>

							<p className='lead'>
								<b>Requester: </b>
								{specificBAR.requester_name}
								<br />

								<b>Signature: </b>
								{specificBAR.staff_signature ? (
									<img
										src={specificBAR.staff_signature}
										height={50}
										width={40}
										alt='staff signature'
									/>
								) : null}
								<br />

								<b>Date: </b>
								{moment(specificBAR.date).format('YYYY - MM - DD')}
							</p>

							<p className='lead'>
								<b>Checked by: </b>
								{specificBAR.finance_name}
							</p>

							<p className='lead'>
								<b>Signature: </b>
								{specificBAR.finance_signature ? (
									<img
										src={specificBAR.finance_signature}
										height={50}
										width={40}
										alt='finance signature'
									/>
								) : null}
							</p>

							<p className='lead'>
								<b>Date Approved: </b>
								{specificBAR.date_approved
									? moment(specificBAR.date_approved).format('YYYY - MM - DD')
									: null}
							</p>
							<table className=' table '>
								<thead>
									<tr>
										<th>Receipt No.</th>
										<th>Date</th>
										<th>Description</th>
										<th>Total</th>
									</tr>
								</thead>

								<tbody>
									<tr>
										<td>{specificBAR.receipt_no}</td>
										<td>{moment(specificBAR.date).format('YYYY - MM - DD')}</td>
										<td>{specificBAR.description}</td>
										<td>{specificBAR.total}</td>
									</tr>

									<tr>
										<td></td>
										<td></td>
										<td>
											<b>Advance Issued</b>
										</td>
										<td>{specificBAR.advance_amount}</td>
									</tr>
									<tr>
										<td></td>
										<td></td>
										<td>
											<b>Total Reimbursement</b>
										</td>
										<td>{specificBAR.total_reimbursed}</td>
									</tr>
								</tbody>

								{/* <tbody style={{ float: "right" }}>
                  <tr>
                    <th>Advance Issued </th>
                    <td></td>
                    <td colSpan="3">{specificBAR.advance_amount}</td>
                    <th>Total Reimbursement: </th>

                    <td>{specificBAR.total_reimbursed}</td>
                  </tr>
                </tbody> */}
							</table>
							<p className='lead'>
								<b>Receipt: </b>
								<br />
								<img
									src={specificBAR.receipt}
									height={500}
									width={400}
									alt='receipt missing'
								/>
							</p>
						</Modal.Body>
					</div>
					<Modal.Footer>
						<div
							className='btn btn-outline btn-secondary'
							onClick={this.handleClose}>
							Close
						</div>
						<div
							className='btn btn-outline btn-primary'
							onClick={this.handleDownload}>
							Download
						</div>
					</Modal.Footer>
				</Modal>

				<Modal
					show={showDisapprove}
					size='lg'
					aria-labelledby='contained-modal-title-vcenter'
					centered>
					<Modal.Header closeButton>
						<Modal.Title id='contained-modal-title-vcenter'>
							{specificBAR.requester_name}'s Request
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className='lead'>
							Please give a reason for disapproving this request...
						</p>
						<textarea
							name='finance_comments'
							rows={4}
							onChange={this.handleChange}></textarea>
						<div className='flex-wrapper'>
							<span style={{ flex: 2, color: 'transparent' }}>
								This is to separate buttons
							</span>
							<button
								className='btn-block btn-success btn-sm'
								style={{ flex: 1 }}
								onClick={this.handleClose}>
								Cancel
							</button>
							<span style={{ color: 'transparent' }}>is</span>
							<button
								className='btn-block btn-danger sm'
								onClick={() => this.handleDisApprove(specificBAR.id)}
								style={{ flex: 1 }}>
								Disapprove
							</button>
						</div>
					</Modal.Body>
				</Modal>
				{isAuthenticated ? (
					<form>
						<div className='banner'>
							<h1 className='ml-2 mr-2'>
								Business advance requests pending finance approval
							</h1>
						</div>
						<div className='table-responsive'>
							<table className='table table-striped'>
								<thead>
									<tr>
										<th>Requester</th>
										<th>Advance</th>
										<th>Spent</th>
										<th>Reimbursement</th>
									</tr>
								</thead>
								<tbody>
									{sBAR.map((request) => {
										return (
											<tr key={request.id}>
												<td>{request.requester_name}</td>
												<td>{request.advance_amount}</td>
												<td>{request.total}</td>
												<td>{request.total_reimbursed}</td>
												<td>
													<div
														className='btn btn-info btn-sm'
														onClick={() => this.handleView(request.id)}>
														View
													</div>

													{request.approved ? (
														<div
															className='btn btn-secondary btn-sm'
															style={{ flex: 1 }}
															disabled>
															Approved
														</div>
													) : (
														<div
															className='btn btn-success btn-sm'
															style={{ flex: 1 }}
															onClick={() => self.handleApprove(request.id)}>
															Approve
														</div>
													)}
													{request.finance_comments ? (
														<div
															className='btn btn-danger btn-sm disabled'
															style={{ flex: 1 }}>
															Disapproved
														</div>
													) : (
														<div
															className='btn btn-danger btn-sm'
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
					<Redirect to='/auth/login' />
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
		requestBusinessExpenseReports: () =>
			dispatch(requestBusinessExpenseReports()),
		getSpecificPurchaseData: (id) => dispatch(getSpecificPurchaseData(id)),
		requestFinanceStaff: (id) => dispatch(requestFinanceStaff(id)),
		BARFinanceApprove: () => dispatch(BARFinanceApprove()),
		getSpecificBARData: (id) => dispatch(getSpecificBARData(id)),
		getSpecificBERData: (id) => dispatch(getSpecificBERData(id)),
		requestLogo: () => dispatch(requestLogo()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BusinessExpenseReportFinance);
