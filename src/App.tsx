import { useReducer } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { DataContext, dataReducer, initialState } from "./context/data";

function App() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <Router>
      <IntlProvider locale="fa">
        <DataContext.Provider value={{ state, dispatch }}>
          <AppRoutes />
        </DataContext.Provider>
      </IntlProvider>
    </Router>
  );
}

export default App;
