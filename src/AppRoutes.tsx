import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SuspenseLoader from "./components/SuspenseLoader";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardMain = lazy(() => import("./pages/Dashboard/Sections/Main"));
const DashboardOrders = lazy(() => import("./pages/Dashboard/Sections/Orders"));
const DashboardOrderList = lazy(
  () => import("./pages/Dashboard/Sections/Orders/List")
);
const DashboardNewOrder = lazy(
  () => import("./pages/Dashboard/Sections/Orders/New")
);
const DashboardAddresses = lazy(
  () => import("./pages/Dashboard/Sections/Addresses")
);
const DashboardAddresseList = lazy(
  () => import("./pages/Dashboard/Sections/Addresses/List")
);
const DashboardNewAddresse = lazy(
  () => import("./pages/Dashboard/Sections/Addresses/New")
);
const DashboardEditAddresse = lazy(
  () => import("./pages/Dashboard/Sections/Addresses/Edit")
);
const DashboardTransactions = lazy(
  () => import("./pages/Dashboard/Sections/Transactions")
);
const DashboardMarketing = lazy(
  () => import("./pages/Dashboard/Sections/Marketing")
);
const DashboardProfile = lazy(
  () => import("./pages/Dashboard/Sections/Profile")
);
const NotFound = lazy(() => import("./pages/NotFound"));

// TODO Remove this
// @ts-ignore
const NonFilledPromise = lazy(() => new Promise<JSX.Element>(() => {}));

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
        <Route path="suspense" element={<NonFilledPromise />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DashboardMain />} />
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
    </Suspense>
  );
}
