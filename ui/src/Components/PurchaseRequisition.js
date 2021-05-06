import React, { Component } from "react";
import { connect } from "react-redux";
import { makePurchaseRequest } from "../Redux/Purchase/actions";
import {
	requestAccountCodes,
	requestSupervisors,
} from "../Redux/General/actions";
import { Redirect } from "react-router-dom";
import { Modal } from "antd";

export class PurchaseRequisition extends Component {
	state = {
		requested_by: null,
		activity: "",
		description: "",
		amount: "",
		reviewing_supervisor: "",
		show: false,
		redirect: false,
	};

	componentDidMount = () => {
		this.props.requestAccountCodes();
		this.props.requestSupervisors();
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = auth.user.user;
			this.setState({
				...this.state,
				requested_by: id,
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

	handleClose = () => {
		this.setState({
			...this.state,
			activity: "",
			description: "",
			amount: "",
			reviewing_supervisor: "",
			show: false,
			redirect: true,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { accounts } = this.props;
		const { accountCodes } = accounts;
		const account_code = accountCodes[0].id;
		const {
			activity,
			description,
			amount,
			reviewing_supervisor,
			requested_by,
		} = this.state;
		this.props.makePurchaseRequest(
			activity,
			description,
			amount,
			account_code,
			reviewing_supervisor,
			requested_by
		);

		this.setState({
			...this.state,
			show: true,
		});

		// console.log(this.state);
		// console.log("code", account_code);
	};

	render() {
		const { auth, makePurchase, supervisor } = this.props;
		const { purchaseRequistionError } = makePurchase;
		const { isAuthenticated } = auth;
		const { show, description, amount, activity, redirect } = this.state;
		const { supervisors } = this.props.supervisors;
		let eligibleSupervisors = [];
		if (supervisor.length > 0) {
			const currentSupervisor = supervisor[0].id;
			eligibleSupervisors = supervisors.filter(
				(element) => element.id !== currentSupervisor
			);
		} else {
			eligibleSupervisors = supervisors;
		}
		return (
			<div className="testbox container mt-3 mb-3">
				{isAuthenticated ? (
					<>
						{!redirect ? (
							<form>
								<div>
									{purchaseRequistionError ? (
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
											</p>
										</Modal>
									) : show && !purchaseRequistionError ? (
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
												Purchase Requisition successfully submitted
											</p>
										</Modal>
									) : null}
									<div className="banner">
										<h1>Purchase Requisition</h1>
									</div>
									<div>
										{/* You can set className='colums' to put the forms in rows... */}
										<div className="item">
											<label htmlFor="activity">
												{" "}
												Activity<span>*</span>
											</label>
											<input
												id="activity"
												type="text"
												name="activity"
												value={activity}
												required
												onChange={this.handleChange}
											/>
										</div>
										<div className="item">
											<label htmlFor="description">
												{" "}
												Description<span>*</span>
											</label>
											<textarea
												id="description"
												type="date"
												name="description"
												value={description}
												required
												onChange={this.handleChange}
											/>
										</div>
										<div className="item">
											<label htmlFor="amount">
												{" "}
												Amount in Ksh<span>*</span>
											</label>
											<input
												id="amount"
												type="number"
												name="amount"
												value={amount}
												required
												onChange={this.handleChange}
											/>
										</div>
										<div className="item">
											<label htmlFor="amount">
												{" "}
												Supervisor<span>*</span>
											</label>
											<select
												name="reviewing_supervisor"
												onChange={this.handleChange}>
												<option>Select your supervisor</option>
												{eligibleSupervisors.map((supervisor) => {
													return (
														<option key={supervisor.id} value={supervisor.id}>
															{supervisor.supervisor_name}
														</option>
													);
												})}
											</select>
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
		accounts: state.accounts,
		supervisors: state.supervisors,
		supervisor: state.supervisor.supervisor,
		makePurchase: state.makePurchase,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		makePurchaseRequest: (
			activity,
			description,
			amount,
			account_code,
			reviewing_supervisor,
			requested_by
		) =>
			dispatch(
				makePurchaseRequest(
					activity,
					description,
					amount,
					account_code,
					reviewing_supervisor,
					requested_by
				)
			),
		requestAccountCodes: () => dispatch(requestAccountCodes()),
		requestSupervisors: () => dispatch(requestSupervisors()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PurchaseRequisition);
