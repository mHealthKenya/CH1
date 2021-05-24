import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}`;

export class ResetPassword extends Component {
	state = {
		requestLoading: false,
		redirect: false,
		error: null,
		show: false,
	};

	handleChange = (e) => {
		let { name } = e.target;
		let { value } = e.target;

		this.setState({
			...this.state,
			[name]: value,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({
			...this.state,
			requestLoading: true,
		});
		const { resetcode, password } = this.state;
		const code = resetcode.split("/");
		if (resetcode.includes("/")) {
			const uidb64 = code[0];
			const token = code[1];
			console.log(password, uidb64, token);
			const url = `${basePath}auth/api/passwordreset/complete/`;
			const body = {
				password,
				uidb64,
				token,
			};
			axios
				.patch(url, body)
				.then(() => {
					this.setState({
						...this.state,
						redirect: true,
						requestLoading: false,
					});
				})
				.catch((err) => {
					this.setState({
						...this.state,
						show: true,
						error: err.message,
						requestLoading: false,
					});
					setTimeout(() => {
						this.setState({
							...this.state,
							show: false,
						});
					}, 5000);
				});
		} else {
			this.setState({
				...this.state,
				show: true,
				error: "Invalid link",
			});
			setTimeout(() => {
				this.setState({
					...this.state,
					show: false,
				});
			}, 5000);
		}
	};

	render() {
		const {
			requestLoading,
			redirect,
			error,
			show,
			password,
			password2,
			resetcode,
		} = this.state;
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		return (
			<div className="testbox container">
				{!isAuthenticated ? (
					<>
						{!redirect ? (
							<form>
								<div className="banner">
									<h1>Change Password</h1>
								</div>
								<div>
									{/* You can set className='colums' to put the forms in rows... */}
									<div className="item">
										<label htmlFor="resetcode">
											{" "}
											Reset Code<span>*</span>
										</label>
										<input
											id="resetcode"
											type="password"
											name="resetcode"
											required
											placeholder="Copy and paste the reset code from your email here."
											onChange={this.handleChange}
										/>
									</div>
									<div className="item">
										<label htmlFor="password">
											{" "}
											Password<span>*</span>
										</label>
										<input
											id="password"
											type="password"
											name="password"
											placeholder="Enter new password"
											required
											onChange={this.handleChange}
										/>
										<small>
											<p>Your password must be between 8 and 30 characters.</p>
											<p>
												Your password must contain at least one uppercase, and
												one lowercase letter (ex: A, a, etc.).
											</p>
											<p>
												Your password must contain at least one number digit
												(ex: 0, 1, 2, 3, etc.)
											</p>
											<p>
												Your password must contain at least one special
												character -for example: $, #, @, !,%,^,&,*,(,)
											</p>
										</small>
									</div>
									<div className="item">
										<label htmlFor="password2">
											{" "}
											Confirm Password<span>*</span>
										</label>
										<input
											id="password2"
											type="password"
											name="password2"
											placeholder="Confirm new password"
											required
											onChange={this.handleChange}
										/>
									</div>
								</div>
								{show && error ? (
									<div className="alert alert-danger">
										Invalid password reset link. Please request a new link or
										contact support
									</div>
								) : null}
								{requestLoading ? (
									<span
										className="spinner-border spinner-border-sm"
										role="status"
										aria-hidden="true"></span>
								) : resetcode &&
								  password &&
								  password2 &&
								  password === password2 ? (
									<div className="btn-block">
										<button onClick={this.handleSubmit}>Submit</button>
									</div>
								) : (
									<p className="lead">
										All fields must be correctly filled before submitting.
									</p>
								)}
							</form>
						) : (
							<Redirect to="/auth/login" />
						)}{" "}
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

export default connect(mapStateToProps)(ResetPassword);
