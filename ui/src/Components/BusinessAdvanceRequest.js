import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import {
	requestAccountCodes,
	requestSupervisors,
} from '../Redux/General/actions';
import { requestProjects } from '../Redux/Projects/actions';
import { makeBusinessAdvanceRequest } from '../Redux/BusinessAdvanceRequest/actions';
import { Modal } from 'antd';

export class BusinessAdvanceRequest extends Component {
	state = {
		amount: null,
		description: '',
		project: null,
		supervisor: null,
		show: false,
	};
	componentDidMount = () => {
		this.props.requestAccountCodes();
		this.props.requestProjects();
		this.props.requestSupervisors();
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
			amount: '',
			description: '',
			project: null,
			supervisor: null,
			show: false,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { accounts, auth } = this.props;
		const { accountCodes } = accounts;
		const account = accountCodes[1].id;
		const staff = auth.user.user.id;
		const { description, amount, project, supervisor } = this.state;
		this.props.makeBusinessAdvanceRequest(
			staff,
			amount,
			description,
			account,
			project,
			supervisor
		);
		this.setState({
			...this.state,
			show: true,
		});
	};
	render() {
		const { auth, projects, supervisors, BAR } = this.props;
		const { BARError } = BAR;
		const { show, description, amount } = this.state;
		const { MHKprojects } = projects;
		const { isAuthenticated } = auth;
		return (
			<div className='testbox container mt-3 mb-3'>
				{isAuthenticated ? (
					<form>
						<div>
							{BARError ? (
								<Modal
									title={<h2 style={{ color: 'red' }}>Oops!</h2>}
									visible={show}
									// onOk={handleOk}
									// onCancel={handleCancel}
									footer={[
										<div
											className='btn btn-success btn-sm'
											onClick={this.handleClose}>
											Close
										</div>,
									]}>
									<p className='lead' style={{ color: 'red' }}>
										We encountered a problem. Please try again.
										<br />
										If the problem persists please contact support.
									</p>
								</Modal>
							) : show && !BARError ? (
								<Modal
									title={<h2 style={{ color: 'blue' }}>Success</h2>}
									visible={show}
									// onOk={handleOk}
									// onCancel={handleCancel}
									footer={[
										<div
											className='btn btn-success btn-sm'
											onClick={this.handleClose}>
											Close
										</div>,
									]}>
									<p className='lead'>
										Business Advance successfully submitted
									</p>
								</Modal>
							) : null}
							<div className='banner'>
								<h1>Business Advance Request</h1>
							</div>
							<div>
								{/* You can set className='colums' to put the forms in rows... */}
								<div className='item'>
									<label htmlFor='description'>
										{' '}
										Description<span>*</span>
									</label>
									<textarea
										id='description'
										type='text'
										name='description'
										value={description}
										onChange={this.handleChange}
										required
									/>
								</div>
								<div className='item'>
									<label htmlFor='amount'>
										{' '}
										Amount in Ksh<span>*</span>
									</label>
									<input
										id='amount'
										type='number'
										name='amount'
										value={amount}
										onChange={this.handleChange}
										required
									/>
								</div>
							</div>
							<div className='item'>
								<label htmlFor='project'>
									{' '}
									Project<span>*</span>
								</label>
								<select name='project' onChange={this.handleChange}>
									<option>Select project</option>
									{MHKprojects.map((project) => {
										return (
											<option key={project.id} value={project.id}>
												{project.project}
											</option>
										);
									})}
								</select>
							</div>
							<div className='item'>
								<label htmlFor='supervisor'>
									{' '}
									Supervisor<span>*</span>
								</label>
								<select name='supervisor' onChange={this.handleChange}>
									<option>Select supervisor</option>
									{supervisors.map((supervisor) => {
										return (
											<option key={supervisor.id} value={supervisor.id}>
												{supervisor.supervisor_name}
											</option>
										);
									})}
								</select>
							</div>
							<div className='btn-block'>
								<button onClick={this.handleSubmit}>Submit</button>
							</div>
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
		departments: state.departments,
		supervisors: state.supervisors.supervisors,
		projects: state.projects,
		accounts: state.accounts,
		BAR: state.BAR,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestAccountCodes: () => dispatch(requestAccountCodes()),
		requestSupervisors: () => dispatch(requestSupervisors()),
		requestProjects: () => dispatch(requestProjects()),
		makeBusinessAdvanceRequest: (
			staff,
			amount,
			description,
			account,
			project,
			supervisor
		) =>
			dispatch(
				makeBusinessAdvanceRequest(
					staff,
					amount,
					description,
					account,
					project,
					supervisor
				)
			),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BusinessAdvanceRequest);
