import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import moment from "moment";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import {
  requestSupervisorTravelAuthorization,
  requestSpecificTravelAuthorization,
} from "../Redux/TravelAuthorization/actions";

axios.defaults.baseURL = "http://api-finance-docs.mhealthkenya.co.ke/api/";

export class TravelAuthorizationSupervisor extends Component {
  state = {
    supervisor_comment: "",
    showDisapprove: false,
  };
  componentDidMount = () => {
    const { supervisor } = this.props;
    const { id } = supervisor.supervisor[0];
    this.props.requestSupervisorTravelAuthorization(id);
  };

  handleApprove = (id) => {
    const url = `travelauthorization/${id}/`;
    const body = {
      approved: true,
      date_approved: new Date(),
      supervisor_comment: null,
    };
    axios
      .patch(url, body)
      .then((res) => {
        const { auth, supervisor } = this.props;
        const { id } = supervisor.supervisor[0];
        this.props.requestSupervisorTravelAuthorization(id);
        const UID = auth.user.user.id;
        const ID = res.data.id;
        const url = `travelauthorizationsupervisor/?request=${ID}`;
        axios.get(url).then((res) => {
          try {
            const { id } = res.data[0];
            const url = `travelauthorizationsupervisor/${id}/`;
            const body = {
              approved: true,
              owner: UID,
              request: ID,
            };
            axios
              .patch(url, body)
              .then((res) => {
                const { supervisor } = this.props;
                const { id } = supervisor.supervisor[0];
                this.props.requestSupervisorTravelAuthorization(id);
              })
              .catch((err) => {
                console.log(err.message);
              });
          } catch (err) {
            const url = "travelauthorizationsupervisor/";
            const body = {
              approved: true,
              owner: UID,
              request: ID,
            };
            axios
              .post(url, body)
              .then((res) => {
                const { supervisor } = this.props;
                const { id } = supervisor.supervisor[0];
                this.props.requestSupervisorTravelAuthorization(id);
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  handleDisApproveView = (id) => {
    this.props.requestSpecificTravelAuthorization(id);
    this.setState({
      ...this.state,
      showDisapprove: true,
    });
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      showDisapprove: false,
    });
  };

  handleDisApprove = (id) => {
    const { supervisor_comment } = this.state;
    const url = `travelauthorization/${id}/`;
    const body = {
      approved: false,
      date_approved: null,
      supervisor_comment: supervisor_comment,
    };
    axios
      .patch(url, body)
      .then((res) => {
        const { auth, supervisor } = this.props;
        const { id } = supervisor.supervisor[0];
        this.props.requestSupervisorTravelAuthorization(id);
        const UID = auth.user.user.id;
        const ID = res.data.id;
        const url = `travelauthorizationsupervisor/?request=${ID}`;
        axios.get(url).then((res) => {
          try {
            const { id } = res.data[0];
            const url = `travelauthorizationsupervisor/${id}/`;
            const body = {
              approved: false,
              owner: UID,
              request: ID,
            };
            axios
              .patch(url, body)
              .then((res) => {
                const { supervisor } = this.props;
                const { id } = supervisor.supervisor[0];
                this.props.requestSupervisorTravelAuthorization(id);
                this.setState({
                  ...this.state,
                  showDisapprove: false,
                });
              })
              .catch((err) => {
                console.log(err.message);
              });
          } catch (err) {
            const url = "travelauthorizationsupervisor/";
            const body = {
              approved: false,
              owner: UID,
              request: ID,
            };
            axios
              .post(url, body)
              .then((res) => {
                const { supervisor } = this.props;
                const { id } = supervisor.supervisor[0];
                this.props.requestSupervisorTravelAuthorization(id);
                this.setState({
                  ...this.state,
                  showDisapprove: false,
                });
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { showDisapprove } = this.state;
    const { auth, sTAS, specificTA } = this.props;
    const { travelAuthorization } = specificTA;
    const { supervisorTravelAuthorization } = sTAS;
    const { isAuthenticated } = auth;
    return (
      <div>
        <div className="testbox container">
          {/* <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    {purchaseRequest.requester_name}'s Request
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date Requested</th>
                          <th>Activity</th>
                          <th>Description</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {moment(purchaseRequest.date_requested).format(
                              "YYYY - MM - DD"
                            )}
                          </td>
                          <td>{purchaseRequest.activity}</td>
                          <td>{purchaseRequest.description}</td>
                          <td>{purchaseRequest.amount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div
                    className="btn btn-outline btn-secondary"
                    onClick={this.handleClose}
                  >
                    Close
                  </div>
                </Modal.Footer>
              </Modal> */}
          <Modal
            show={showDisapprove}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {travelAuthorization.staff_name}'s Request
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="lead">
                Please give a reason for disapproving this request...
              </p>
              <textarea
                name="supervisor_comment"
                rows={4}
                onChange={this.handleChange}
              ></textarea>
              <div className="flex-wrapper">
                <span style={{ flex: 2, color: "transparent" }}>
                  This is to separate buttons
                </span>
                <button
                  className="btn-block btn-success btn-sm"
                  style={{ flex: 1 }}
                  onClick={this.handleClose}
                >
                  Cancel
                </button>
                <span style={{ color: "transparent" }}>is</span>
                {travelAuthorization.supervisor_comment ? (
                  <button
                    className="btn-block btn-danger sm disabled"
                    style={{ flex: 1 }}
                    onClick={() =>
                      this.handleDisApprove(travelAuthorization.id)
                    }
                  >
                    Disapproved
                  </button>
                ) : (
                  <button
                    className="btn-block btn-danger sm"
                    style={{ flex: 1 }}
                    onClick={() =>
                      this.handleDisApprove(travelAuthorization.id)
                    }
                  >
                    Disapprove
                  </button>
                )}
              </div>
            </Modal.Body>
          </Modal>
          {isAuthenticated ? (
            <form>
              <div className="banner">
                <h1 className="ml-2 mr-2">
                  Pending/approved Travel Authorization
                </h1>
              </div>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Purpose of Travel</th>
                      <th>Destination</th>
                      <th>Period</th>
                      <th>Project</th>
                      {/* <th>Other Expenses</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supervisorTravelAuthorization.map((request) => {
                      return (
                        <tr key={request.id}>
                          <td>{request.purpose}</td>
                          <td>{request.destination}</td>
                          <td>{request.period}</td>
                          <td>{request.project_name}</td>
                          <td className="flex-wrapper">
                            {request.approved ? (
                              <div
                                className="btn btn-secondary disabled"
                                style={{ flex: 2 }}
                              >
                                Approved
                              </div>
                            ) : (
                              <div
                                className="btn btn-success"
                                onClick={() => this.handleApprove(request.id)}
                              >
                                Approve
                              </div>
                            )}{" "}
                            {request.supervisor_approved ? null : request.supervisor_comment ? (
                              <div
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() =>
                                  this.handleDisApproveView(request.id)
                                }
                              >
                                Disapproved
                              </div>
                            ) : (
                              <div
                                className="btn btn-danger"
                                style={{ flex: 1 }}
                                onClick={() =>
                                  this.handleDisApproveView(request.id)
                                }
                              >
                                Disapprove
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </form>
          ) : (
            <Redirect to="/auth/login" />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    supervisor: state.supervisor,
    sTAS: state.sTAS,
    logistics: state.supervisortaxilogistics,
    logistic: state.specifictaxilogistic.logistic,
    specificTA: state.specificTA,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestSupervisorTravelAuthorization: (id) =>
      dispatch(requestSupervisorTravelAuthorization(id)),
    requestSpecificTravelAuthorization: (id) =>
      dispatch(requestSpecificTravelAuthorization(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelAuthorizationSupervisor);
