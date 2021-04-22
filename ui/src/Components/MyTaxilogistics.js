import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { requestEmployeeTaxiLogistics } from "../Redux/TaxiLogistics/actions";

export class MyTaxilogistics extends Component {
  componentDidMount = () => {
    const { auth } = this.props;
    const { id } = auth.user.user;
    this.props.requestEmployeeTaxiLogistics(id);
  };
  render() {
    // const { show, showDisapprove } = this.state;
    const { auth, logistics } = this.props;
    const { supervisorLogistics } = logistics;
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
              </Modal>
              <Modal
                show={showDisapprove}
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
                  <p className="lead">
                    Please give a reason for disapproving this request...
                  </p>
                  <textarea
                    name="supervisor_comments"
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
                    <button
                      className="btn-block btn-danger sm"
                      style={{ flex: 1 }}
                      onClick={() => this.handleDisApprove(purchaseRequest.id)}
                    >
                      Disapprove
                    </button>
                  </div>
                </Modal.Body>
              </Modal> */}
          {isAuthenticated ? (
            <form>
              <div className="banner">
                <h1 className="ml-2 mr-2">
                  Approved / Under review Taxi logistics
                </h1>
              </div>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Location From</th>
                      <th>Location To</th>
                      <th>Project</th>
                      <th>Staff</th>
                      <th>Status</th>
                      <th>Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supervisorLogistics.map((request) => {
                      return (
                        <tr key={request.id}>
                          <td>
                            {moment(request.date).format("YYYY - MM - DD")}
                          </td>
                          <td>{request.location_from}</td>
                          <td>{request.location_to}</td>
                          <td>{request.project_name}</td>
                          <td>{request.staff_name}</td>
                          {request.supervisor_comment ? (
                            <td style={{ color: "red" }}>Rejected</td>
                          ) : request.supervisor_approved ? (
                            <td style={{ color: "green" }}>Approved</td>
                          ) : (
                            <td style={{ color: "yellow" }}>Under Review</td>
                          )}
                          <td>
                            <img
                              src={request.supervisor_signature}
                              width={50}
                              height={50}
                              alt="signature"
                            />
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
    logistics: state.supervisortaxilogistics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestEmployeeTaxiLogistics: (id) =>
      dispatch(requestEmployeeTaxiLogistics(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTaxilogistics);
