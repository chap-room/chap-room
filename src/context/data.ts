import { Address } from "../types";
import { createContext, Dispatch } from "react";
import { addresses, currentUser, transactions, wallet } from "../dummyData";

interface DataState {
  currentUser: typeof currentUser;
  wallet: typeof wallet;
  addresses: typeof addresses;
  transactions: typeof transactions;
}

type DataAction =
  | { type: "ADDRESSES:SET"; payload: Address }
  | { type: "ADDRESSES:DELETE"; payload: string };

export function dataReducer(state: DataState, action: DataAction): DataState {
  if (action.type === "ADDRESSES:SET") {
    const address = action.payload;
    state.addresses.set(address.id, address);
    return { ...state };
  }
  if (action.type === "ADDRESSES:DELETE") {
    const addressId = action.payload;
    state.addresses.delete(addressId);
    return { ...state };
  }
  return state;
}

export const initialState: DataState = {
  currentUser,
  wallet,
  addresses,
  transactions,
};

export const DataContext = createContext<{
  state: DataState;
  dispatch: Dispatch<DataAction>;
}>({
  state: initialState,
  dispatch: () => {},
});
