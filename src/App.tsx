import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardIndex from "./pages/Dashboard/Sections/Index";
import DashboardOrders from "./pages/Dashboard/Sections/Orders";
import DashboardOrderList from "./pages/Dashboard/Sections/Orders/List";
import DashboardNewOrder from "./pages/Dashboard/Sections/Orders/New";
import DashboardAddresses from "./pages/Dashboard/Sections/Addresses";
import DashboardAddresseList from "./pages/Dashboard/Sections/Addresses/List";
import DashboardNewAddresse from "./pages/Dashboard/Sections/Addresses/New";
import DashboardEditAddresse from "./pages/Dashboard/Sections/Addresses/Edit";
import DashboardTransactions from "./pages/Dashboard/Sections/Transactions";
import DashboardMarketing from "./pages/Dashboard/Sections/Marketing";
import DashboardProfile from "./pages/Dashboard/Sections/Profile";
import NotFound from "./pages/NotFound";
import { DataContext } from "./dataContext";
import * as dummyData from './dummyData';

function App() {
  const [currentUser, setCurrentUser] = useState(dummyData.currentUser);
  const [wallet, setWallet] = useState(dummyData.wallet);
  const [addresses, setAddresses] = useState(dummyData.addresses);

  return (
    <DataContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        wallet,
        setWallet,
        addresses,
        setAddresses,
      }}
    >
      <Routes>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DashboardIndex />} />
          <Route path="orders" element={<DashboardOrders />}>
            <Route index element={<DashboardOrderList />} />
            <Route path="new" element={<DashboardNewOrder />} />
          </Route>
          <Route path="addresses" element={<DashboardAddresses />}>
            <Route index element={<DashboardAddresseList />} />
            <Route path="new" element={<DashboardNewAddresse />} />
            <Route path="edit/:addressId" element={<DashboardEditAddresse />} />
          </Route>
          <Route path="transactions" element={<DashboardTransactions />} />
          <Route path="marketing" element={<DashboardMarketing />} />
          <Route path="profile" element={<DashboardProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DataContext.Provider>
  );
}

export default App;
