import styles from "./style.module.scss";
import { ReactElement, useState } from "react";
import { FormattedNumber, IntlShape, useIntl } from "react-intl";
import moment from "jalali-moment";
import Head from "next/head";
import Link from "next/link";
import { request } from "@/admin/api";
import { englishToPersianNumbers } from "@/shared/utils/numbers";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Controls from "@/admin/components/Controls";
import Filters from "@/admin/components/Filters";
import FilterSelect from "@/admin/components/FilterSelect";
import FilterDate from "@/admin/components/FilterDate";
import DataLoader from "@/shared/components/DataLoader";
import BarChart from "@/admin/components/BarChart";
import Button from "@/shared/components/Button";

const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export default function DashboardFinancialRecordsTotalIncome() {
  const intl = useIntl();

  const [data, setData] = useState<{
    totalDebtor: number;
    totalCreditor: number;
    chart: {
      time: string;
      debtor: number;
      creditor: number;
    }[];
  }>({
    totalDebtor: 0,
    totalCreditor: 0,
    chart: [],
  });

  const [tooltipData, setTooltipData] = useState<{
    item: {
      label: string;
      value: number;
      debtor: number;
      creditor: number;
    };
    position: { left: number; top: number };
  } | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [ticker, setTicker] = useState<"monthly" | "yearly">("monthly");
  const [month, setMonth] = useState(moment().jMonth().toString());

  return (
    <>
      <Head>
        <title>داشبورد - درامد کل</title>
      </Head>
      <AdminSectionHeader
        title="سوابق مالی"
        description="ــ سوابق مالی را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="درامد کل"
          subTitle={
            <div className={styles.SubTitle}>
              {data.totalCreditor !== 0 && (
                <div>
                  {"("}بستانکار کل: <FormattedNumber value={data.totalCreditor} />{" "}
                  تومان{")"}
                </div>
              )}
              {data.totalDebtor !== 0 && (
                <div style={{ color: "#f20f4b" }}>
                  {"("}بدهکار کل: <FormattedNumber value={data.totalDebtor} />{" "}
                  تومان{")"}
                </div>
              )}
            </div>
          }
          end={
            <Link href="/dashboard/financial-records">
              <Button varient="none" style={{ padding: 0 }}>
                بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/financial-records"
          title="درامد کل"
        />
        <Controls
          start={
            <div className={styles.TickerSelect}>
              <div>
                دوره:
                <FilterSelect
                  options={{
                    monthly: "ماهانه",
                    yearly: "سالانه",
                  }}
                  value={ticker}
                  onChange={setTicker}
                  width={130}
                  maxWidth={130}
                />
              </div>
              {ticker === "monthly" && (
                <div>
                  ماه:
                  <FilterSelect
                    options={{
                      "0": months[0],
                      "1": months[1],
                      "2": months[2],
                      "3": months[3],
                      "4": months[4],
                      "5": months[5],
                      "6": months[6],
                      "7": months[7],
                      "8": months[8],
                      "9": months[9],
                      "10": months[10],
                      "11": months[11],
                    }}
                    value={month}
                    onChange={setMonth}
                    width={130}
                    maxWidth={130}
                  />
                </div>
              )}
            </div>
          }
          end={
            <Filters
              removeFilters={() => {
                setStartDate(null);
                setEndDate(null);
              }}
              rows={[
                [
                  <FilterDate
                    value={startDate}
                    onChange={setStartDate}
                    width={130}
                    maxWidth={130}
                    placeholder="از تاریخ"
                  />,
                  <FilterDate
                    value={endDate}
                    onChange={setEndDate}
                    width={130}
                    maxWidth={130}
                    placeholder="تا تاریخ"
                  />,
                ],
              ]}
            />
          }
        />
        <DataLoader
          load={() =>
            request({
              method: "GET",
              url: `/admins/transactions/total/ticker/${ticker}`,
              needAuth: true,
              params: {
                month: month + 1,
                startAt: startDate?.toISOString() || undefined,
                endAt: endDate?.toISOString() || undefined,
              },
            }).then(({ data }) => data)
          }
          deps={[ticker, month, startDate, endDate]}
          setData={setData}
        >
          <BarChart
            data={data.chart.map(({ time, creditor, debtor }) => ({
              label:
                ticker === "monthly"
                  ? englishToPersianNumbers(time)
                  : months[parseInt(time) - 1],
              value: creditor - debtor,
              creditor,
              debtor,
            }))}
            setTooltipData={setTooltipData}
          />
          {tooltipData && (
            <div
              className={styles.Tooltip}
              style={{
                position: "absolute",
                left: tooltipData.position.left,
                top: tooltipData.position.top,
              }}
            >
              <div>
                <div>
                  <div>بستانکار:</div>
                  <div>
                    <div>
                      <FormattedNumber value={tooltipData.item.creditor} />
                    </div>
                    <div>تومان</div>
                  </div>
                </div>
                <div>
                  <div>بدهکار:</div>
                  <div>
                    <div>
                      <FormattedNumber value={tooltipData.item.debtor} />
                    </div>
                    <div>تومان</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardFinancialRecordsTotalIncome.getLayout = function getLayout(
  page: ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
