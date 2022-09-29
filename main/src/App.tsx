import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@chap-room/main/AppRoutes";

function App() {
  return (
    <Router>
      <HelmetProvider>
        <IntlProvider locale="fa">
          <AppRoutes />
        </IntlProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;
