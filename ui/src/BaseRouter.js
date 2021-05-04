import React, { Component } from "react";
import { Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import PurchaseRequisition from "./Components/PurchaseRequisition";
import PurchaseRequisitionSupervisor from "./Components/PurchaseRequisitionSupervisor";
import PurchaseRequisitionFinance from "./Components/PurchaseRequisitionFinance";
import PurchaseRequisitionCEO from "./Components/PurchaseRequisitionCEO";
import BusinessAdvanceRequest from "./Components/BusinessAdvanceRequest";
import BusinessAdvanceRequestSupervisor from "./Components/BusinessAdvanceRequestSupervisor";
import BusinessAdvanceRequestFinance from "./Components/BusinessAdvanceRequestFinance";
import BusinessExpenseReport from "./Components/BusinessExpenseReport";
import TravelAuthorization from "./Components/TravelAuthorization";
import TravelAuthorizationSupervisor from "./Components/TravelAuthorizationSupervisor";
import TravelExpenseReport from "./Components/TravelExpenseReport";
import TravelExpenseReportFinance from "./Components/TravelExpenseReportFinance";
import MyPurchaseRequisitions from "./Components/MyPurchaseRequisitions";
import TaxiLogistics from "./Components/TaxiLogistics";
import TaxiLogisticsSupervisor from "./Components/TaxiLogisticsSupervisor";
import TaxiLogisticsFinance from "./Components/TaxiLogisticsFinance";
import MyTaxilogistics from "./Components/MyTaxilogistics";
import MyTravelAuthorizations from "./Components/MyTravelAuthorizations";
import MyBusinessAdvance from "./Components/MyBusinessAdvance";
import BusinessExpenseReportFinance from "./Components/BusinessExpenseReportFinance";
import TravelAuthorizationFinance from "./Components/TravelAuthorizationFinance";
import RequestPasswordReset from "./Components/RequestPasswordReset";
import CheckMail from "./Components/CheckMail";

export class BaseRouter extends Component {
	render() {
		return (
			<div>
				<Route exact path="/" component={Home} />
				<Route exact path="/auth/login" component={Login} />
				<Route exact path="/auth/register" component={Register} />
				<Route
					exact
					path="/docs/purchaserequisition"
					component={PurchaseRequisition}
				/>
				<Route
					exact
					path="/docs/purchaserequisitionsupervisor"
					component={PurchaseRequisitionSupervisor}
				/>

				<Route
					exact
					path="/docs/purchaserequisitionfinance"
					component={PurchaseRequisitionFinance}
				/>

				<Route
					exact
					path="/docs/purchaserequisitionceo"
					component={PurchaseRequisitionCEO}
				/>
				<Route
					exact
					path="/docs/businessadvancerequest"
					component={BusinessAdvanceRequest}
				/>
				<Route
					exact
					path="/docs/mybusinessadvance"
					component={MyBusinessAdvance}
				/>
				<Route
					exact
					path="/docs/businessadvancerequestsupervisor"
					component={BusinessAdvanceRequestSupervisor}
				/>

				<Route
					exact
					path="/docs/businessadvancerequestfinance"
					component={BusinessAdvanceRequestFinance}
				/>

				<Route
					exact
					path="/docs/businessexpensereport/:ID"
					component={BusinessExpenseReport}
				/>

				<Route
					exact
					path="/docs/businessexpensereportfinance"
					component={BusinessExpenseReportFinance}
				/>
				<Route
					exact
					path="/docs/travelauthorization"
					component={TravelAuthorization}
				/>
				<Route
					exact
					path="/docs/travelauthorizationsupervisor"
					component={TravelAuthorizationSupervisor}
				/>
				<Route
					exact
					path="/docs/travelauthorizationfinance"
					component={TravelAuthorizationFinance}
				/>
				<Route
					exact
					path="/docs/travelexpensereport/:TAID"
					component={TravelExpenseReport}
				/>
				<Route
					exact
					path="/docs/travelexpensereportfinance/"
					component={TravelExpenseReportFinance}
				/>
				<Route
					exact
					path="/docs/mypurchaserequisitions"
					component={MyPurchaseRequisitions}
				/>

				<Route exact path="/docs/taxilogistics" component={TaxiLogistics} />
				<Route
					exact
					path="/docs/taxilogisticssupervisor"
					component={TaxiLogisticsSupervisor}
				/>
				<Route
					exact
					path="/docs/taxilogisticsfinance"
					component={TaxiLogisticsFinance}
				/>
				<Route exact path="/docs/mytaxilogistics" component={MyTaxilogistics} />
				<Route
					exact
					path="/docs/mytravelauthorizations"
					component={MyTravelAuthorizations}
				/>
				<Route
					exact
					path="/auth/requestpasswordreset"
					component={RequestPasswordReset}
				/>

				<Route exact path="/auth/checkmail" component={CheckMail} />
			</div>
		);
	}
}

export default BaseRouter;
