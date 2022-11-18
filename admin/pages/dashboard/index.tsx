import styles from "./style.module.scss";
import { ReactElement, useState } from "react";
import Head from "next/head";
import Avatar from "@/shared/components/Dashboard/Avatar";
import DashboardLayout from "@/admin/components/Layout";
import DashboardNavLinks from "@/admin/components/NavLinks";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import BarChart from "@/admin/components/BarChart";
import IranMap from "@/admin/components/IranMap";
import DataLoader from "@/shared/components/DataLoader";
import { request } from "@/admin/api";
import { AdminUserRole } from "@/shared/types";
import Controls from "@/admin/components/Controls";
import Select from "@/shared/components/Select";

export default function DashboardMain() {
  const [IsInitialFetch, setIsInitialFetch] = useState(true);

  const [adminData, setAdminData] = useState<{
    avatar: string | null;
    name: string;
    phoneNumber: string;
    role: AdminUserRole;
  }>({
    avatar: null,
    name: "",
    phoneNumber: "",
    role: {
      name: "admin",
    },
  });

  const [salesTicker, setSalesTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [salesData, setSalesData] = useState<{
    totalSales: number;
    chart: {
      time: string;
      debtor: number;
      creditor: number;
    }[];
  }>({
    totalSales: 0,
    chart: [],
  });

  const [usersTicker, setUsersTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [usersData, setUsersData] = useState<{
    totalUsers: number;
    chart: {
      time: string;
      count: number;
    }[];
  }>({
    totalUsers: 0,
    chart: [],
  });

  const [ordersTicker, setOrdersTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [ordersData, setOrdersData] = useState<{
    totalOrders: number;
    chart: {
      time: string;
      count: number;
    }[];
  }>({
    totalOrders: 0,
    chart: [],
  });

  const [usersOrdersTicker, setUsersOrdersTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [usersOrdersData, setUsersOrdersData] = useState<{
    totalUsersWithOneOrder: number;
    totalUsersWithTwoOrder: number;
    totalUsersWithThreeOrder: number;
    chart: {
      time: string;
      count: number;
    }[];
  }>({
    totalUsersWithOneOrder: 0,
    totalUsersWithTwoOrder: 0,
    totalUsersWithThreeOrder: 0,
    chart: [],
  });

  const [provincesOrders, setProvincesOrders] = useState<
    Record<
      string,
      {
        sale: number;
        totalOrders: number;
        totalUsers: number;
      }
    >
  >({});

  return (
    <>
      <Head>
        <title>داشبورد</title>
      </Head>
      <SectionHeader title="داشبورد" hideBackToSiteButton />
      <DataLoader
        load={() =>
          request({
            method: "GET",
            url: "/admins/dashboard/",
            needAuth: true,
          }).then(({ data }) => data)
        }
        setData={(data) => {
          setAdminData(data.admin);
          setSalesData(data.sales);
          setUsersData(data.users);
          setOrdersData(data.orders);
          setUsersOrdersData(data.usersOrders);
          setProvincesOrders(data.provincesOrders);
        }}
      >
        <div className={styles.Container}>
          <div className={styles.NonMobile}>
            <div className={styles.ContentContainer}>
              <div>
                <SectionContent>
                  <ContentHeader title="فروش" />
                  <Controls
                    start={
                      <div className={styles.TickerSelect}>
                        <Select
                          options={{
                            daily: "روزانه",
                            weekly: "هفتگی",
                            monthly: "ماهانه",
                          }}
                          value={salesTicker}
                          onChange={setSalesTicker}
                        />
                      </div>
                    }
                  />
                  <DataLoader
                    load={() =>
                      request({
                        method: "GET",
                        url: `/admins/dashboard/sales/ticker/${salesTicker}`,
                        needAuth: true,
                      }).then(({ data }) => data)
                    }
                    deps={[salesTicker]}
                    setData={setSalesData}
                    initialFetch={false}
                  >
                    <BarChart
                      data={salesData.chart.map(
                        ({ time, creditor, debtor }) => ({
                          label: time,
                          value: creditor - debtor,
                          creditor,
                          debtor,
                        })
                      )}
                    />
                  </DataLoader>
                </SectionContent>
                <SectionContent>
                  <ContentHeader title="کاربران" />
                  <Controls
                    start={
                      <div className={styles.TickerSelect}>
                        <Select
                          options={{
                            daily: "روزانه",
                            weekly: "هفتگی",
                            monthly: "ماهانه",
                          }}
                          value={usersTicker}
                          onChange={setUsersTicker}
                        />
                      </div>
                    }
                  />
                  <DataLoader
                    load={() =>
                      request({
                        method: "GET",
                        url: `/admins/dashboard/users/ticker/${usersTicker}`,
                        needAuth: true,
                      }).then(({ data }) => data)
                    }
                    deps={[usersTicker]}
                    setData={setUsersData}
                    initialFetch={false}
                  >
                    <BarChart
                      data={usersData.chart.map(({ time, count }) => ({
                        label: time,
                        value: count,
                      }))}
                    />
                  </DataLoader>
                </SectionContent>
              </div>
              <div>
                <SectionContent>
                  <ContentHeader title="سفارش ها" />
                  <Controls
                    start={
                      <div className={styles.TickerSelect}>
                        <Select
                          options={{
                            daily: "روزانه",
                            weekly: "هفتگی",
                            monthly: "ماهانه",
                          }}
                          value={ordersTicker}
                          onChange={setOrdersTicker}
                        />
                      </div>
                    }
                  />
                  <DataLoader
                    load={() =>
                      request({
                        method: "GET",
                        url: `/admins/dashboard/orders/ticker/${ordersTicker}`,
                        needAuth: true,
                      }).then(({ data }) => data)
                    }
                    deps={[ordersTicker]}
                    setData={setOrdersData}
                    initialFetch={false}
                  >
                    <BarChart
                      data={ordersData.chart.map(({ time, count }) => ({
                        label: time,
                        value: count,
                      }))}
                    />
                  </DataLoader>
                </SectionContent>
                <SectionContent>
                  <ContentHeader title="کاربر سفارش" />
                  <Controls
                    start={
                      <div className={styles.TickerSelect}>
                        <Select
                          options={{
                            daily: "روزانه",
                            weekly: "هفتگی",
                            monthly: "ماهانه",
                          }}
                          value={usersOrdersTicker}
                          onChange={setUsersOrdersTicker}
                        />
                      </div>
                    }
                  />
                  <DataLoader
                    load={() =>
                      request({
                        method: "GET",
                        url: `/admins/dashboard/users-orders/ticker/${usersOrdersTicker}`,
                        needAuth: true,
                      }).then(({ data }) => data)
                    }
                    deps={[usersOrdersTicker]}
                    setData={setUsersOrdersData}
                    initialFetch={false}
                  >
                    <BarChart
                      data={usersOrdersData.chart.map(({ time, count }) => ({
                        label: time,
                        value: count,
                      }))}
                    />
                  </DataLoader>
                </SectionContent>
              </div>
              <SectionContent>
                <ContentHeader title="سفارش بر اساس استان" />
                <IranMap data={provincesOrders} />
              </SectionContent>
            </div>
          </div>
          <div className={styles.Mobile}>
            <div className={styles.User}>
              <Avatar user={adminData} />
              <div className={styles.Meta}>
                <div className={styles.UserRole}>
                  {
                    {
                      superAdmin: "سوپر ادمین",
                      admin: "ادمین",
                      agent: "نمایندگی",
                    }[adminData.role.name]
                  }
                </div>
                <div className={styles.Name}>{adminData.name}</div>
              </div>
            </div>
            <div className={styles.Welcome}>خوش‌آمدی!</div>
            <DashboardNavLinks />
          </div>
        </div>
      </DataLoader>
    </>
  );
}

DashboardMain.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
