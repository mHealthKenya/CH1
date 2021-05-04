import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

export class CheckMail extends Component {
	render() {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className="testbox container mt-3 mb-3">
				<br />
				{!isAuthenticated ? (
					<form>
						<div className="banner">
							<h1>Success!</h1>
						</div>
						<p className="lead" style={{ color: "green" }}>
							Your account was successfully registered.
							<br />
							Please check your email and click the activation link to activate
							your account.
							<br />
							If you did not receive an email from us, please check your spam
							folder.
						</p>
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

export default connect(mapStateToProps)(CheckMail);
