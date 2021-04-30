import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
	requestSupervisor,
	requestSupervisors,
} from '../Redux/General/actions';
import { requestTravelAuthorizationData } from '../Redux/Data/TravelAuthorization/actions';
import { requestBusinessAdvanceData } from '../Redux/Data/BusinessAdvance/actions';
import { getTaxiLogisticsData } from '../Redux/Data/TaxiLogistics/actions';
import { getPurchaseRequisitionData } from '../Redux/Data/PurchaseRequisition/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chart from 'react-google-charts';

export class Home extends Component {
	componentDidMount = () => {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = auth.user.user;
			this.props.requestSupervisor(id);
			this.props.requestSupervisors();
			this.props.requestTravelAuthorizationData(id);
			this.props.requestBusinessAdvanceData(id);
			this.props.getTaxiLogisticsData(id);
			this.props.getPurchaseRequisitionData(id);
		}
	};
	render() {
		const { auth, statsTA, statsBA, statsTL, statsPR } = this.props;
		const { approvedTA, pendingTA, rejectedTA } = statsTA;
		const { approvedBA, pendingBA, rejectedBA } = statsBA;
		const { approvedTL, pendingTL, rejectedTL } = statsTL;
		const { approvedPR, pendingPR, rejectedPR } = statsPR;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { first_name, last_name } = auth.user.user;
			return (
				<div className='testbox container mt-3 mb-3'>
					{approvedTA > 0 ||
					approvedBA > 0 ||
					approvedTL > 0 ||
					approvedPR > 0 ||
					pendingTA > 0 ||
					pendingBA > 0 ||
					pendingTL > 0 ||
					pendingPR > 0 ||
					rejectedTA > 0 ||
					rejectedBA > 0 ||
					rejectedTL > 0 ||
					rejectedPR > 0 ? (
						<form>
							<div className='banner mb-2'>
								<h1>
									{first_name} {last_name}'s stats
								</h1>
							</div>
							{/* <br /> */}
							<section id='hero'>
								<div className='row'>
									{approvedTA > 0 || pendingTA > 0 || rejectedTA > 0 ? (
										<div className='columns'>
											<h2 className='ml-2'>Travel Authorization</h2>
											<Chart
												height={'400px'}
												chartType='PieChart'
												loader={
													<div style={{ textAlign: 'center' }}>
														<CircularProgress /> Loading chart
													</div>
												}
												data={[
													['Task', 'Hours per Day'],
													['Approved', approvedTA],
													['Pending', pendingTA],
													['Rejected', rejectedTA],
												]}
												options={{
													colors: ['#0a6b0c', '#f2c60e', '#d21e1e'],
													backgroundColor: '#f5f9f9',
												}}
												rootProps={{ 'data-testid': '1' }}
											/>
										</div>
									) : null}

									{approvedBA > 0 || pendingBA > 0 || rejectedBA > 0 ? (
										<div className='columns'>
											<h2 className='ml-2'>Business Advance</h2>
											<Chart
												height={'400px'}
												chartType='PieChart'
												loader={
													<div style={{ textAlign: 'center' }}>
														<CircularProgress /> Loading chart
													</div>
												}
												data={[
													['Task', 'Hours per Day'],
													['Approved', approvedBA],
													['Pending', pendingBA],
													['Rejected', rejectedBA],
												]}
												options={{
													colors: ['#0a6b0c', '#f2c60e', '#d21e1e'],
													backgroundColor: '#f5f9f9',
												}}
												rootProps={{ 'data-testid': '1' }}
											/>
										</div>
									) : null}
								</div>

								<div className='row'>
									{approvedTL > 0 || pendingTL > 0 || rejectedTL > 0 ? (
										<div className='columns'>
											<h2 className='ml-2'>Taxi Logistics</h2>
											<Chart
												height={'400px'}
												chartType='PieChart'
												loader={
													<div style={{ textAlign: 'center' }}>
														<CircularProgress /> Loading chart
													</div>
												}
												data={[
													['Task', 'Hours per Day'],
													['Approved', approvedTL],
													['Pending', pendingTL],
													['Rejected', rejectedTL],
												]}
												options={{
													colors: ['#0a6b0c', '#f2c60e', '#d21e1e'],
													backgroundColor: '#f5f9f9',
												}}
												rootProps={{ 'data-testid': '1' }}
											/>
										</div>
									) : null}
									{approvedPR > 0 || pendingPR > 0 || rejectedPR > 0 ? (
										<div className='columns'>
											<h2 className='ml-2'>Purchase Requisition</h2>
											<Chart
												height={'400px'}
												chartType='PieChart'
												loader={
													<div style={{ textAlign: 'center' }}>
														<CircularProgress /> Loading chart
													</div>
												}
												data={[
													['Task', 'Hours per Day'],
													['Approved', approvedPR],
													['Pending', pendingPR],
													['Rejected', rejectedPR],
												]}
												options={{
													colors: ['#0a6b0c', '#f2c60e', '#d21e1e'],
													backgroundColor: '#f5f9f9',
												}}
												rootProps={{ 'data-testid': '1' }}
											/>
										</div>
									) : null}
								</div>
								{/* <div className='mt-5'>
							<Chart
								height={'800px'}
								chartType='PieChart'
								loader={
									<div>
										<CircularProgress /> Loading chart
									</div>
								}
								data={[
									['Task', 'Hours per Day'],
									['Approved', approvedTA],
									['Pending', pendingTA],
									['Rejected', rejectedTA],
								]}
								options={
									colors: ['#0a6b0c', '#f2c60e', '#d21e1e'],
								}}
								rootProps={{ 'data-testid': '1' }}
							/>
						</div> */}
							</section>
							{/* <section id='hero'>
						<div className='hero-container' data-aos='fade-in'>
							<h1>Welcome to mHealthKenya Forms</h1>
							<h2>
								Hello {first_name} {last_name}. You can now submit your
								documents online.
							</h2>
						</div>
					</section> */}

							{/* <main id='main'>
						<section id='features' className='padd-section'>
							<div className='container' data-aos='fade-up'>
								<div className='section-title text-center'>
									<h2> Finance and HR Documents.</h2>
									<p className='separator'>
										You can now submit your documents online.
									</p>
								</div>

								<div className='row' data-aos='fade-up' data-aos-delay='100'>
									<div className='col-md-6 col-lg-3'>
										<div className='feature-block'>
											<a
												href='/docs/businessadvancerequest'
												style={{ textDecoration: 'none' }}>
												<h4>Business Advance Request</h4>
												<p className='lead'>
													Lorem Ipsum is simply dummy text of the printing and
													typesetting industry
												</p>
											</a>
										</div>
									</div>
									<div className='col-md-6 col-lg-3'>
										<div className='feature-block'>
											<a
												href='/docs/travelauthorization'
												style={{ textDecoration: 'none' }}>
												<h4>Travel Authorization Form</h4>
												<p className='lead'>
													Lorem Ipsum is simply dummy text of the printing and
													typesetting industry
												</p>
											</a>
										</div>
									</div>

									<div className='col-md-6 col-lg-3'>
										<div className='feature-block'>
											<a
												href='/docs/taxilogistics'
												style={{ textDecoration: 'none' }}>
												<h4>Taxi Logistics</h4>
												<p className='lead'>
													Lorem Ipsum is simply dummy text of the printing and
													typesetting industry
												</p>
											</a>
										</div>
									</div>

									<div className='col-md-6 col-lg-3'>
										<div className='feature-block'>
											<a
												href='/docs/purchaserequisition'
												style={{ textDecoration: 'none' }}>
												<h4>Purchase Requisition Form</h4>
												<p className='lead'>
													Lorem Ipsum is simply dummy text of the printing and
													typesetting industry
												</p>
											</a>
										</div>
									</div>
									<div className='col-md-6 col-lg-3'>
										<div className='feature-block'>
											<a href='/' style={{ textDecoration: 'none' }}>
												<h4>Monthly Timesheet Forms</h4>
												<p className='lead'>
													Lorem Ipsum is simply dummy text of the printing and
													typesetting industry
												</p>
											</a>
										</div>
									</div>
									<div className='col-md-6 col-lg-3'>
										<div className='feature-block'>
											<a href='/' style={{ textDecoration: 'none' }}>
												<h4>Leave Application Form</h4>
												<p className='lead'>
													Lorem Ipsum is simply dummy text of the printing and
													typesetting industry
												</p>
											</a>
										</div>
									</div>
								</div>
							</div>
						</section>
					</main> */}
						</form>
					) : (
						<section id='hero'>
							<div className='hero-container' data-aos='fade-in'>
								<h1>Welcome to mHealthKenya Forms</h1>
								<h2>
									Hello {first_name} {last_name}. You can now submit your
									documents online.
								</h2>
							</div>
						</section>
					)}
				</div>
			);
		} else {
			return <Redirect to='/auth/login' />;
		}
	}
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		statsTA: state.statsTA,
		statsBA: state.statsBA,
		statsTL: state.statsTL,
		statsPR: state.statsPR,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestSupervisor: (id) => dispatch(requestSupervisor(id)),
		requestTravelAuthorizationData: (id) =>
			dispatch(requestTravelAuthorizationData(id)),
		requestBusinessAdvanceData: (id) =>
			dispatch(requestBusinessAdvanceData(id)),

		getTaxiLogisticsData: (id) => dispatch(getTaxiLogisticsData(id)),
		getPurchaseRequisitionData: (id) =>
			dispatch(getPurchaseRequisitionData(id)),
		requestSupervisors: () => dispatch(requestSupervisors()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
