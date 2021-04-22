import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import axios from "axios";
import { Redirect } from "react-router-dom";
import {
  requestEmployeeBusinessAdvanceRequest,
  getSpecificBARData,
} from "../Redux/BusinessAdvanceRequest/actions";
import {
  getEmployeePurchaseData,
  getSpecificPurchaseData,
} from "../Redux/Purchase/actions";

axios.defaults.baseURL = "http://api-finance-docs.mhealthkenya.co.ke/api/";

export class MyBusinessAdvance extends Component {
  state = {
    show: false,
    editShow: false,
    activity: "",
    description: "",
    amount: null,
    reviewing_supervisor: null,
    ID: null,
  };

  componentDidMount = () => {
    const { auth } = this.props;
    const { id } = auth.user.user;
    this.props.requestEmployeeBusinessAdvanceRequest(id);
  };

  handleView = (id) => {
    this.props.getSpecificBARData(id);
    console.log(id);
    this.setState({
      ...this.state,
      show: true,
    });
  };

  handleReport = (id) => {
    const url = `businessadvancerequestsupervisor/?request=${id}`;
    console.log(url);
    axios.get(url).then((res) => {
      const { id } = res.data[0];
      const url = `businessadvancerequestfinance/?request=${id}`;
      axios.get(url).then((res) => {
        const ID = res.data[0].request;
        console.log(ID);
        this.setState({
          ...this.state,
          ID: ID,
        });
      });
    });
  };

  handleEdit = (id) => {
    const { activity, description, amount, reviewing_supervisor } = this.state;
    console.log(id);
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
    const { sBAR, specificBAR } = this.props;
    const { ID } = this.state;
    const { supervisors } = this.props.supervisors;
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
        {ID ? (
          <Redirect to={`/docs/businessexpensereport/${ID}`} />
        ) : (
          <div>
            <Modal
              show={show}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton onClick={this.handleClose}>
                <Modal.Title id="contained-modal-title-vcenter">
                  {specificBAR.requester_name}'s Request
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="lead">
                  <b>Date: </b>
                  {moment(specificBAR.date).format("YYYY - MM - DD")}
                </p>
                <p className="lead">
                  <b>Accoount Code: </b>
                  {specificBAR.account_code_value}
                </p>
                <p className="lead">
                  <b>Description: </b>
                  {specificBAR.description}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <div
                  className="btn btn-outline btn-secondary"
                  onClick={this.handleClose}
                >
                  Close
                </div>
                {specificBAR.supervisor_approved &&
                specificBAR.finance_approved &&
                specificBAR.ceo_approved ? (
                  <div className="btn btn-success btn-sm disabled">Edit</div>
                ) : (
                  <div
                    className="btn btn-success btn-sm"
                    onClick={() => this.handleReport(specificBAR.id)}
                  >
                    Report
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
                  {specificBAR.requester_name}'s Request
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
                      onClick={() => this.handleEdit(specificBAR.id)}
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
                      <th>Project</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sBAR.map((request) => {
                      return (
                        <tr key={request.id}>
                          <td>{request.project_name}</td>
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
            </form>{" "}
          </div>
        )}
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
    sBAR: state.sBAR.sBAR,
    specificBAR: state.specificBAR.specificBAR,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getEmployeePurchaseData: (id) => dispatch(getEmployeePurchaseData(id)),
    getSpecificPurchaseData: (id) => dispatch(getSpecificPurchaseData(id)),
    requestEmployeeBusinessAdvanceRequest: (id) =>
      dispatch(requestEmployeeBusinessAdvanceRequest(id)),
    getSpecificBARData: (id) => dispatch(getSpecificBARData(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyBusinessAdvance);
