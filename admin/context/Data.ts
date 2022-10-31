import { createContext, Dispatch } from "react";
import {
  CooperationRequest,
  CooperationRequestStatus,
  CurrentAdminUser,
  DiscountCode,
  Order,
  OrderStatus,
  AllPrintPrices,
  User,
  WithdrawalRequest,
  WithdrawalRequestStatus,
  FinancialRecord,
  DedicatedLinkReport,
  DedicatedDiscountCodeReport,
  CustomerReport,
} from "@/shared/types";
import {
  cooperationRequests,
  currentUser,
  discountCodes,
  orders,
  allPrintPrices,
  users,
  withdrawalRequests,
  financialRecords,
  dedicatedLinkReports,
  dedicatedDiscountCodeReports,
  customerReports,
} from "@/admin/dummyData";

interface State {
  currentUser: CurrentAdminUser;
  users: User[];
  orders: Order[];
  discountCodes: DiscountCode[];
  cooperationRequests: CooperationRequest[];
  financialRecords: FinancialRecord[];
  withdrawalRequests: WithdrawalRequest[];
  allPrintPrices: AllPrintPrices;
  dedicatedLinkReports: DedicatedLinkReport[];
  dedicatedDiscountCodeReports: DedicatedDiscountCodeReport[];
  customerReports: CustomerReport[];
}

type Action =
  | UsersAction
  | OrdersAction
  | DiscountCodesAction
  | CooperationRequestsAction
  | WithdrawalRequestsAction
  | PrintPricesAction;

type UsersAction =
  | { type: "USERS:PUSH"; payload: User }
  | { type: "USERS:UPDATE"; payload: User }
  | { type: "USERS:DELETE"; payload: string };
type OrdersAction =
  | { type: "ORDERS:CANCEL"; payload: [string, string] }
  | { type: "ORDERS:CONFIRM"; payload: string }
  | { type: "ORDERS:SENT"; payload: [string, string] };
type DiscountCodesAction =
  | { type: "DISCOUNT_CODES:PUSH"; payload: DiscountCode }
  | { type: "DISCOUNT_CODES:UPDATE"; payload: DiscountCode }
  | { type: "DISCOUNT_CODES:ACTIVATE"; payload: string }
  | { type: "DISCOUNT_CODES:INACTIVATE"; payload: string }
  | { type: "DISCOUNT_CODES:DELETE"; payload: string };
type CooperationRequestsAction =
  | { type: "COOPERATION_RRQUESTS:ACCEPT"; payload: [string, string | null] }
  | { type: "COOPERATION_RRQUESTS:REJECT"; payload: [string, string | null] };
type WithdrawalRequestsAction =
  | { type: "WITHDRAWAL_RRQUESTS:DONE"; payload: [string, string, string] }
  | { type: "WITHDRAWAL_RRQUESTS:REJECT"; payload: [string, string] };
type PrintPricesAction = { type: "ALL_PRINT_PRICES:UPDATE"; payload: AllPrintPrices };

