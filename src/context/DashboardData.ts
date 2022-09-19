import { Address } from "../types";
import { createContext, Dispatch } from "react";
import { addresses, currentUser, orders, transactions, wallet } from "../dummyDashboardData";

interface DashboardDataState {
  currentUser: typeof currentUser;
  wallet: typeof wallet;
  addresses: typeof addresses;
  orders: typeof orders;
  transactions: typeof transactions;
}

type DashboardDataAction =
  | { type: "ADDRESSES:SET"; payload: Address }
  | { type: "ADDRESSES:DELETE"; payload: string };

export function dashboardDataReducer(
  state: DashboardDataState,
  action: DashboardDataAction
): DashboardDataState {
  if (action.type === "ADDRESSES:SET") {
    const address = action.payload;
    state.addresses[address.id] = address;
    return { ...state };
  }
  if (action.type === "ADDRESSES:DELETE") {
    const addressId = action.payload;
    delete state.addresses[addressId];
    return { ...state };
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
