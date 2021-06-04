import React, { Component } from "react";
import { connect } from "react-redux";
import { userLogout } from "../Redux/Auth/actions";
import axios from "axios";
import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

export class Holder extends Component {
	state = {
		image: "",
	};
	componentDidMount = () => {
		const { auth } = this.props;
		const { activeTime } = auth;
		const url = `mhealthimages/?imagename=mhealthhomelogo`;
		axios.get(url).then((res) => {
			try {
				const { image } = res.data[0];
				this.setState({
					...this.state,
					image: image,
				});
			} catch (err) {
				console.log(err.message);
			}
		});

		if (new Date().getTime() >= activeTime) {
			this.props.userLogout();
		}
	};
	handleLogout = () => {
		this.props.userLogout();
	};

	render() {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		const { image } = this.state;
		if (isAuthenticated) {
			const { groups } = auth.user.user;
			return (
				<>
					<header id="header" className="header">
						<div className="container">
							<div id="logo" className="pull-left">
								<a href="/">
									<img src={image} alt="" title="" width={200} height={100} />
								</a>
							</div>

							<nav id="nav-menu-container">
								<ul className="nav-menu">
									<li>
										<a href="/">Home</a>
									</li>
									<li className="menu-has-children">
										<a href="/">My Documents</a>
										<ul>
											<li>
												<a href="/docs/mypurchaserequisitions">
													Purchase Requisitions
												</a>
											</li>
											<li>
												<a href="/docs/mytaxilogistics">Taxi Logistics</a>
											</li>
											<li>
												<a href="/docs/mybusinessadvance">Business Advance</a>
											</li>
											<li>
												<a href="/docs/mytravelauthorizations">
													Travel Authorization
												</a>
											</li>
											<li>
												<a href="/docs/myleaveapplications">
													Approved Leave Applications
												</a>
											</li>
										</ul>
									</li>
									<li className="menu-has-children">
										<a href="/">Finance Documents</a>
										<ul>
											<li>
												<a href="/docs/businessadvancerequest">
													Business Advance Request
												</a>
											</li>
											<li>
												<a href="/docs/taxilogistics">Taxi Logistics</a>
											</li>
											<li>
												<a href="/docs/travelauthorization">
													Travel Authorization
												</a>
											</li>
											<li>
												<a href="/docs/purchaserequisition">
													Purchase Requisition Form
												</a>
											</li>
										</ul>
									</li>
									<li className="menu-has-children">
										<a href="/">HR Documents</a>
										<ul>
											<li>
												<a href="/">My TimeSheets</a>
											</li>
											<li>
												<a href="/docs/offduty">OffDutyTime sheet</a>
											</li>
											<li>
												<a href="/">Non Project Work Time Sheet</a>
											</li>
											<li>
												<a href="/docs/timesheet">Regular Time Sheet</a>
											</li>
											<li>
												<a href="/docs/leaveform">Leave application</a>
											</li>
										</ul>
									</li>
									{groups.includes(1) ? (
										<li className="menu-has-children">
											<a href="/">Approve</a>
											<ul>
												<li>
													<a href="/docs/purchaserequisitionsupervisor">
														Purchase Requisitions
													</a>
												</li>
												<li>
													<a href="/docs/taxilogisticssupervisor">
														Taxi Logistic
													</a>
												</li>
												<li>
													<a href="/docs/businessadvancerequestsupervisor">
														Business Advance
													</a>
												</li>
												<li>
													<a href="/docs/travelauthorizationsupervisor">
														Travel Authorization
													</a>
												</li>
												<li>
													<a href="/docs/supervisorleave">Leave Applications</a>
												</li>
											</ul>
										</li>
									) : null}
									{groups.includes(2) ? (
										<li className="menu-has-children">
											<a href="/">Finance Aprrovals</a>
											<ul>
												<li>
													<a href="/docs/purchaserequisitionfinance">
														Purchase Requisitions
													</a>
												</li>
												<li>
													<a href="/docs/businessadvancerequestfinance">
														Business Advance
													</a>
												</li>
												<li>
													<a href="/docs/businessexpensereportfinance">
														Business Expense
													</a>
												</li>
												<li>
													<a href="/docs/taxilogisticsfinance">
														Taxi Logistics
													</a>
												</li>
												<li>
													<a href="/docs/travelauthorizationfinance">
														Travel Authorization
													</a>
												</li>
												<li>
													<a href="/docs/travelexpensereportfinance">
														Travel Expense
													</a>
												</li>
											</ul>
										</li>
									) : null}
									{groups.includes(3) ? (
										<li className="menu-has-children">
											<a href="/">CEO/COO</a>
											<ul>
												<li>
													<a href="/docs/purchaserequisitionceo">
														Purchase Requisitions
													</a>
												</li>
												<li>
													<a href="/docs/cooleave">
														Approve Leave Applications
													</a>
												</li>
											</ul>
										</li>
									) : null}
									<li>
										<a href="#" onClick={() => this.handleLogout()}>
											Logout
										</a>
									</li>
								</ul>
							</nav>
						</div>
					</header>
					{this.props.children}
					<a href="/" className="back-to-top">
						<i className="fa fa-chevron-up"></i>
					</a>
				</>
			);
		} else {
			return (
				<>
					<header id="header" className="header">
						<div className="container">
							<div id="logo" className="pull-left">
								<a href="/">
									<img src={image} alt="" title="" width={200} height={100} />
								</a>
							</div>

							<nav id="nav-menu-container">
								<ul className="nav-menu">
									<li className="menu-active">
										<a href="/">Home</a>
									</li>

									<li>
										<a href="/auth/register">Register</a>
									</li>
									<li>
										<a href="/auth/login">Login</a>
									</li>
								</ul>
							</nav>
						</div>
					</header>
					{this.props.children}
					<a href="/" className="back-to-top">
						<i className="fa fa-chevron-up"></i>
					</a>
				</>
			);
		}
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		userLogout: () => dispatch(userLogout()),
	};
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Holder);
