import { Address, Order, OrderCancelReason, OrderStatus } from "@chap-room/shared/types";
import { createContext, Dispatch } from "react";
import {
  addresses,
  currentUser,
  orders,
  transactions,
  wallet,
} from "@chap-room/main/dummyDashboardData";

interface DashboardDataState {
  currentUser: typeof currentUser;
  wallet: typeof wallet;
  addresses: typeof addresses;
  orders: typeof orders;
  transactions: typeof transactions;
}

type DashboardDataAction =
  | DashboardDataAddressesAction
  | DashboardDataOrdersAction;

type DashboardDataAddressesAction =
  | { type: "ADDRESSES:PUSH"; payload: Address }
  | { type: "ADDRESSES:UPDATE"; payload: Address }
  | { type: "ADDRESSES:DELETE"; payload: string };
type DashboardDataOrdersAction =
  | { type: "ORDERS:PUSH"; payload: Order }
  | { type: "ORDERS:CANCEL"; payload: string };

export function dashboardDataReducer(
  state: DashboardDataState,
  action: DashboardDataAction
): DashboardDataState {
  if (action.type === "ADDRESSES:PUSH") {
    const address = action.payload;
    return { ...state, addresses: [...state.addresses, { ...address }] };
  }
  if (action.type === "ADDRESSES:UPDATE") {
    const address = action.payload;
    return {
      ...state,
      addresses: state.addresses.map((item) =>
        item.id === address.id ? { ...address } : item
      ),
    };
  }
  if (action.type === "ADDRESSES:DELETE") {
    const addressId = action.payload;
    return {
      ...state,
      addresses: state.addresses.filter((item) => item.id !== addressId),
    };
  }
  if (action.type === "ORDERS:PUSH") {
    const order = action.payload;
    return { ...state, orders: [...state.orders, { ...order }] };
  }
  if (action.type === "ORDERS:CANCEL") {
    const orderId = action.payload;
    return {
      ...state,
      orders: state.orders.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status: OrderStatus.canceled,
              cancelReason: OrderCancelReason.userCancel,
            }
          : item
      ),
    };
  }
  return state;
}

export const initialState: DashboardDataState = {
  currentUser,
  wallet,
  addresses,
  orders,
  transactions,
};

export const DashboardDataContext = createContext<{
  state: DashboardDataState;
  dispatch: Dispatch<DashboardDataAction>;
}>({
  state: initialState,
  dispatch: () => {},
});