export function dataReducer(state: State, action: Action): State {
  if (action.type === "USERS:PUSH") {
    const user = action.payload;
    return { ...state, users: [...state.users, { ...user }] };
  }
  if (action.type === "USERS:UPDATE") {
    const user = action.payload;
    return {
      ...state,
      users: state.users.map((item) =>
        item.id === user.id ? { ...user } : item
      ),
    };
  }
  if (action.type === "USERS:DELETE") {
    const userId = action.payload;
    return {
      ...state,
      users: state.users.filter((item) => item.id !== userId),
    };
  }
  if (action.type === "ORDERS:CANCEL") {
    const [orderId, reason] = action.payload;
    return {
      ...state,
      orders: state.orders.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status: OrderStatus.canceled,
              cancelReason: reason,
            }
          : item
      ),
    };
  }
  if (action.type === "ORDERS:CONFIRM") {
    const orderId = action.payload;
    return {
      ...state,
      orders: state.orders.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status: OrderStatus.preparing,
            }
          : item
      ),
    };
  }
  if (action.type === "ORDERS:SENT") {
    const [orderId, trackingCode] = action.payload;
    return {
      ...state,
      orders: state.orders.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status: OrderStatus.sent,
              trackingCode,
            }
          : item
      ),
    };
  }
  if (action.type === "DISCOUNT_CODES:PUSH") {
    const discountCode = action.payload;
    return {
      ...state,
      discountCodes: [...state.discountCodes, { ...discountCode }],
    };
  }
  if (action.type === "DISCOUNT_CODES:UPDATE") {
    const discountCode = action.payload;
    return {
      ...state,
      discountCodes: state.discountCodes.map((item) =>
        item.id === discountCode.id ? { ...discountCode } : item
      ),
    };
  }
  if (action.type === "DISCOUNT_CODES:ACTIVATE") {
    const discountCodeId = action.payload;
    return {
      ...state,
      discountCodes: state.discountCodes.map((item) =>
        item.id === discountCodeId
          ? {
              ...item,
              active: true,
            }
          : item
      ),
    };
  }
  if (action.type === "DISCOUNT_CODES:INACTIVATE") {
    const discountCodeId = action.payload;
    return {
      ...state,
      discountCodes: state.discountCodes.map((item) =>
        item.id === discountCodeId
          ? {
              ...item,
              active: false,
            }
          : item
      ),
    };
  }
  if (action.type === "DISCOUNT_CODES:DELETE") {
    const discountCodeId = action.payload;
    return {
      ...state,
      discountCodes: state.discountCodes.filter(
        (item) => item.id !== discountCodeId
      ),
    };
  }
  if (action.type === "COOPERATION_RRQUESTS:ACCEPT") {
    const [cooperationRequestId, description] = action.payload;
    return {
      ...state,
      cooperationRequests: state.cooperationRequests.map((item) =>
        item.id === cooperationRequestId
          ? {
              ...item,
              status: CooperationRequestStatus.accepted,
              description,
            }
          : item
      ),
    };
  }
  if (action.type === "COOPERATION_RRQUESTS:REJECT") {
    const [cooperationRequestId, description] = action.payload;
    return {
      ...state,
      cooperationRequests: state.cooperationRequests.map((item) =>
        item.id === cooperationRequestId
          ? {
              ...item,
              status: CooperationRequestStatus.rejected,
              description,
            }
          : item
      ),
    };
  }
  if (action.type === "WITHDRAWAL_RRQUESTS:DONE") {
    const [withdrawalRequestId, transactionDate, transactionTrackingCode] =
      action.payload;
    return {
      ...state,
      withdrawalRequests: state.withdrawalRequests.map((item) =>
        item.id === withdrawalRequestId
          ? {
              ...item,
              status: WithdrawalRequestStatus.done,
              transactionDate,
              transactionTrackingCode,
            }
          : item
      ),
    };
  }
  if (action.type === "WITHDRAWAL_RRQUESTS:REJECT") {
    const [withdrawalRequestId, rejectReason] = action.payload;
    return {
      ...state,
      withdrawalRequests: state.withdrawalRequests.map((item) =>
        item.id === withdrawalRequestId
          ? {
              ...item,
              status: WithdrawalRequestStatus.rejected,
              rejectReason,
            }
          : item
      ),
    };
  }
  if (action.type === "ALL_PRINT_PRICES:UPDATE") {
    const allPrintPrices = action.payload;
    return {
      ...state,
      allPrintPrices,
    };
  }
  return state;
}

export const initialState: State = {
  currentUser,
  users,
  orders,
  discountCodes,
  cooperationRequests,
  financialRecords,
  withdrawalRequests,
  allPrintPrices,
  dedicatedLinkReports,
  dedicatedDiscountCodeReports,
  customerReports,
};

export const DataContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});
