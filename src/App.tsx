import { IntlProvider } from "react-intl";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <Router>
      <IntlProvider locale="fa">
        <AppRoutes />
      </IntlProvider>
    </Router>
  );
}

export default App;
