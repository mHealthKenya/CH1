import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { requestSupervisor } from '../Redux/General/actions';
import { requestTravelAuthorizationData } from '../Redux/Data/TravelAuthorization/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chart from 'react-google-charts';

export class Home extends Component {
	componentDidMount = () => {
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = auth.user.user;
			this.props.requestSupervisor(id);
			this.props.requestTravelAuthorizationData(id);
		}
	};
	render() {
		const { auth, statsTA } = this.props;
		const { approvedTA, pendingTA, rejectedTA } = statsTA;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { first_name, last_name } = auth.user.user;
			return (
				<div>
					<section id='hero'>
						<div className='mt-5'>
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
								options={{
									title: `${first_name} ${last_name}'s Requests`,
									colors: ['#0a6b0c', '#f2c60e', '#d21e1e'],
								}}
								rootProps={{ 'data-testid': '1' }}
							/>
						</div>
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestSupervisor: (id) => dispatch(requestSupervisor(id)),
		requestTravelAuthorizationData: (id) =>
			dispatch(requestTravelAuthorizationData(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
