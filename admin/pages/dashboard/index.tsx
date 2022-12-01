import styles from "./style.module.scss";
import { ReactElement, useState } from "react";
import { FormattedNumber } from "react-intl";
import Head from "next/head";
import { AdminUserRole } from "@/shared/types";
import { getDashboard, request } from "@/admin/api";
import { englishToPersianNumbers } from "@/shared/utils/numbers";
import Avatar from "@/shared/components/Dashboard/Avatar";
import DashboardLayout from "@/admin/components/Layout";
import DashboardNavLinks from "@/admin/components/NavLinks";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import BarChart from "@/admin/components/BarChart";
import IranMap from "@/admin/components/IranMap";
import DataLoader, { DataLoaderView } from "@/shared/components/DataLoader";
import FilterSelect from "@/admin/components/FilterSelect";
import { DashboardData, useDashboardData } from "@/admin/context/dashboardData";

export default function DashboardMain() {
  const dashboardData = useDashboardData();

  return (
    <>
      <Head>
        <title>داشبورد</title>
      </Head>
      <AdminSectionHeader title="داشبورد" />
      <DataLoaderView state={dashboardData.dataLoaderState}>
        <div className={styles.Container}>
          <DashboardNonMobile data={dashboardData.data!} />
          <DashboardMobile data={dashboardData.data!} />
        </div>
      </DataLoaderView>
    </>
  );
}

DashboardMain.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

interface DashboardNonMobilePorps {
  data: DashboardData;
}

