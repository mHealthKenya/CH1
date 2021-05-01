import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { userLogin } from '../Redux/Auth/actions';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

export class Login extends Component {
	state = {
		redirect: false,
		email: '',
		password: '',
		show: false,
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			...this.state,
			[name]: value,
		});
	};

	handleLogin = (e) => {
		e.preventDefault();
		const { email, password } = this.state;
		this.props.userLogin(email, password);
		this.setState({
			...this.state,
			show: true,
		});

		setTimeout(() => {
			this.setState({
				...this.state,
				show: false,
			});
		}, 5000);
	};
	render() {
		const { auth } = this.props;
		const { isAuthenticated, loading, error } = auth;
		const { show } = this.state;
		if (!isAuthenticated) {
			return (
				<div className='testbox container mt-3 mb-3'>
					<form>
						<div className='banner'>
							<h1>Login to your account</h1>
						</div>
						<div>
							{/* You can set className='colums' to put the forms in rows... */}
							<div className='item'>
								<label htmlFor='email'>
									{' '}
									Email<span>*</span>
								</label>
								<input
									id='email'
									type='email'
									name='email'
									required
									onChange={this.handleChange}
								/>
							</div>
							<div className='item'>
								<label htmlFor='password'>
									{' '}
									Password<span>*</span>
								</label>
								<input
									id='password'
									type='password'
									name='password'
									required
									onChange={this.handleChange}
								/>
							</div>
						</div>
						{show && !loading && error ? (
							<div className='alert alert-danger'>
								Incorrect credentials. If you entered your correct credentials,
								please contact support.
							</div>
						) : null}
						{loading ? (
							<CircularProgress />
						) : !show && !loading ? (
							<div>
								<div className='btn-block' style={{ flex: 1 }}>
									<button onClick={this.handleLogin}>Login</button>{' '}
									<small>
										Or register <a href='/auth/register'>here</a>
									</small>
								</div>
							</div>
						) : null}
					</form>
				</div>
			);
		} else {
			return <Redirect to='/' />;
		}
	}
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		userLogin: (email, password) => dispatch(userLogin(email, password)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
