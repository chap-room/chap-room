import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SuspenseLoader from "@chap-room/shared/components/SuspenseLoader";

const Home = lazy(() => import("@chap-room/main/pages/Home"));
const Login = lazy(() => import("@chap-room/main/pages/Login"));
const Signup = lazy(() => import("@chap-room/main/pages/Signup"));
const ForgotPassword = lazy(
  () => import("@chap-room/main/pages/ForgotPassword")
);
const Dashboard = lazy(() => import("@chap-room/main/pages/Dashboard"));
const DashboardMain = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Main")
);
const DashboardAddresses = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Addresses")
);
const DashboardAddresseList = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Addresses/List")
);
const DashboardNewAddresse = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Addresses/New")
);
const DashboardEditAddresse = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Addresses/Edit")
);
const DashboardOrders = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Orders")
);
const DashboardOrderList = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Orders/List")
);
const DashboardNewOrder = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Orders/New")
);
const DashboardOrderDetails = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Orders/Details")
);
const DashboardTransactions = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Transactions")
);
const DashboardMarketing = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Marketing")
);
const DashboardProfile = lazy(
  () => import("@chap-room/main/pages/Dashboard/Sections/Profile")
);
const NotFound = lazy(() => import("@chap-room/main/pages/NotFound"));

export default function AppRoutes() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="prices" element={<Home />} />
        <Route path="order" element={<Home />} />
        <Route path="blog" element={<Home />} />
        <Route path="contact-us" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DashboardMain />} />
          <Route path="orders" element={<DashboardOrders />}>
            <Route index element={<DashboardOrderList />} />
            <Route path="new" element={<DashboardNewOrder />} />
            <Route
              path=":orderId/details"
              element={<DashboardOrderDetails />}
            />
          </Route>
          <Route path="addresses" element={<DashboardAddresses />}>
            <Route index element={<DashboardAddresseList />} />
            <Route path="new" element={<DashboardNewAddresse />} />
            <Route path=":addressId/edit" element={<DashboardEditAddresse />} />
          </Route>
          <Route path="transactions" element={<DashboardTransactions />} />
          <Route path="marketing" element={<DashboardMarketing />} />
          <Route path="profile" element={<DashboardProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