export function DashboardNonMobile({ data }: DashboardNonMobilePorps) {
  const [sidebarData, setSidebarData] = useState<{
    countOfInProgressOrders: number;
    countOfPendingCooperations: number;
    countOfPendingWithdrawals: number;
  }>({
    countOfInProgressOrders: 0,
    countOfPendingCooperations: 0,
    countOfPendingWithdrawals: 0,
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
  }>(data.sales);
  const [salesTooltipData, setSalesTooltipData] = useState<{
    item: {
      label: string;
      value: number;
      debtor: number;
      creditor: number;
    };
    position: { left: number; top: number };
  } | null>(null);

  const [usersTicker, setUsersTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [usersData, setUsersData] = useState<{
    totalUsers: number;
    chart: {
      time: string;
      count: number;
    }[];
  }>(data.users);
  const [usersTooltipData, setUsersTooltipData] = useState<{
    item: {
      label: string;
      value: number;
    };
    position: { left: number; top: number };
  } | null>(null);

  const [ordersTicker, setOrdersTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [ordersData, setOrdersData] = useState<{
    totalOrders: number;
    chart: {
      time: string;
      count: number;
    }[];
  }>(data.orders);
  const [ordersTooltipData, setOrdersTooltipData] = useState<{
    item: {
      label: string;
      value: number;
    };
    position: { left: number; top: number };
  } | null>(null);

  const [usersOrdersTicker, setUsersOrdersTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [usersOrdersFilter, setUsersOrdersFilter] = useState<
    "one" | "two" | "three"
  >("one");
  const [usersOrdersData, setUsersOrdersData] = useState<{
    totalUsersWithOneOrder: number;
    totalUsersWithTwoOrder: number;
    totalUsersWithThreeOrder: number;
    chart: {
      time: string;
      count: number;
    }[];
  }>(data.usersOrders);
  const [usersOrdersTooltipData, setUsersOrdersTooltipData] = useState<{
    item: {
      label: string;
      value: number;
    };
    position: { left: number; top: number };
  } | null>(null);

  const [provincesOrders, setProvincesOrders] = useState(data.provincesOrders);

  return (
    <div className={styles.NonMobile}>
      <div className={styles.ContentContainer}>
        <div>
          <SectionContent>
            <div className={styles.ContentHeader}>
              <div>
                <div>فروش</div>
                <FilterSelect
                  options={{
                    daily: "روزانه",
                    weekly: "هفتگی",
                    monthly: "ماهانه",
                  }}
                  value={salesTicker}
                  onChange={setSalesTicker}
                />
              </div>
              <div>
                <div>
                  کل فروش: <FormattedNumber value={salesData.totalSales} />{" "}
                  تومان
                </div>
              </div>
            </div>
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
                data={salesData.chart.map(({ time, creditor, debtor }) => ({
                  label: englishToPersianNumbers(time),
                  value: creditor - debtor,
                  creditor,
                  debtor,
                }))}
                setTooltipData={setSalesTooltipData}
                hideY
              />
              {salesTooltipData && (
                <div
                  className={styles.SalesTooltip}
                  style={{
                    position: "absolute",
                    left: salesTooltipData.position.left,
                    top: salesTooltipData.position.top,
                  }}
                >
                  <div>
                    <div>
                      <div>بستانکار:</div>
                      <div>
                        <div>
                          <FormattedNumber
                            value={salesTooltipData.item.creditor}
                          />
                        </div>
                        <div>تومان</div>
                      </div>
                    </div>
                    <div>
                      <div>بدهکار:</div>
                      <div>
                        <div>
                          <FormattedNumber
                            value={salesTooltipData.item.debtor}
                          />
                        </div>
                        <div>تومان</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DataLoader>
          </SectionContent>
          <SectionContent>
            <div className={styles.ContentHeader}>
              <div>
                <div>کاربران</div>
                <FilterSelect
                  options={{
                    daily: "روزانه",
                    weekly: "هفتگی",
                    monthly: "ماهانه",
                  }}
                  value={usersTicker}
                  onChange={setUsersTicker}
                />
              </div>
              <div>
                <div>
                  کل کاربران: <FormattedNumber value={usersData.totalUsers} />{" "}
                  کاربر
                </div>
              </div>
            </div>
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
                  label: englishToPersianNumbers(time),
                  value: count,
                }))}
                setTooltipData={setUsersTooltipData}
                hideY
              />
              {usersTooltipData && (
                <div
                  className={styles.UsersTooltip}
                  style={{
                    position: "absolute",
                    left: usersTooltipData.position.left,
                    top: usersTooltipData.position.top,
                  }}
                >
                  <div>
                    <FormattedNumber value={usersTooltipData.item.value} />{" "}
                    کاربر
                  </div>
                </div>
              )}
            </DataLoader>
          </SectionContent>
        </div>
        <div>
          <SectionContent>
            <div className={styles.ContentHeader}>
              <div>
                <div>سفارش ها</div>
                <FilterSelect
                  options={{
                    daily: "روزانه",
                    weekly: "هفتگی",
                    monthly: "ماهانه",
                  }}
                  value={ordersTicker}
                  onChange={setOrdersTicker}
                />
              </div>
              <div>
                <div>
                  کل سفارشات: <FormattedNumber value={ordersData.totalOrders} />{" "}
                  سفارش
                </div>
              </div>
            </div>
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
                  label: englishToPersianNumbers(time),
                  value: count,
                }))}
                setTooltipData={setOrdersTooltipData}
                hideY
              />
              {ordersTooltipData && (
                <div
                  className={styles.OrdersTooltip}
                  style={{
                    position: "absolute",
                    left: ordersTooltipData.position.left,
                    top: ordersTooltipData.position.top,
                  }}
                >
                  <div>
                    <FormattedNumber value={ordersTooltipData.item.value} />{" "}
                    سفارش
                  </div>
                </div>
              )}
            </DataLoader>
          </SectionContent>
          <SectionContent>
            <div className={styles.ContentHeader}>
              <div>
                <div>کاربر سفارش</div>
                <FilterSelect
                  options={{
                    daily: "روزانه",
                    weekly: "هفتگی",
                    monthly: "ماهانه",
                  }}
                  value={usersOrdersTicker}
                  onChange={setUsersOrdersTicker}
                />
                <FilterSelect
                  options={{
                    one: `${englishToPersianNumbers(1)} سفارش`,
                    two: `${englishToPersianNumbers(2)} سفارش`,
                    three: `${englishToPersianNumbers(3)} سفارش و بیشتر`,
                  }}
                  value={usersOrdersFilter}
                  onChange={setUsersOrdersFilter}
                  maxWidth={150}
                />
              </div>
              <div>
                <div className={styles.UsersOrdersSeeAll}>
                  مشاهده کل
                  <div className={styles.UsersOrdersSeeAllTooltip}>
                    <div>
                      <div>{englishToPersianNumbers(1)} سفارش:</div>
                      <div>
                        <FormattedNumber
                          value={usersOrdersData.totalUsersWithOneOrder}
                        />{" "}
                        کاربر
                      </div>
                    </div>
                    <div>
                      <div>{englishToPersianNumbers(2)} سفارش:</div>
                      <div>
                        <FormattedNumber
                          value={usersOrdersData.totalUsersWithTwoOrder}
                        />{" "}
                        کاربر
                      </div>
                    </div>
                    <div>
                      <div>{englishToPersianNumbers(3)} سفارش و بیشتر:</div>
                      <div>
                        <FormattedNumber
                          value={usersOrdersData.totalUsersWithThreeOrder}
                        />{" "}
                        کاربر
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DataLoader
              load={() =>
                request({
                  method: "GET",
                  url: `/admins/dashboard/users-orders/ticker/${usersOrdersTicker}`,
                  needAuth: true,
                  params: {
                    orders: usersOrdersFilter,
                  },
                }).then(({ data }) => data)
              }
              deps={[usersOrdersTicker, usersOrdersFilter]}
              setData={setUsersOrdersData}
              initialFetch={false}
            >
              <BarChart
                data={usersOrdersData.chart.map(({ time, count }) => ({
                  label: englishToPersianNumbers(time),
                  value: count,
                }))}
                setTooltipData={setUsersOrdersTooltipData}
                hideY
              />
              {usersOrdersTooltipData && (
                <div
                  className={styles.UsersOrdersTooltip}
                  style={{
                    position: "absolute",
                    left: usersOrdersTooltipData.position.left,
                    top: usersOrdersTooltipData.position.top,
                  }}
                >
                  <div>
                    <FormattedNumber
                      value={usersOrdersTooltipData.item.value}
                    />{" "}
                    کاربر
                  </div>
                </div>
              )}
            </DataLoader>
          </SectionContent>
        </div>
        <SectionContent>
          <div className={styles.ContentHeader}>
            <div>
              <div>سفارش بر اساس استان</div>
            </div>
          </div>
          <IranMap data={provincesOrders} />
        </SectionContent>
      </div>
    </div>
  );
}

interface DashboardMobilePorps {
  data: DashboardData;
}

export function DashboardMobile({ data }: DashboardMobilePorps) {
  return (
    <div className={styles.Mobile}>
      <div className={styles.User}>
        <Avatar user={data.admin} />
        <div className={styles.Meta}>
          <div className={styles.UserRole}>
            {
              {
                superAdmin: "سوپر ادمین",
                admin: "ادمین",
                agent: "نمایندگی",
              }[data.admin.role.name]
            }
          </div>
          <div className={styles.Name}>{data.admin.name}</div>
        </div>
      </div>
      <div className={styles.Welcome}>خوش‌آمدی!</div>
      <DashboardNavLinks sidebarData={data.sidebarData} />
    </div>
  );
}
