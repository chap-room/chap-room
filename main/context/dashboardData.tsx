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
  loaderState: DataLoaderState;
  data: DashboardData | null;
}>({
  loaderState: { isLoading: true, isError: false, reload: () => {} },
  data: null,
});

export function DashboardDataProvider({ children }: PropsWithChildren<{}>) {
  const [data, setData] = useState<DashboardData | null>(null);
  const loaderState = useDataLoader({
    load: () => getDashboard(),
    setData,
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
        loaderState,
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
