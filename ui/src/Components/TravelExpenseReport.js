import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { requestSpecificTravelAuthorization } from "../Redux/TravelAuthorization/actions";
import axios from "axios";
import { Modal } from "antd";

axios.defaults.baseURL = "http://api-finance-docs.mhealthkenya.co.ke/api/";

export class TravelExpenseReport extends Component {
  state = {
    receipt: "",
    receipt_other: "",
    receipt_no_other: "",
    description: "",
    receipt_no: "",
    show: false,
    error: null,
  };

  componentDidMount = () => {
    const { TAID } = this.props.match.params;
    this.props.requestSpecificTravelAuthorization(TAID);
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
    });
  };

  handleReceipt = (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    this.setState({
      ...this.state,
      [name]: file,
    });
  };

  printDiv = (divName) => {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      description,
      receipt_no,
      receipt_other,
      receipt,
      receipt_no_other,
    } = this.state;
    const { specificTA } = this.props;
    const { other, travelAuthorization } = specificTA;
    const { id } = travelAuthorization;
    const url = `travelauthorizationsupervisor/?request=${id}`;
    axios.get(url).then((res) => {
      const { id } = res.data[0];
      const url = "travelexpensereport/";
      try {
        const otherID = other[0].id;

        const fd = new FormData();
        fd.append("description", description);
        fd.append("receipt_no", receipt_no_other);
        fd.append("receipt", receipt_other);
        const otherUrl = `other/${otherID}/`;
        axios.patch(otherUrl, fd).then((res) => {
          const request = id;
          const other = otherID;
          const fd = new FormData();
          fd.append("request", request);
          fd.append("other", other);
          fd.append("receipt", receipt);
          fd.append("receipt_no", receipt_no);
          fd.append("receipt_other", receipt_other);
          axios
            .post(url, fd)
            .then((res) => {
              this.setState({
                ...this.state,
                show: true,
                error: null,
              });
            })
            .catch((err) => {
              this.setState({
                ...this.state,
                show: true,
                error: err.message,
              });
            });
        });
      } catch (err) {
        const url = "travelexpensereport/";
        const request = id;
        const fd = new FormData();
        fd.append("request", request);
        fd.append("receipt", receipt);
        fd.append("receipt_no", receipt_no);
        axios
          .post(url, fd)
          .then((res) => {
            this.setState({
              ...this.state,
              show: true,
              error: null,
            });
          })
          .catch((err) => {
            this.setState({
              ...this.state,
              show: true,
              error: err.message,
            });
          });
      }
    });

    console.log(this.state);
    // this.printDiv("test");
  };

  render() {
    const { auth, specificTA } = this.props;
    const { travelAuthorization, other } = specificTA;
    const { isAuthenticated } = auth;
    const { show, error } = this.state;
    return (
      <div className="testbox container mt-3 mb-3" id="test">
        {isAuthenticated ? (
          <form>
            <div>
              {error ? (
                <Modal
                  title={<h2 style={{ color: "red" }}>Oops!</h2>}
                  visible={show}
                  // onOk={handleOk}
                  // onCancel={handleCancel}
                  footer={[
                    <div
                      className="btn btn-success btn-sm"
                      onClick={this.handleClose}
                    >
                      Close
                    </div>,
                  ]}
                >
                  <p className="lead" style={{ color: "red" }}>
                    We encountered a problem. Please try again.
                    <br />
                    If the problem persists please contact support.
                    <br />
                    {error}
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
                      onClick={this.handleClose}
                    >
                      Close
                    </div>,
                  ]}
                >
                  <p className="lead">Travel Expense successfully submitted</p>
                </Modal>
              ) : null}
              <div>
                <div className="banner">
                  <h1>Travel Expense Report</h1>
                </div>
                <div>
                  <div className="colums">
                    <div className="item">
                      <label htmlFor="project"> Date requested</label>
                      <input
                        id="date_approved"
                        type="text"
                        name="date_approved"
                        value={moment(travelAuthorization.date).format(
                          "YYYY - MM - DD"
                        )}
                        readOnly
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="colums">
                    <div className="item">
                      <label htmlFor="project"> Supervisor</label>
                      <input
                        id="supervisor_name"
                        type="text"
                        name="supervisor_name"
                        value={travelAuthorization.supervisor_name}
                        readOnly
                      />
                    </div>
                    <div className="item">
                      <label htmlFor="project"> Supervisor Sign</label>
                      <br />
                      <img
                        src={travelAuthorization.supervisor_signature}
                        alt="sign goes here"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="item">
                      <label htmlFor="project"> Date signed</label>
                      <input
                        id="project"
                        type="text"
                        name="project"
                        value={moment(travelAuthorization.date_approved).format(
                          "YYYY - MM - DD"
                        )}
                        readOnly
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="item">
                    <label htmlFor="description"> Purpose of travel</label>
                    <textarea
                      id="description"
                      type="text"
                      name="description"
                      value={travelAuthorization.purpose}
                      readOnly
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="period"> Period</label>
                    <input
                      id="dateto"
                      type="text"
                      name="dateto"
                      value={`${travelAuthorization.period} days`}
                      readOnly
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="project"> Project to charge</label>
                    <input
                      id="project"
                      type="text"
                      name="project"
                      value={travelAuthorization.project_name}
                      readOnly
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="receipt_no">Receipt No.</label>
                    <input
                      id="recceipt_no"
                      type="text"
                      name="receipt_no"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="receipt"> Upload receipt</label>
                    <input
                      id="recceipt"
                      type="file"
                      name="receipt"
                      onChange={this.handleReceipt}
                    />
                  </div>
                  <hr />
                  {other.length > 0 ? (
                    <div>
                      <h1>Other Expenses</h1>
                      <div className="item">
                        <label htmlFor="receipt_no_other">
                          {" "}
                          Receipt Number
                        </label>
                        <input
                          id="receipt_no_other"
                          type="text"
                          name="receipt_no_other"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="item">
                        <label htmlFor="amount">Amount</label>
                        <input
                          id="amount"
                          type="number"
                          name="amount"
                          value={other[0].amount}
                          disabled
                        />
                      </div>

                      <div className="item">
                        <label htmlFor="amount">Description</label>
                        <textarea
                          id="description"
                          type="text"
                          name="description"
                          rows={3}
                          onChange={this.handleChange}
                        />
                      </div>

                      <div className="item">
                        <label htmlFor="project"> Upload receipt</label>
                        <input
                          id="receipt_other"
                          type="file"
                          name="receipt_other"
                          onChange={this.handleReceipt}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
                <br />
                {/* <div>
              <div className="item table-responsive">
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
                    <tr>
                      <th scope="row">18-Mar-2021</th>
                      <td>First day of travel (MIE@75%)</td>
                      <td>4900</td>
                      <td>2700</td>
                      <td>0</td>
                      <td>7600</td>
                    </tr>
                    <tr>
                      <th scope="row">19-Mar-2021</th>
                      <td>Last day of travel (MIE@75%)</td>
                      <td>0</td>
                      <td>2700</td>
                      <td>0</td>
                      <td>2700</td>
                    </tr>
                    <tr>
                      <td>{null}</td>
                      <th scope="row">Sub total</th>
                      <td>4900</td>
                      <td>5400</td>
                      <td>0</td>
                      <td>10300</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
                <div className="btn-block">
                  <button onClick={this.handleSubmit}>Submit</button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <Redirect to="/auth/login" />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestSpecificTravelAuthorization: (id) =>
      dispatch(requestSpecificTravelAuthorization(id)),
  };
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    specificTA: state.specificTA,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TravelExpenseReport);
