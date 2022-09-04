import { createContext } from 'react';
import { addresses, currentUser, wallet } from './dummyData';

export const DataContext = createContext({
  currentUser,
  setCurrentUser: (value: typeof currentUser) => {},
  wallet,
  setWallet: (value: typeof wallet) => {},
  addresses,
  setAddresses: (value: typeof addresses) => {},
})