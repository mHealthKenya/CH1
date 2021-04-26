import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { requestDepartments } from '../Redux/Departments/actions';

axios.defaults.baseURL = 'http://api-finance-docs.mhealthkenya.co.ke/';

export class Register extends Component {
	state = {
		redirect: false,
		first_name: '',
		last_name: '',
		email: '',
		staff_id: '',
		password: '',
		password2: '',
		signature: '',
		department: '',
		phone_number: '',
		loading: false,
		error: null,
		departments: [],
	};

	componentDidMount = () => {
		const url = 'departments/';
		axios.get(url).then((res) => {
			const { data } = res;
			this.setState({
				...this.setState,
				departments: data,
			});
		});
		this.props.requestDepartments();
		console.log(this.props.departments);
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			...this.state,
			[name]: value,
		});
	};
	handleSignature = (e) => {
		let name = e.target.name;
		let file = e.target.files[0];
		this.setState({
			...this.state,
			[name]: file,
		});
	};

	handleRegister = (e) => {
		e.preventDefault();
		const {
			first_name,
			last_name,
			email,
			phone_number,
			department,
			staff_id,
			password,
			password2,
			signature,
		} = this.state;
		const fd = new FormData();
		fd.append('staff_id', staff_id);
		fd.append('password', password);
		fd.append('password2', password2);
		fd.append('email', email);
		fd.append('first_name', first_name);
		fd.append('last_name', last_name);
		fd.append('signature', signature);
		fd.append('phone_number', phone_number);
		fd.append('department', department);
		this.setState({
			...this.state,
			loading: true,
		});

		const url = 'http://api-finance-docs.mhealthkenya.co.ke/auth/api/register/';
		axios
			.post(url, fd)
			.then(() => {
				this.setState({
					...this.state,
					loading: false,
					redirect: true,
				});
			})
			.catch((err) => {
				this.setState({
					...this.state,
					error: err.message,
					loading: false,
				});
			});
	};

	render() {
		const { departments, auth } = this.props;
		const { MHKdepartments } = departments;
		const { isAuthenticated } = auth;
		const { password, password2, redirect, loading, error } = this.state;
		return (
			<div className='testbox container'>
				{redirect && !loading && !error ? (
					<Redirect to='/auth/login' />
				) : !isAuthenticated ? (
					<form>
						<div className='banner'>
							<h1>New Member Registration</h1>
						</div>
						<div>
							{/* You can set className='colums' to put the forms in rows... */}
							<div className='item'>
								<label htmlFor='fname'>
									{' '}
									First Name<span>*</span>
								</label>
								<input
									id='fname'
									type='text'
									name='first_name'
									required
									onChange={this.handleChange}
								/>
							</div>
							<div className='item'>
								<label htmlFor='lname'>
									{' '}
									Last Name<span>* </span>
								</label>
								<input
									id='lname'
									type='text'
									name='last_name'
									required
									onChange={this.handleChange}
								/>
							</div>
							<div className='item'>
								<label htmlFor='address1'>
									Staff ID<span>*</span>
								</label>
								<input
									id='staff_id'
									type='text'
									name='staff_id'
									required
									onChange={this.handleChange}
								/>
							</div>
							<div className='item'>
								<label htmlFor='address2'>
									Email <span>*</span>
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
								<label htmlFor='phone'>
									Phone Number<span>*</span>
								</label>
								<input
									id='phone_number'
									type='text'
									name='phone_number'
									required
									onChange={this.handleChange}
								/>
							</div>
							<div className='item'>
								<label htmlFor='department'>
									Department<span>*</span>
								</label>
								<select name='department' onChange={this.handleChange}>
									{MHKdepartments.map((department) => {
										return (
											<option key={department.id} value={department.id}>
												{department.department}
											</option>
										);
									})}
								</select>
							</div>

							<div className='item'>
								<label htmlFor='signature'>
									Signature<span>*</span>
								</label>
								<input
									id='signature'
									type='file'
									name='signature'
									required
									onChange={this.handleSignature}
								/>
							</div>
							<div className='item'>
								<label htmlFor='password'>
									Password<span>*</span>
								</label>
								<input
									id='password'
									type='password'
									name='password'
									value={password}
									required
									onChange={this.handleChange}
								/>
							</div>
							<div className='item'>
								<label htmlFor='password2'>
									Confirm password<span>*</span>
								</label>
								<input
									id='password2'
									type='password'
									name='password2'
									value={password2}
									required
									onChange={this.handleChange}
								/>
							</div>
						</div>
						{!error && loading ? (
							<CircularProgress />
						) : !error && !loading ? (
							<div className='btn-block'>
								<button onClick={this.handleRegister}>Register</button>
							</div>
						) : null}
					</form>
				) : (
					<Redirect to='/' />
				)}
			</div>
		);
	}
}

export const mapStateToProps = (state) => {
	return {
		departments: state.departments,
		auth: state.auth,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		requestDepartments: () => dispatch(requestDepartments()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
