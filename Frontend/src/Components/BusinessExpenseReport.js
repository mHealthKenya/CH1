import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Modal } from "antd";
import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

export class BusinessExpenseReport extends Component {
	state = {
		amount: 0,
		total: 0,
		request: null,
		purpose: "",
		total_reimbursed: 0,
		receipt: "",
		receipt_no: "",
		show: false,
		error: null,
		redirect: false,
	};

	componentDidMount = () => {
		const { ID } = this.props.match.params;
		const url = `businessadvancerequestfinance/?request=${ID}`;
		axios.get(url).then((res) => {
			const { amount, id } = res.data[0];
			this.setState({
				...this.state,
				amount: amount,
				request: id,
			});
		});
	};

	handleClose = () => {
		this.setState({
			...this.state,
			show: false,
			redirect: true,
		});
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			...this.state,
			[name]: value,
		});
	};

	handleReceipts = (e) => {
		const name = e.target.name;
		const file = e.target.files[0];
		this.setState({
			...this.state,
			[name]: file,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { amount, total, request, purpose, receipt, receipt_no } = this.state;
		const total_reimbursed = total - amount;
		const fd = new FormData();
		fd.append("total", total);
		fd.append("request", request);
		fd.append("receipt", receipt);
		fd.append("total_reimbursed", total_reimbursed);
		fd.append("receipt_no", receipt_no);
		fd.append("purpose", purpose);
		const url = `businessexpensereport/`;
		axios
			.post(url, fd)
			.then((res) => {
				this.setState({
					...this.state,
					show: true,
					error: null,
				});
			})
			.catch((err) => {
				this.setState({
					...this.state,
					show: true,
					error: err.message,
				});
			});
	};

	render() {
		const { amount, total, error, show, redirect } = this.state;
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className="testbox container mt-3 mb-3">
				{isAuthenticated ? (
					<>
						{!redirect ? (
							<form>
								<div>
									{error ? (
										<Modal
											title={<h2 style={{ color: "red" }}>Oops!</h2>}
											visible={show}
											// onOk={handleOk}
											// onCancel={handleCancel}
											footer={[
												<div
													className="btn btn-success btn-sm"
													onClick={this.handleClose}>
													Close
												</div>,
											]}>
											<p className="lead" style={{ color: "red" }}>
												We encountered a problem. Please try again.
												<br />
												If the problem persists please contact support.
												<br />
												{error}
											</p>
										</Modal>
									) : show && !error ? (
										<Modal
											title={<h2 style={{ color: "blue" }}>Success</h2>}
											visible={show}
											// onOk={handleOk}
											// onCancel={handleCancel}
											footer={[
												<div
													className="btn btn-success btn-sm"
													onClick={this.handleClose}>
													Close
												</div>,
											]}>
											<p className="lead">
												Business Expense successfully submitted
											</p>
										</Modal>
									) : null}

									<div className="banner">
										<h1>Business Expense Report</h1>
									</div>
									<div>
										{/* You can set className='colums' to put the forms in rows... */}
										<div className="item">
											<label htmlFor="purpose">
												{" "}
												Purpose<span>*</span>
											</label>
											<input
												id="purpose"
												type="text"
												name="purpose"
												onChange={this.handleChange}
												required
											/>
										</div>
										<div className="item">
											<label htmlFor="receipt_no">
												{" "}
												Receipt Number<span>*</span>
											</label>
											<input
												id="receipt_no"
												type="text"
												name="receipt_no"
												onChange={this.handleChange}
												required
											/>
										</div>
										<div className="item">
											<label htmlFor="amount">
												{" "}
												Amount in Ksh<span>*</span>
											</label>
											<input
												id="total"
												type="number"
												name="total"
												onChange={this.handleChange}
												required
											/>
										</div>
										<div className="item">
											<label htmlFor="advance"> Advance issued</label>
											<input
												id="amount"
												type="number"
												name="amount"
												value={amount}
												onChange={this.handleChange}
												disabled
											/>
										</div>
										<div className="item">
											<label htmlFor="reimbursement">
												{" "}
												Total reimbursement
											</label>
											<input
												id="total_reimbursed"
												type="number"
												name="total_reimbursed"
												value={total - amount}
												disabled
											/>
										</div>
										<div className="item">
											<label htmlFor="receipt">
												{" "}
												Upload receipt<span>*</span>
											</label>
											<input
												id="receipt"
												type="file"
												name="receipt"
												onChange={this.handleReceipts}
												required
											/>
										</div>
									</div>
									<div className="btn-block">
										<button onClick={this.handleSubmit}>Submit</button>
									</div>
								</div>
							</form>
						) : (
							<Redirect to="/" />
						)}
					</>
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
	};
};

export default connect(mapStateToProps)(BusinessExpenseReport);
