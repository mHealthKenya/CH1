import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "axios";
import { requestSupervisor } from "../Redux/General/actions";
import {
  getPurchaseData,
  getSpecificPurchaseData,
  supervisorApprove,
} from "../Redux/Purchase/actions";

axios.defaults.baseURL = "http://api-finance-docs.mhealthkenya.co.ke/api/";

export class PurchaseRequisitionSupervisor extends Component {
  state = {
    show: false,
    showDisapprove: false,
    approved: true,
    supervisor_comments: "",
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleView = (id) => {
    this.props.getSpecificPurchaseData(id);
    this.setState({
      ...this.state,
      show: true,
    });
  };

  handleDisApproveView = (id) => {
    this.props.getSpecificPurchaseData(id);
    this.setState({
      ...this.state,
      showDisapprove: true,
    });
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      show: false,
      showDisapprove: false,
    });
  };

  handleApprove = (id) => {
    const url = `purchaserequisition/${id}/`;
    const body = {
      supervisor_approved: true,
      date_supervisor_review: new Date(),
      supervisor_comments: null,
    };
    axios
      .patch(url, body)
      .then((res) => {
        const { supervisor, auth } = this.props;
        const UID = auth.user.user.id;
        const { id } = supervisor.supervisor[0];
        this.props.getPurchaseData(id);
        const ID = res.data.id;
        console.log(ID);
        const url = `SAPR/?requisition=${ID}`;
        axios.get(url).then((res) => {
          try {
            const eid = res.data[0].id; //eid is an accronym for existing id.
            const url = `SAPR/${eid}/`;
            const body = {
              supervisor_approved: true,
              supervisor_disapproved: false,
              disapproval_message: null,
            };
            axios.patch(url, body).then((res) => {
              console.log(res.data);
            });
          } catch (err) {
            console.log(err.message);
            const url = `SAPR/?`;
            const body = {
              supervisor_approved: true,
              owner: UID,
              requisition: ID,
              supervisor: id,
            };
            axios
              .post(url, body)
              .then((res) => {
                console.log(res.data);
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

  handleDisApprove = (id) => {
    const { supervisor_comments } = this.state;
    const url = `purchaserequisition/${id}/`;
    const body = {
      supervisor_approved: false,
      date_supervisor_review: null,
      supervisor_comments: supervisor_comments,
    };
    axios
      .patch(url, body)
      .then((res) => {
        const { supervisor, auth } = this.props;
        const UID = auth.user.user.id;
        const { id } = supervisor.supervisor[0];
        const ID = res.data.id;
        const url = `SAPR/?requisition=${ID}`;
        axios.get(url).then((res) => {
          try {
            const eid = res.data[0].id; //eid is an accronym for existing id.
            const url = `SAPR/${eid}/`;
            const body = {
              supervisor_disapproved: true,
              supervisor_approved: false,
              owner: UID,
              requisition: ID,
              supervisor: id,
              disapproval_message: supervisor_comments,
            };
            axios.patch(url, body).then(() => {
              this.props.getPurchaseData(id);
              this.setState({
                ...this.state,
                showDisapprove: false,
              });
            });
          } catch (err) {
            const url = "SAPR/";
            const body = {
              supervisor_disapproved: true,
              supervisor_approved: false,
              owner: UID,
              requisition: ID,
              supervisor: id,
              disapproval_message: supervisor_comments,
            };
            axios
              .post(url, body)
              .then(() => {
                this.props.getPurchaseData(id);
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

  componentDidMount = () => {
    const { supervisor } = this.props;
    const { id } = supervisor.supervisor[0];
    this.props.getPurchaseData(id);
  };
  render() {
    let self = this;
    const { show, showDisapprove } = this.state;
    const { purchases, purchase, auth } = this.props;
    const { purchaseRequests } = purchases;
    const { purchaseRequest } = purchase;
    const { isAuthenticated } = auth;
    return (
      <div className="testbox container">
        <Modal
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
                    <th>Amount</th>
                    <th>Description</th>
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
                    <td>{purchaseRequest.amount}</td>
                    <td>{purchaseRequest.description}</td>
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
        </Modal>
        {isAuthenticated ? (
          <form>
            <div className="banner">
              <h1 className="ml-2 mr-2">
                My pending/approved purchase requisitions
              </h1>
            </div>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Requested By</th>
                    <th>Activity</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseRequests.map((request) => {
                    return (
                      <tr key={request.id}>
                        <td>{request.requester_name}</td>
                        <td>{request.activity}</td>

                        <td>{request.amount}</td>
                        <td className="flex-wrapper">
                          <div
                            className="btn btn-info"
                            style={{ flex: 1 }}
                            onClick={() => this.handleView(request.id)}
                          >
                            View
                          </div>{" "}
                          {request.supervisor_approved ? (
                            <div
                              className="btn btn-secondary disabled"
                              style={{ flex: 2 }}
                              onClick={() => self.handleApprove(request.id)}
                            >
                              Approved
                            </div>
                          ) : (
                            <div
                              className="btn btn-success"
                              onClick={() => self.handleApprove(request.id)}
                            >
                              Approve
                            </div>
                          )}{" "}
                          {request.supervisor_approved ? null : request.supervisor_comments ? (
                            <div
                              className="btn btn-secondary disabled"
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    supervisor: state.supervisor,
    purchases: state.supervisorPurchase,
    purchase: state.specificPurchase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestSupervisor: (id) => dispatch(requestSupervisor(id)),
    getPurchaseData: (id) => dispatch(getPurchaseData(id)),
    getSpecificPurchaseData: (id) => dispatch(getSpecificPurchaseData(id)),
    supervisorApprove: (id) => dispatch(supervisorApprove(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseRequisitionSupervisor);
