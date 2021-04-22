import { combineReducers } from "redux";
import authReducer from "./Auth/reducer";
import departmentsReducer from "./Departments/reducer";
import projectsReducer from "./Projects/reducer";
import {
  taxiLogisticsReducer,
  STLReducer,
  specificTaxiLogisticReducer,
} from "./TaxiLogistics/reducer";
import purchaseRequisitionReducer, {
  supervisorPurchaseRequestReducer,
  specificPurchaseRequestReducer,
} from "./Purchase/reducer";
import {
  accountCodesReducer,
  supervisorsReducer,
  supervisorReducer,
  financeStaffReducer,
  CEOReducer,
} from "./General/reducer";
import {
  BARReducer,
  SBARReducer,
  specificBARRequestReducer,
} from "./BusinessAdvanceRequest/reducer";
import {
  TASReducer,
  specificTravelAuthorization,
} from "./TravelAuthorization/reducer";
import {
  travelExpenseReducer,
  specificTravelExpenseReducer,
} from "./TravelExpense/reducer";

import { logoReducer } from "./mHealthImages/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  departments: departmentsReducer,
  makePurchase: purchaseRequisitionReducer,
  accounts: accountCodesReducer,
  supervisors: supervisorsReducer,
  projects: projectsReducer,
  supervisor: supervisorReducer,
  supervisorPurchase: supervisorPurchaseRequestReducer,
  specificPurchase: specificPurchaseRequestReducer,
  finStaff: financeStaffReducer,
  CEO: CEOReducer,
  taxilogistics: taxiLogisticsReducer,
  supervisortaxilogistics: STLReducer,
  specifictaxilogistic: specificTaxiLogisticReducer,
  BAR: BARReducer, //BAR is an acronym for Business Advance Request
  sBAR: SBARReducer, //sBAR is an acronym for Supervisor Business Advance Request
  specificBAR: specificBARRequestReducer,
  sTAS: TASReducer,
  specificTA: specificTravelAuthorization,
  travelExpense: travelExpenseReducer,
  TES: specificTravelExpenseReducer,
  logo: logoReducer,
});

export default rootReducer;
