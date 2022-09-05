import { useState } from "react";
import { IntlProvider } from "react-intl";
import AppRoutes from "./components/AppRoutes";
import { DataContext } from "./dataContext";
import * as dummyData from "./dummyData";

function App() {
  const [currentUser, setCurrentUser] = useState(dummyData.currentUser);
  const [wallet, setWallet] = useState(dummyData.wallet);
  const [addresses, setAddresses] = useState(dummyData.addresses);
  const [transactions, setTransactions] = useState(dummyData.transactions);

  return (
    <IntlProvider locale="fa">
      <DataContext.Provider
        value={{
          currentUser,
          setCurrentUser,
          wallet,
          setWallet,
          addresses,
          setAddresses,
          transactions,
          setTransactions,
        }}
      >
        <AppRoutes />
      </DataContext.Provider>
    </IntlProvider>
  );
}

export default App;
