import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

// import moment from "moment";
import {
  requestEmployeeTravelAuthorization,
  requestSpecificTravelAuthorization,
} from "../Redux/TravelAuthorization/actions";

axios.defaults.baseURL = "http://api-finance-docs.mhealthkenya.co.ke/api/";

export class MyTravelAuthorizations extends Component {
  state = {
    show: false,
    showDisapprove: false,
    ID: null,
  };
  componentDidMount = () => {
    const { auth } = this.props;
    const { id } = auth.user.user;
    this.props.requestEmployeeTravelAuthorization(id);
  };

  handleReport = (id) => {
    const url = `travelauthorizationsupervisor/?request=${id}`;
    console.log(url);
    axios.get(url).then((res) => {
      try {
        const { request } = res.data[0];
        this.setState({
          ...this.state,
          ID: request,
        });
      } catch (err) {
        console.log(err.message);
      }
    });
  };

  handleView = (id) => {
    this.props.requestSpecificTravelAuthorization(id);
    console.log(id);
    this.setState({
      ...this.state,
      show: true,
    });
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      show: false,
    });
  };

  render() {
    const { show, ID } = this.state;
    const { auth, sTAS, specificTA } = this.props;
    const { travelAuthorization } = specificTA;
    const { supervisorTravelAuthorization } = sTAS;
    const { isAuthenticated } = auth;
    return (
      <div className="testbox container">
        {ID ? (
          <Redirect to={`/docs/travelexpensereport/${ID}`} />
        ) : (
          <div>
            <Modal
              show={show}
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
                  <b>Project: </b>
                  {travelAuthorization.project_name}
                </p>

                <p className="lead">
                  <b>Period In Days: </b>
                  {travelAuthorization.period}
                </p>

                <p className="lead">
                  <b>Destination: </b>
                  {travelAuthorization.destination}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <div
                  className="btn btn-outline btn-secondary"
                  onClick={this.handleClose}
                >
                  Close
                </div>

                {travelAuthorization.approved ? (
                  <div
                    className="btn btn-outline btn-success"
                    onClick={() => this.handleReport(travelAuthorization.id)}
                  >
                    Report
                  </div>
                ) : null}
              </Modal.Footer>
            </Modal>

            {isAuthenticated ? (
              <form>
                <div className="banner">
                  <h1 className="ml-2 mr-2">
                    Approved / Under review Travel Authorizations
                  </h1>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Purpose of Travel</th>
                        {/* <th>Destination</th>
                      <th>Period</th>
                      <th>Project</th> */}
                        <th>Status</th>
                        <th>Signature</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supervisorTravelAuthorization.map((request) => {
                        return (
                          <tr key={request.id}>
                            <td>{request.purpose}</td>
                            {/* <td>{request.destination}</td>
                          <td>{request.period}</td>
                          <td>{request.project_name}</td> */}
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
                            <td>
                              <div
                                className="btn btn-info btn-sm"
                                onClick={() => this.handleView(request.id)}
                              >
                                View
                              </div>
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
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    supervisor: state.supervisor,
    logistics: state.supervisortaxilogistics,
    sTAS: state.sTAS,
    specificTA: state.specificTA,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestEmployeeTravelAuthorization: (id) =>
      dispatch(requestEmployeeTravelAuthorization(id)),
    requestSpecificTravelAuthorization: (id) =>
      dispatch(requestSpecificTravelAuthorization(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTravelAuthorizations);
