import React, { Component } from "react";
import { connect } from "react-redux";
import { requestProjects } from "../Redux/Projects/actions";
import { taxiLogistics } from "../Redux/TaxiLogistics/actions";
import { Modal } from "antd";

export class TaxiLogistics extends Component {
  state = {
    location_from: "",
    location_to: "",
    project: null,
    supervisor: null,
    staff_booking_taxi: null,
    show: false,
  };

  componentDidMount = () => {
    this.props.requestProjects();
    const { auth } = this.props;
    const { id } = auth.user.user;
    this.setState({
      ...this.state,
      staff_booking_taxi: id,
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
      location_from: "",
      location_to: "",
      project: null,
      supervisor: null,
      staff_booking_taxi: null,
      show: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      location_from,
      location_to,
      project,
      supervisor,
      staff_booking_taxi,
    } = this.state;

    this.props.taxiLogistics(
      location_from,
      location_to,
      project,
      supervisor,
      staff_booking_taxi
    );
    this.setState({
      ...this.state,
      show: true,
    });
  };
  render() {
    const { projects, supervisors, taxilogistics } = this.props;
    const { logisticsError } = taxilogistics;
    const { MHKprojects } = projects;
    const { location_from, location_to, show } = this.state;
    return (
      <div className="testbox container mt-3 mb-3">
        <form>
          <div>
            {logisticsError ? (
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
                </p>
              </Modal>
            ) : show && !logisticsError ? (
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
                <p className="lead">
                  Travel Authorization successfully submitted
                </p>
              </Modal>
            ) : null}
            <div className="banner">
              <h1>Taxi logistics</h1>
            </div>
            <div>
              {/* You can set className='colums' to put the forms in rows... */}
              <div className="item">
                <label htmlFor="location_from">
                  {" "}
                  Location To<span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Destination"
                  name="location_to"
                  value={location_to}
                  onChange={this.handleChange}
                />
              </div>
              <div className="item">
                <label htmlFor="location_from">
                  {" "}
                  Location From<span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Start location"
                  name="location_from"
                  value={location_from}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="item">
                <label htmlFor="description">
                  {" "}
                  Project<span>*</span>
                </label>
                <select name="project" onChange={this.handleChange}>
                  <option>Select project</option>
                  {MHKprojects.map((project) => {
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
            <div className="btn-block">
              <button onClick={this.handleSubmit}>Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects,
    supervisors: state.supervisors.supervisors,
    auth: state.auth,
    taxilogistics: state.taxilogistics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestProjects: () => dispatch(requestProjects()),
    taxiLogistics: (
      location_from,
      location_to,
      project,
      supervisor,
      staff_booking_taxi
    ) =>
      dispatch(
        taxiLogistics(
          location_from,
          location_to,
          project,
          supervisor,
          staff_booking_taxi
        )
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TaxiLogistics);
