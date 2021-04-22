import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "axios";
import {
  getEmployeePurchaseData,
  getSpecificPurchaseData,
} from "../Redux/Purchase/actions";

axios.defaults.baseURL = "http://api-finance-docs.mhealthkenya.co.ke/api/";

export class MyPurchaseRequisitions extends Component {
  state = {
    show: false,
    editShow: false,
    activity: "",
    description: "",
    amount: null,
    reviewing_supervisor: null,
  };

  componentDidMount = () => {
    const { auth } = this.props;
    const { id } = auth.user.user;
    this.props.getEmployeePurchaseData(id);
  };

  handleView = (id) => {
    this.props.getSpecificPurchaseData(id);
    this.setState({
      ...this.state,
      show: true,
    });
  };

  handleEditShow = (id) => {
    const { purchase } = this.props;
    const { purchaseRequest } = purchase;
    this.setState({
      ...this.state,
      editShow: true,
      show: false,
      activity: purchaseRequest.activity,
      description: purchaseRequest.description,
      amount: purchaseRequest.amount,
      reviewing_supervisor: purchaseRequest.reviewing_supervisor,
    });
  };

  handleEdit = (id) => {
    const { activity, description, amount, reviewing_supervisor } = this.state;
    const body = {
      activity: activity,
      description: description,
      amount: amount,
      reviewing_supervisor: reviewing_supervisor,
      supervisor_approved: false,
      supervisor_comments: null,
      finance_approved: false,
      finance_comments: null,
      ceo_approved: false,
      ceo_comments: null,
      date_supervisor_review: null,
      date_finace_officer_review: null,
      date_ceo_approval: null,
    };

    const url = `purchaserequisition/${id}/`;
    axios
      .patch(url, body)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      show: false,
      editShow: false,
      activity: "",
      description: "",
      amount: null,
      reviewing_supervisor: null,
    });
  };

  render() {
    const { purchases, purchase } = this.props;
    const { supervisors } = this.props.supervisors;
    const { purchaseRequest } = purchase;
    const { purchaseRequests } = purchases;
    const {
      show,
      editShow,
      activity,
      description,
      amount,
      reviewing_supervisor,
    } = this.state;

    return (
      <div className="testbox container mt-3 mb-3">
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
                    {purchaseRequest.supervisor_approved ? (
                      <th>Supervisor's Signature</th>
                    ) : null}
                    {purchaseRequest.finance_approved ? (
                      <th>Finance Reviewer's signature</th>
                    ) : null}
                    {purchaseRequest.ceo_approved ? (
                      <th>CEO's Signature</th>
                    ) : null}
                    {purchaseRequest.supervisor_comments ? (
                      <th>Supervisor Comments</th>
                    ) : purchaseRequest.finance_comments ? (
                      <th>Finance Comments</th>
                    ) : null}
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
                    {purchaseRequest.supervisor_approved ? (
                      <td>
                        <img
                          src={purchaseRequest.supervisor_signature}
                          width={50}
                          height={50}
                          alt="signature"
                        />
                      </td>
                    ) : null}
                    {purchaseRequest.finance_approved ? (
                      <td>
                        <img
                          src={purchaseRequest.finance_officer_signature}
                          width={50}
                          height={50}
                          alt="signature"
                        />
                      </td>
                    ) : null}
                    {purchaseRequest.ceo_approved ? (
                      <td>
                        <img
                          src={purchaseRequest.CEO_signature}
                          width={50}
                          height={50}
                          alt="signature"
                        />
                      </td>
                    ) : null}
                    {purchaseRequest.supervisor_comments ? (
                      <td>{purchaseRequest.supervisor_comments}</td>
                    ) : purchaseRequest.finance_comments ? (
                      <td>{purchaseRequest.finance_comments}</td>
                    ) : null}
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
            {purchaseRequest.supervisor_approved &&
            purchaseRequest.finance_approved &&
            purchaseRequest.ceo_approved ? (
              <div className="btn btn-success btn-sm disabled">Edit</div>
            ) : (
              <div
                className="btn btn-success btn-sm"
                onClick={() => this.handleEditShow(purchaseRequest.id)}
              >
                Edit
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={editShow}
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
            <form>
              <div className="banner">
                <h1>Edit my purchase requisition</h1>
              </div>
              <div>
                {/* You can set className='colums' to put the forms in rows... */}
                <div className="item">
                  <label htmlFor="activity">
                    {" "}
                    Activity<span>*</span>
                  </label>
                  <input
                    id="activity"
                    type="text"
                    name="activity"
                    value={activity}
                    required
                    onChange={this.handleChange}
                  />
                </div>
                <div className="item">
                  <label htmlFor="description">
                    {" "}
                    Description<span>*</span>
                  </label>
                  <textarea
                    id="description"
                    type="date"
                    name="description"
                    value={description}
                    required
                    onChange={this.handleChange}
                  />
                </div>
                <div className="item">
                  <label htmlFor="amount">
                    {" "}
                    Amount in Ksh<span>*</span>
                  </label>
                  <input
                    id="amount"
                    type="number"
                    name="amount"
                    value={amount}
                    required
                    onChange={this.handleChange}
                  />
                </div>
                <div className="item">
                  <label htmlFor="amount">
                    {" "}
                    Supervisor<span>*</span>
                  </label>
                  <select
                    name="reviewing_supervisor"
                    value={reviewing_supervisor}
                    onChange={this.handleChange}
                  >
                    <option>Select your supervisor</option>
                    {supervisors.map((supervisor) => {
                      return (
                        <option key={supervisor.id} value={supervisor.id}>
                          {supervisor.supervisor_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="flex-wrapper">
                <span style={{ flex: 2, color: "transparent" }}>
                  Button spacer
                </span>
                <button
                  className="btn-block btn-success"
                  onClick={() => this.handleEdit(purchaseRequest.id)}
                  style={{ flex: 1 }}
                >
                  Edit
                </button>
                <span style={{ color: "transparent" }}>S</span>
                <button
                  className="btn-block btn-danger"
                  onClick={this.handleClose}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
        <form>
          <div className="banner">
            <h1>My Approved / Pending purchase requests</h1>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {purchaseRequests.map((request) => {
                  return (
                    <tr key={request.id}>
                      <td>{request.activity}</td>
                      <td>{request.amount}</td>
                      {request.finance_comments ||
                      request.supervisor_comments ? (
                        <td style={{ color: "red" }}> Rejected</td>
                      ) : request.supervisor_approved &&
                        request.finance_approved &&
                        request.ceo_approved ? (
                        <td style={{ color: "green" }}>Approved</td>
                      ) : (
                        <td style={{ color: "#ffbb00" }}>Under review</td>
                      )}
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    purchases: state.supervisorPurchase,
    purchase: state.specificPurchase,
    supervisors: state.supervisors,
    specificTA: state.specificTA,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getEmployeePurchaseData: (id) => dispatch(getEmployeePurchaseData(id)),
    getSpecificPurchaseData: (id) => dispatch(getSpecificPurchaseData(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyPurchaseRequisitions);
