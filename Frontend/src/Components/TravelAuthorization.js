import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { requestProjects } from "../Redux/Projects/actions";
import { requestSupervisors } from "../Redux/General/actions";
import axios from "axios";
import { Modal } from "antd";
import basePath from "../utils/basePath";

axios.defaults.baseURL = `${basePath}api/`;

export class TravelAuthorization extends Component {
	state = {
		datefrom: "",
		dateto: "",
		other: "0",
		destination: "",
		accommodation: "",
		project_to_charge: null,
		airticket: "",
		taxi: "",
		rangedates: [],
		staff: null,
		supervisor: null,
		purpose: "",
		show: false,
		error: null,
		redirect: false,
		lodging: null,
		mie: null,
	};

	componentDidMount = () => {
		const url = "lodgingmie/1/";
		axios.get(url).then((res) => {
			const { data } = res;
			const { lodging, mie } = data;
			this.setState({
				...this.state,
				lodging: lodging,
				mie: mie,
			});
		});
		this.props.requestProjects();
		this.props.requestSupervisors();
		const { auth } = this.props;
		const { isAuthenticated } = auth;
		if (isAuthenticated) {
			const { id } = auth.user.user;
			this.setState({
				...this.state,
				staff: id,
			});
		}
	};

	handleClose = () => {
		this.setState({
			...this.state,
			datefrom: "",
			dateto: "",
			other: 0,
			accommodation: "",
			project_to_charge: null,
			airticket: "",
			taxi: "",
			rangedates: [],
			staff: null,
			supervisor: null,
			show: false,
			destination: "",
			purpose: "",
			error: null,
			redirect: true,
		});
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			...this.state,
			[name]: value,
		});
	};

	handleAccomodation = () => {
		this.setState({
			...this.state,
			accommodation: true,
		});
	};

	handleAccomodationX = () => {
		this.setState({
			...this.state,
			accommodation: false,
		});
	};
	handleTaxi = () => {
		this.setState({
			...this.state,
			taxi: true,
		});
	};

	handleTaxiX = () => {
		this.setState({
			...this.state,
			taxi: false,
		});
	};
	handleAirTicket = () => {
		this.setState({
			...this.state,
			airticket: true,
		});
	};

	handleAirTicketX = () => {
		this.setState({
			...this.state,
			airticket: false,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const {
			staff,
			destination,
			purpose,
			project_to_charge,
			accommodation,
			airticket,
			taxi,
			supervisor,
			datefrom,
			dateto,
			rangedates,
		} = this.state;

		const travelPeriod =
			(new Date(dateto) - new Date(datefrom)) / (1000 * 3600 * 24);

		for (var i = 0; i <= travelPeriod; i++) {
			rangedates.push(i);
			console.log(i);
		}

		const period = rangedates.length;

		const url = "travelauthorization/";
		const body = {
			staff,
			destination,
			purpose,
			project_to_charge,
			accommodation,
			airticket,
			taxi,
			supervisor,
			period,
		};
		console.log(body);

		axios
			.post(url, body)
			.then((res) => {
				const { other } = this.state;
				this.setState({
					...this.state,
					show: true,
				});
				const { id } = res.data;
				if (other > 0) {
					const url = "other/";
					const body = {
						amount: other,
						request: id,
					};
					axios
						.post(url, body)
						.then((res) => {
							this.setState({
								...this.state,
								show: true,
							});
						})
						.catch((err) => {
							this.setState({
								...this.state,
								error: err.message,
							});
						});
				}
			})
			.catch((err) => {
				this.setState({
					...this.state,
					error: err.message,
				});
			});
	};
	render() {
		const {
			datefrom,
			dateto,
			other,
			accommodation,
			project_to_charge,
			airticket,
			taxi,
			error,
			purpose,
			show,
			destination,
			redirect,
			lodging,
			mie,
		} = this.state;
		const { supervisors } = this.props.supervisors;
		const { auth } = this.props;
		const { projects, supervisor } = this.props;
		const { MHKprojects } = projects;
		const { isAuthenticated } = auth;
		const travelPeriod =
			(new Date(dateto) - new Date(datefrom)) / (1000 * 3600 * 24);

		const base = mie + lodging;

		let eligibleSupervisors = [];
		if (supervisor.length > 0) {
			const currentSupervisor = supervisor[0].id;
			eligibleSupervisors = supervisors.filter(
				(element) => element.id !== currentSupervisor
			);
		} else {
			eligibleSupervisors = supervisors;
		}

		return (
			<div className="testbox container mt-3 mb-3">
				{isAuthenticated ? (
					<>
						{!redirect ? (
							<form>
								<div>
									{error ? (
										<Modal
											title={<h2 style={{ color: "red" }}>Oops!</h2>}
											visible={true}
											// onOk={handleOk}
											// onCancel={handleCancel}
											footer={[
												<div
													className="btn btn-success btn-sm"
													onClick={this.handleClose}>
													Close
												</div>,
											]}>
											<p className="lead" style={{ color: "red" }}>
												We encountered a problem. Please try again.
												<br />
												If the problem persists please contact support.
											</p>
										</Modal>
									) : show && !error ? (
										<Modal
											title={<h2 style={{ color: "blue" }}>Success</h2>}
											visible={show}
											// onOk={handleOk}
											// onCancel={handleCancel}
											footer={[
												<div
													className="btn btn-success btn-sm"
													onClick={this.handleClose}>
													Close
												</div>,
											]}>
											<p className="lead">
												Travel Authorization successfully submitted
											</p>
										</Modal>
									) : null}

									<div className="banner">
										<h1>Travel Authorization Form</h1>
									</div>
									<div>
										{/* You can set className='colums' to put the forms in rows... */}
										<div className="item">
											<label htmlFor="description">
												{" "}
												Purpose of travel<span>*</span>
											</label>
											<textarea
												id="purpose"
												type="text"
												name="purpose"
												value={purpose}
												onChange={this.handleChange}
												required
											/>
										</div>
										<div className="item">
											<label htmlFor="destination">
												{" "}
												Destination<span>*</span>
											</label>
											<input
												id="destination"
												type="text"
												name="destination"
												value={destination}
												onChange={this.handleChange}
												required
											/>
										</div>
										<div className="item">
											<label htmlFor="period">
												{" "}
												From<span>*</span>
											</label>
											<input
												id="datefrom"
												type="date"
												name="datefrom"
												value={datefrom}
												onChange={this.handleChange}
												required
											/>
											{/* {travelPeriod < 0 ? (
                  <small
                    id="dateschecker"
                    className="form-text"
                    style={{ color: "red" }}
                  >
                    Date from cannot be later than date to.
                  </small>
                ) : null} */}
										</div>
										<div className="item">
											<label htmlFor="period">
												{" "}
												To<span>*</span>
											</label>
											<input
												id="dateto"
												type="date"
												name="dateto"
												value={dateto}
												onChange={this.handleChange}
												required
											/>
											{travelPeriod < 0 ? (
												<small
													id="dateschecker"
													className="form-text"
													style={{ color: "red" }}>
													Date from cannot be later than date to.
												</small>
											) : null}
										</div>
										<div className="item">
											<label htmlFor="project">
												{" "}
												Project<span>*</span>
											</label>
											<select
												name="project_to_charge"
												onChange={this.handleChange}>
												<option defaultValue>Select project</option>
												{MHKprojects.map((project) => {
													<option>Select project</option>;
													return (
														<option key={project.id} value={project.id}>
															{project.project}
														</option>
													);
												})}
											</select>
										</div>

										<div className="item">
											<label htmlFor="amount">
												{" "}
												Supervisor<span>*</span>
											</label>
											<select name="supervisor" onChange={this.handleChange}>
												<option>Select your supervisor</option>
												{eligibleSupervisors.map((supervisor) => {
													return (
														<option key={supervisor.id} value={supervisor.id}>
															{supervisor.supervisor_name}
														</option>
													);
												})}
											</select>
										</div>

										<div className="item">
											<label htmlFor="other">Other expenses</label>
											<input
												id="other"
												type="number"
												name="other"
												value={other}
												onChange={this.handleChange}
											/>
										</div>
										<div className="question">
											<label>Do you require accomodation?</label>
											<div className="question-answer">
												<div>
													<input
														type="radio"
														value={accommodation}
														id="radio_1"
														name="accommodation"
														onClick={this.handleAccomodation}
													/>
													<label htmlFor="radio_1" className="radio">
														<span>Yes</span>
													</label>
												</div>
												<div>
													<input
														type="radio"
														value={accommodation}
														id="radio_2"
														name="accommodation"
														onClick={this.handleAccomodationX}
													/>
													<label htmlFor="radio_2" className="radio">
														<span>No</span>
													</label>
												</div>
											</div>
										</div>
										<div className="question">
											<label>Do you require an air ticket? </label>
											<div className="question-answer">
												<div>
													<input
														type="radio"
														value={airticket}
														id="radio_3"
														name="airticket"
														onClick={this.handleAirTicket}
													/>
													<label htmlFor="radio_3" className="radio">
														<span>Yes</span>
													</label>
												</div>
												<div>
													<input
														type="radio"
														value={airticket}
														id="radio_4"
														name="airticket"
														onClick={this.handleAirTicketX}
													/>
													<label htmlFor="radio_4" className="radio">
														<span>No</span>
													</label>
												</div>
											</div>
										</div>
										<div className="question">
											<label>Do you require a taxi? </label>
											<div className="question-answer">
												<div>
													<input
														type="radio"
														id="radio_5"
														name="taxi"
														value={taxi}
														onClick={this.handleTaxi}
													/>
													<label htmlFor="radio_5" className="radio">
														<span>Yes</span>
													</label>
												</div>
												<div>
													<input
														type="radio"
														value={taxi}
														id="radio_6"
														name="taxi"
													/>
													<label
														htmlFor="radio_6"
														className="radio"
														onClick={this.handleTaxiX}>
														<span>No</span>
													</label>
												</div>
											</div>
										</div>
									</div>
									{new Date(dateto) > new Date(datefrom) ? (
										<div className="item">
											<label htmlFor="other">Total Amount to Request</label>
											<input
												id="total"
												type="number"
												name="total"
												value={`${
													base *
														((new Date(dateto) - new Date(datefrom)) /
															(3600 * 24 * 1000) +
															1) -
													(0.5 * mie + 4900) +
													parseInt(other)
												}`}
												readOnly
											/>
										</div>
									) : null}
									<hr />
									<br />
									<div>
										{/* <div className="item table-responsive">
                <label htmlFor="description"> Table Summary</label>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Description of travel days</th>
                      <th scope="col">Lodging</th>
                      <th scope="col">MIE</th>
                      <th scope="col">Other</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rangedates.map((range, index) => {
                      return (
                        <tr key={index}>
                          {index === 0 && rangedates.length > 1 ? (
                            <>
                              <th scope="row">
                                {moment(range).format("DD-MM-YYYY")}
                              </th>
                              <td>1st day of travel (MIE@75%)</td>
                              <td>4500</td>
                              <td>{3600 * 0.75}</td>
                              <td>{null}</td>
                              <td>{3600 * 0.75}</td>
                            </>
                          ) : index === rangedates.length - 1 ? (
                            <>
                              <th scope="row">
                                {moment(range).format("YYYY-MM-DD")}
                              </th>
                              <td>Last day of travel (MIE@75%)</td>
                              <td>0</td>
                              <td>{3600 * 0.75}</td>
                              <td>-</td>
                              <td>{3600 * 0.75}</td>
                            </>
                          ) : (
                            <>
                              <th scope="row">
                                {moment(range).format("YYYY-MM-DD")}
                              </th>
                              <td>Full Day travel</td>
                              <td>4500</td>
                              <td>3600</td>
                              <td>-</td>
                              <td>{4500 + 3600} </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                    <tr>
                      <th scope="row">Subtotal</th>
                      <td>{null}</td>
                      {travelPeriod > 0 ? (
                        <td>{travelPeriod * 4500}</td>
                      ) : (
                        <td>{null}</td>
                      )}
                      {travelPeriod > 0 ? (
                        <td> {(travelPeriod - 1) * 3600 + 2 * 2700}</td>
                      ) : (
                        <td>2700</td>
                      )}
                      <td>{other} </td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
									</div>
									{purpose &&
									destination &&
									datefrom &&
									dateto &&
									new Date(dateto) > new Date(datefrom) &&
									supervisor &&
									project_to_charge ? (
										<div className="btn-block">
											<button onClick={this.handleSubmit}>Submit</button>
										</div>
									) : (
										<small style={{ color: "#de3765" }}>
											Please fill all fields before submitting
										</small>
									)}
								</div>
							</form>
						) : (
							<Redirect to="/" />
						)}
					</>
				) : (
					<Redirect to="/auth/login" />
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		projects: state.projects,
		supervisors: state.supervisors,
		supervisor: state.supervisor.supervisor,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestProjects: () => dispatch(requestProjects()),
		requestSupervisors: () => dispatch(requestSupervisors()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TravelAuthorization);
