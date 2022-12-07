import styles from "./style.module.scss";
import { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import { request } from "@/admin/api";
import { formatNumber } from "@/shared/utils/format";
import { DashboardData, useDashboardData } from "@/admin/context/dashboardData";
import Avatar from "@/shared/components/Dashboard/Avatar";
import DashboardLayout from "@/admin/components/Layout";
import DashboardNavLinks from "@/admin/components/NavLinks";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import BarChart, { ChartTooltipData } from "@/admin/components/BarChart";
import IranMap from "@/admin/components/IranMap";
import DataLoader, { DataLoaderView } from "@/shared/components/DataLoader";
import FilterSelect from "@/admin/components/FilterSelect";

export default function DashboardMain() {
  const dashboardData = useDashboardData();

  useEffect(() => {
    if (!dashboardData.loaderState.isLoading) {
      dashboardData.loaderState.reload();
    }
  }, []);

  return (
    <>
      <Head>
        <title>داشبورد</title>
      </Head>
      <AdminSectionHeader title="داشبورد" />
      <DataLoaderView state={dashboardData.loaderState}>
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
  const [salesTicker, setSalesTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [salesData, setSalesData] = useState(data.sales);
  const [salesTooltipData, setSalesTooltipData] = useState<ChartTooltipData<{
    label: string;
    value: number;
    debtor: number;
    creditor: number;
  }> | null>(null);

  const [usersTicker, setUsersTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [usersData, setUsersData] = useState(data.users);
  const [usersTooltipData, setUsersTooltipData] = useState<ChartTooltipData<{
    label: string;
    value: number;
  }> | null>(null);

  const [ordersTicker, setOrdersTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [ordersData, setOrdersData] = useState(data.orders);
  const [ordersTooltipData, setOrdersTooltipData] = useState<ChartTooltipData<{
    label: string;
    value: number;
  }> | null>(null);

  const [usersOrdersTicker, setUsersOrdersTicker] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [usersOrdersFilter, setUsersOrdersFilter] = useState<
    "one" | "two" | "three"
  >("one");
  const [usersOrdersData, setUsersOrdersData] = useState(data.usersOrders);
  const [usersOrdersTooltipData, setUsersOrdersTooltipData] =
    useState<ChartTooltipData<{
      label: string;
      value: number;
    }> | null>(null);

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
                <div>کل فروش: {formatNumber(salesData.totalSales)} تومان</div>
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
                  label: time,
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
                          {formatNumber(salesTooltipData.item.creditor)}
                        </div>
                        <div>تومان</div>
                      </div>
                    </div>
                    <div>
                      <div>بدهکار:</div>
                      <div>
                        <div>{formatNumber(salesTooltipData.item.debtor)}</div>
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
                  کل کاربران: {formatNumber(usersData.totalUsers)} کاربر
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
                  label: time,
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
                  <div>{formatNumber(usersTooltipData.item.value)} کاربر</div>
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
                  کل سفارشات: {formatNumber(ordersData.totalOrders)} سفارش
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
                  label: time,
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
                  <div>{formatNumber(ordersTooltipData.item.value)} سفارش</div>
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
                    one: "1 سفارش",
                    two: "2 سفارش",
                    three: "3 سفارش و بیشتر",
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
                      <div>1 سفارش:</div>
                      <div>
                        {formatNumber(usersOrdersData.totalUsersWithOneOrder)}{" "}
                        کاربر
                      </div>
                    </div>
                    <div>
                      <div>2 سفارش:</div>
                      <div>
                        {formatNumber(usersOrdersData.totalUsersWithTwoOrder)}{" "}
                        کاربر
                      </div>
                    </div>
                    <div>
                      <div>3 سفارش و بیشتر:</div>
                      <div>
                        {formatNumber(usersOrdersData.totalUsersWithThreeOrder)}{" "}
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
                  label: time,
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
                    {formatNumber(usersOrdersTooltipData.item.value)} کاربر
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
          <IranMap data={data.provincesOrders} />
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
