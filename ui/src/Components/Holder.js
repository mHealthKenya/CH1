import React, { Component } from "react";
import { connect } from "react-redux";
import { userLogout } from "../Redux/Auth/actions";
import axios from "axios";

axios.defaults.baseURL = "http://api-finance-docs.mhealthkenya.co.ke/api/";

export class Holder extends Component {
  state = {
    image: "",
  };
  componentDidMount = () => {
    const url = "mhealthimages/?imagename=mhealthhomelogo";
    axios.get(url).then((res) => {
      try {
        const { image } = res.data[0];
        this.setState({
          ...this.state,
          image: image,
        });
      } catch (err) {
        console.log(err.message);
      }
    });
  };
  handleLogout = () => {
    this.props.userLogout();
  };

  render() {
    const { auth } = this.props;
    const { isAuthenticated } = auth;
    const { image } = this.state;
    if (isAuthenticated) {
      const { groups } = auth.user.user;
      return (
        <>
          <header id="header" className="header">
            <div className="container">
              <div id="logo" className="pull-left">
                {/* <h1>
                  <a href="/">
                    <span>m</span>Health
                  </a>
                </h1> */}
                <a href="/">
                  <img src={image} alt="" title="" width={200} height={100} />
                </a>
              </div>

              <nav id="nav-menu-container">
                <ul className="nav-menu">
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li className="menu-has-children">
                    <a href="/">My Documents</a>
                    <ul>
                      <li>
                        <a href="/docs/mypurchaserequisitions">
                          Purchase Requisitions
                        </a>
                      </li>
                      <li>
                        <a href="/docs/mytaxilogistics">Taxi Logistics</a>
                      </li>
                      <li>
                        <a href="/docs/mybusinessadvance">Business Advance</a>
                      </li>
                      <li>
                        <a href="/docs/mytravelauthorizations">
                          Travel Authorization
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-has-children">
                    <a href="/">Finance Documents</a>
                    <ul>
                      <li>
                        <a href="/docs/businessadvancerequest">
                          Business Advance Request
                        </a>
                      </li>
                      {/* <li>
                        <a href="/docs/businessexpensereport">
                          Business Expense Report
                        </a>
                      </li> */}
                      <li>
                        <a href="/docs/travelauthorization">
                          Travel Authorization Form
                        </a>
                      </li>
                      {/* <li>
                        <a href="/docs/travelexpensereport">
                          Travel Expenses Report
                        </a>
                      </li> */}
                      <li>
                        <a href="/docs/taxilogistics">Taxi Logistics</a>
                      </li>
                      <li>
                        <a href="/docs/purchaserequisition">
                          Purchase Requisition Form
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-has-children">
                    <a href="/">HR Documents</a>
                    <ul>
                      <li>
                        <a href="/">Monthly time sheet</a>
                      </li>
                      <li>
                        <a href="/">Leave application</a>
                      </li>
                    </ul>
                  </li>
                  {groups.includes(2) ? (
                    <li className="menu-has-children">
                      <a href="/">Approve</a>
                      <ul>
                        <li>
                          <a href="/docs/purchaserequisitionsupervisor">
                            Purchase Requisitions
                          </a>
                        </li>
                        <li>
                          <a href="/docs/taxilogisticssupervisor">
                            Taxi Logistic
                          </a>
                        </li>
                        <li>
                          <a href="/docs/businessadvancerequestsupervisor">
                            Business Advance
                          </a>
                        </li>
                        <li>
                          <a href="/docs/travelauthorizationsupervisor">
                            Travel Authorization
                          </a>
                        </li>
                      </ul>
                    </li>
                  ) : null}
                  {groups.includes(1) ? (
                    <li className="menu-has-children">
                      <a href="/">Finance Aprrovals</a>
                      <ul>
                        <li>
                          <a href="/docs/purchaserequisitionfinance">
                            Purchase Requisitions
                          </a>
                        </li>
                        <li>
                          <a href="/docs/businessadvancerequestfinance">
                            Business Advance
                          </a>
                        </li>
                        <li>
                          <a href="/docs/businessexpensereportfinance">
                            Business Expense
                          </a>
                        </li>
                        <li>
                          <a href="/docs/taxilogisticsfinance">
                            Taxi Logistics
                          </a>
                        </li>
                        <li>
                          <a href="/docs/travelauthorizationfinance">
                            Travel Authorization
                          </a>
                        </li>
                        <li>
                          <a href="/docs/travelexpensereportfinance">
                            Travel Expense
                          </a>
                        </li>
                      </ul>
                    </li>
                  ) : null}
                  {groups.includes(3) ? (
                    <li className="menu-has-children">
                      <a href="/">CEO</a>
                      <ul>
                        <li>
                          <a href="/docs/purchaserequisitionceo">
                            Purchase Requisitions
                          </a>
                        </li>
                      </ul>
                    </li>
                  ) : null}
                  <li>
                    <a href="/auth/login" onClick={this.handleLogout}>
                      Logout
                    </a>
                    {/* <button
											className='enjoy-css-info'
											onClick={this.handleLogout}>
											Logout
										</button> */}
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          {this.props.children}
          <footer className="footer">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-lg-4">
                  <div className="footer-logo">
                    <a className="navbar-brand" href="/">
                      eStartup
                    </a>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the.
                    </p>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3 col-lg-2">
                  <div className="list-menu">
                    <h4>Abou Us</h4>

                    <ul className="list-unstyled">
                      <li>
                        <a href="/">About us</a>
                      </li>
                      <li>
                        <a href="/">Features item</a>
                      </li>
                      <li>
                        <a href="/">Live streaming</a>
                      </li>
                      <li>
                        <a href="/">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3 col-lg-2">
                  <div className="list-menu">
                    <h4>Abou Us</h4>

                    <ul className="list-unstyled">
                      <li>
                        <a href="/">About us</a>
                      </li>
                      <li>
                        <a href="/">Features item</a>
                      </li>
                      <li>
                        <a href="/">Live streaming</a>
                      </li>
                      <li>
                        <a href="/">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3 col-lg-2">
                  <div className="list-menu">
                    <h4>Support</h4>

                    <ul className="list-unstyled">
                      <li>
                        <a href="/">faq</a>
                      </li>
                      <li>
                        <a href="/">Editor help</a>
                      </li>
                      <li>
                        <a href="/">Contact us</a>
                      </li>
                      <li>
                        <a href="/">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3 col-lg-2">
                  <div className="list-menu">
                    <h4>Abou Us</h4>

                    <ul className="list-unstyled">
                      <li>
                        <a href="/">About us</a>
                      </li>
                      <li>
                        <a href="/">Features item</a>
                      </li>
                      <li>
                        <a href="/">Live streaming</a>
                      </li>
                      <li>
                        <a href="/">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="copyrights">
              <div className="container">
                <p>&copy; Copyrights eStartup. All rights reserved.</p>
                <div className="credits">
                  Designed by <a href="/">BootstrapMade</a>
                </div>
              </div>
            </div>
          </footer>

          <a href="/" className="back-to-top">
            <i className="fa fa-chevron-up"></i>
          </a>
        </>
      );
    } else {
      return (
        <>
          <header id="header" className="header">
            <div className="container">
              <div id="logo" className="pull-left">
                <h1>
                  <a href="/">
                    <span>m</span>Health
                  </a>
                </h1>
                <a href="/">
                  <img src="assets/img/logo.png" alt="" title="" />
                </a>
              </div>

              <nav id="nav-menu-container">
                <ul className="nav-menu">
                  <li className="menu-active">
                    <a href="/">Home</a>
                  </li>

                  <li>
                    <a href="/auth/register">Register</a>
                  </li>
                  <li>
                    <a href="/auth/login">Login</a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          {this.props.children}
          <footer className="footer">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-lg-4">
                  <div className="footer-logo">
                    <a className="navbar-brand" href="/">
                      eStartup
                    </a>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the.
                    </p>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3 col-lg-2">
                  <div className="list-menu">
                    <h4>Abou Us</h4>

                    <ul className="list-unstyled">
                      <li>
                        <a href="/">About us</a>
                      </li>
                      <li>
                        <a href="/">Features item</a>
                      </li>
                      <li>
                        <a href="/">Live streaming</a>
                      </li>
                      <li>
                        <a href="/">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3 col-lg-2">
                  <div className="list-menu">
                    <h4>Abou Us</h4>

                    <ul className="list-unstyled">
                      <li>
                        <a href="/">About us</a>
                      </li>
                      <li>
                        <a href="/">Features item</a>
                      </li>
                      <li>
                        <a href="/">Live streaming</a>
                      </li>
                      <li>
                        <a href="/">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3 col-lg-2">
                  <div className="list-menu">
                    <h4>Support</h4>

                    <ul className="list-unstyled">
                      <li>
                        <a href="/">faq</a>
                      </li>
                      <li>
                        <a href="/">Editor help</a>
                      </li>
                      <li>
                        <a href="/">Contact us</a>
                      </li>
                      <li>
                        <a href="/">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-sm-6 col-md-3 col-lg-2">
                  <div className="list-menu">
                    <h4>Abou Us</h4>

                    <ul className="list-unstyled">
                      <li>
                        <a href="/">About us</a>
                      </li>
                      <li>
                        <a href="/">Features item</a>
                      </li>
                      <li>
                        <a href="/">Live streaming</a>
                      </li>
                      <li>
                        <a href="/">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="copyrights">
              <div className="container">
                <p>&copy; Copyrights mHealth Kenya. All rights reserved.</p>
                <div>
                  Designed by <a href="/">Joel, Bruno and Dennis</a>
                </div>
              </div>
            </div>
          </footer>

          <a href="/" className="back-to-top">
            <i className="fa fa-chevron-up"></i>
          </a>
        </>
      );
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLogout: () => dispatch(userLogout()),
  };
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Holder);
