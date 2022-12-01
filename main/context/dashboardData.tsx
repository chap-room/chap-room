import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getDashboard } from "@/main/api";
import { DataLoaderState, useDataLoader } from "@/shared/components/DataLoader";
import { Order, Tariffs } from "@/shared/types";

export interface DashboardData {
  name: string;
  phoneNumber: string;
  avatar: string | null;
  marketingBalance: number;
  walletBalance: number;
  tariffs: Tariffs;
  inProgressOrders: Order[];
}

const DashboardDataContext = createContext<{
  dataLoaderState: DataLoaderState;
  walletDataLoaderState: DataLoaderState;
  data: DashboardData | null;
}>({
  dataLoaderState: { isLoading: true, isError: false, reload: () => {} },
  walletDataLoaderState: { isLoading: true, isError: false, reload: () => {} },
  data: null,
});

export function DashboardDataProvider({ children }: PropsWithChildren<{}>) {
  const [data, setData] = useState<DashboardData | null>(null);
  const dataLoaderState = useDataLoader({
    load: () => getDashboard(),
    setData,
  });
  const walletDataLoaderState = useDataLoader({
    load: () => getDashboard(),
    setData,
    initialFetch: false,
  });

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "");
      if (userData) setData(userData);
    } catch {}
  }, []);

  return (
    <DashboardDataContext.Provider
      value={{
        dataLoaderState,
        walletDataLoaderState:
          dataLoaderState.isLoading || dataLoaderState.isError
            ? dataLoaderState
            : walletDataLoaderState,
        data,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  return useContext(DashboardDataContext);
}
