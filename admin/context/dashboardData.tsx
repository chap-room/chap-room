import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { AdminUserRole } from "@/shared/types";
import { getDashboard } from "@/admin/api";
import { DataLoaderState, useDataLoader } from "@/shared/components/DataLoader";

export interface DashboardData {
  admin: {
    avatar: string | null;
    name: string;
    phoneNumber: string;
    role: AdminUserRole;
  };
  sidebarData: {
    countOfInProgressOrders: number;
    countOfPendingCooperations: number;
    countOfPendingWithdrawals: number;
  };
  sales: {
    totalSales: number;
    chart: {
      time: string;
      debtor: number;
      creditor: number;
    }[];
  };
  users: {
    totalUsers: number;
    chart: {
      time: string;
      count: number;
    }[];
  };
  orders: {
    totalOrders: number;
    chart: {
      time: string;
      count: number;
    }[];
  };
  usersOrders: {
    totalUsersWithOneOrder: number;
    totalUsersWithTwoOrder: number;
    totalUsersWithThreeOrder: number;
    chart: {
      time: string;
      count: number;
    }[];
  };
  provincesOrders: Record<
    string,
    {
      sale: number;
      totalOrders: number;
      totalUsers: number;
    }
  >;
}

const DashboardDataContext = createContext<{
  dataLoaderState: DataLoaderState;
  data: DashboardData | null;
}>({
  dataLoaderState: { isLoading: true, isError: false, reload: () => {} },
  data: null,
});

export function DashboardDataProvider({ children }: PropsWithChildren<{}>) {
  const [data, setData] = useState<DashboardData | null>(null);
  const dataLoaderState = useDataLoader({
    load: () => getDashboard(),
    setData,
  });

  return (
    <DashboardDataContext.Provider
      value={{
        dataLoaderState,
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
