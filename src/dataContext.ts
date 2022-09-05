import { createContext } from 'react';
import { addresses, currentUser, transactions, wallet } from './dummyData';

export const DataContext = createContext({
  currentUser,
  setCurrentUser: (value: typeof currentUser) => {},
  wallet,
  setWallet: (value: typeof wallet) => {},
  addresses,
  setAddresses: (value: typeof addresses) => {},
  transactions,
  setTransactions: (value: typeof transactions) => {},
})