import { useReducer } from "react";
import { IntlProvider } from "react-intl";
import AppRoutes from "./AppRoutes";
import { DataContext, dataReducer, initialState } from "./context/data";

function App() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <IntlProvider locale="fa">
      <DataContext.Provider value={{ state, dispatch }}>
        <AppRoutes />
      </DataContext.Provider>
    </IntlProvider>
  );
}

export default App;
