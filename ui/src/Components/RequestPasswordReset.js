import React, { Component } from "react";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

export class RequestPasswordReset extends Component {
	state = {
		email: "",
		loading: false,
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
		const url = "http://127.0.0.1:8000/auth/api/request/password/reset/";
		const body = {
			email: email,
		};
		axios.post(url, body).then((res) => {
			console.log(res.data);
		});
	};

	render() {
		const { email, loading } = this.state;
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className="testbox container mt-3 mb-3">
				{!isAuthenticated ? (
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
								{email.endsWith("@mhealthkenya.org") ? null : (
									<small style={{ color: "red" }}>
										Please enter a valid mHealthKenya Email
									</small>
								)}
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
							) : (
								<div className="btn-block disabled">
									<button onClick={this.handleSubmit}>Submit</button> or
									<a href="/auth/login/" style={{ color: "#5bc0de" }}>
										{" "}
										Log In Here.
									</a>
								</div>
							)}
						</div>
					</form>
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
