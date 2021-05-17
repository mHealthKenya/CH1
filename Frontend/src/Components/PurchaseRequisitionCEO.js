import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "axios";
import { CEOApprove, getSpecificPurchaseData } from "../Redux/Purchase/actions";
import { requestFinanceStaff, requestCEO } from "../Redux/General/actions";

axios.defaults.baseURL = "http://api-finance-docs.mhealthkenya.co.ke/api/";

export class PurchaseRequisitionCEO extends Component {
  state = {
    show: false,
    showDisapprove: false,
    ceo_comments: null,
  };
  componentDidMount = () => {
    const { auth } = this.props;
    const { id } = auth.user.user;
    this.props.requestFinanceStaff(id);
    this.props.requestCEO();
    this.props.CEOApprove();
    console.log(this.props);
  };

  handleView = (id) => {
    this.props.getSpecificPurchaseData(id);
    this.setState({
      ...this.state,
      show: true,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
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
    const { CEO, auth } = this.props;
    const ID = auth.user.user.id;
    const CEOID = CEO.CEO[0].id;
    const url = `purchaserequisition/${id}/`;
    const body = {
      finance_approved: true,
      ceo_approval: CEOID,
      ceo_approved: true,
      ceo_comments: null,
      date_ceo_approval: new Date(),
    };
    axios
      .patch(url, body)
      .then((res) => {
        const { id } = res.data;
        const url = `SAPR/?requisition=${id}`;
        axios.get(url).then((res) => {
          console.log(res.data);
          const { id } = res.data[0];
          const url = `FAPR/?requisition=${id}`;
          axios.get(url).then((res) => {
            const Fid = res.data[0].id;
            const url = `CAPR/?requisition=${Fid}`;
            axios.get(url).then((res) => {
              try {
                const { id } = res.data[0];
                const url = `CAPR/${id}/`;
                const body = {
                  ceo_approved: true,
                  ceo_disapproved: false,
                  owner: ID,
                  requisition: Fid,
                  ceo: CEOID,
                  disapproval_message: null,
                };
                axios
                  .patch(url, body)
                  .then(() => {
                    this.props.CEOApprove();
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
              } catch (err) {
                const url = "CAPR/";
                const body = {
                  ceo_approved: true,
                  ceo_disapproved: false,
                  owner: ID,
                  requisition: Fid,
                  ceo: CEOID,
                  disapproval_message: null,
                };
                axios
                  .post(url, body)
                  .then(() => {
                    this.props.CEOApprove();
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
              }
            });
          });
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  handleDisApprove = (id) => {
    const { CEO, auth } = this.props;
    const { ceo_comments } = this.state;
    const ID = auth.user.user.id;
    const CEOID = CEO.CEO[0].id;
    const url = `purchaserequisition/${id}/`;
    const body = {
      finance_approved: false,
      ceo_approval: CEOID,
      ceo_approved: false,
      ceo_comments: ceo_comments,
      date_ceo_approval: null,
    };
    axios
      .patch(url, body)
      .then((res) => {
        const { id } = res.data;
        const url = `SAPR/?requisition=${id}`;
        axios.get(url).then((res) => {
          console.log(res.data);
          const { id } = res.data[0];
          const url = `FAPR/?requisition=${id}`;
          axios.get(url).then((res) => {
            const Fid = res.data[0].id;
            const url = `CAPR/?requisition=${Fid}`;
            axios.get(url).then((res) => {
              try {
                const { id } = res.data[0];
                const url = `CAPR/${id}/`;
                const body = {
                  ceo_approved: false,
                  ceo_disapproved: true,
                  owner: ID,
                  requisition: Fid,
                  ceo: CEOID,
                  disapproval_message: ceo_comments,
                };
                axios
                  .patch(url, body)
                  .then(() => {
                    this.props.CEOApprove();
                    this.setState({
                      ...this.state,
                      showDisapprove: false,
                    });
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
              } catch (err) {
                const url = "CAPR/";
                const body = {
                  ceo_approved: false,
                  ceo_disapproved: true,
                  owner: ID,
                  requisition: Fid,
                  ceo: CEOID,
                  disapproval_message: ceo_comments,
                };
                axios
                  .post(url, body)
                  .then(() => {
                    this.props.CEOApprove();
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
          });
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
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
          <Modal.Header closeButton onClick={this.handleClose}>
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
                    <th>Account Code</th>
                    <th>Amount</th>
                    <th>Supervisor</th>
                    <th>Finance</th>
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
                    <td>{purchaseRequest.account_code_value}</td>
                    <td>{purchaseRequest.amount}</td>
                    <td>
                      <img
                        src={purchaseRequest.supervisor_signature}
                        alt="signature"
                        width={50}
                        height={50}
                      />
                    </td>
                    <td>
                      <img
                        src={purchaseRequest.finance_officer_signature}
                        alt="signature"
                        width={50}
                        height={50}
                      />
                    </td>
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
              name="ceo_comments"
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
                Purchase requests pending CEO approval
              </h1>
            </div>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Requested By</th>
                    <th>Activity</th>
                    <th>Amount</th>
                    <th>Approved</th>
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
                        <td>
                          <img
                            src={request.supervisor_signature}
                            alt="signature"
                            width={50}
                            height={50}
                          />
                        </td>
                        <td>
                          <div
                            className="btn btn-info btn-sm"
                            onClick={() => this.handleView(request.id)}
                          >
                            View
                          </div>

                          <div
                            className="btn btn-success btn-sm"
                            onClick={() => self.handleApprove(request.id)}
                          >
                            Approve
                          </div>
                          {request.ceo_comments ? (
                            <div className="btn btn-danger btn-sm disabled">
                              Disapproved
                            </div>
                          ) : (
                            <div
                              className="btn btn-danger btn-sm"
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
    finStaff: state.finStaff,
    CEO: state.CEO,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    CEOApprove: () => dispatch(CEOApprove()),
    getSpecificPurchaseData: (id) => dispatch(getSpecificPurchaseData(id)),
    requestFinanceStaff: (id) => dispatch(requestFinanceStaff(id)),
    requestCEO: () => dispatch(requestCEO()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseRequisitionCEO);
