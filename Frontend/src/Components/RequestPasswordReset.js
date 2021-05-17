import React, { Component } from "react";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

export class RequestPasswordReset extends Component {
	state = {
		email: "",
		loading: false,
		error: null,
		redirect: false,
	};

	handleChange = (e) => {
		let name = e.target.name;
		let value = e.target.value;
		this.setState({
			...this.state,
			[name]: value,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { email } = this.state;
		this.setState({
			...this.state,
			loading: true,
		});
		const url =
			"http://forms.mhealthkenya.co.ke/auth/api/request/password/reset/";
		const body = {
			email: email,
		};
		axios.post(url, body).then((res) => {
			this.setState({
				...this.state,
				redirect: true,
				loading: false,
			});
		});
	};

	render() {
		const { email, loading, redirect } = this.state;
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className="testbox container mt-3 mb-3">
				{!isAuthenticated ? (
					<>
						{!redirect ? (
							<form>
								<div className="banner">
									<h1>Request Password Reset</h1>
								</div>
								<div>
									<div className="item">
										<label htmlFor="email">
											{" "}
											Email<span>*</span>
										</label>
										<input
											id="email"
											type="email"
											name="email"
											value={email}
											required
											placeholder="Enter your email"
											onChange={this.handleChange}
										/>
									</div>
								</div>
								<div className="item">
									{loading ? (
										<div className="btn-block disabled">
											<Spinner
												as="span"
												animation="grow"
												size="sm"
												role="status"
												aria-hidden="true"
											/>
											Requesting...
										</div>
									) : email.endsWith("@mhealthkenya.org") ? (
										<div className="btn-block">
											<button onClick={this.handleSubmit}>Submit</button> or
											<a href="/auth/login/" style={{ color: "#5bc0de" }}>
												{" "}
												Log In Here.
											</a>
										</div>
									) : (
										<p className="lead">Input a valid mHealth Kenya email</p>
									)}
								</div>
							</form>
						) : (
							<Redirect to="/auth/checkmail" />
						)}
					</>
				) : (
					<Redirect to="/" />
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

export default connect(mapStateToProps)(RequestPasswordReset);
