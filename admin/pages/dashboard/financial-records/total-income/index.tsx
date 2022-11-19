import styles from "./style.module.scss";
import { ReactElement, useState } from "react";
import { FormattedNumber, IntlShape, useIntl } from "react-intl";
import Head from "next/head";
import Link from "next/link";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import BarChart from "@/admin/components/BarChart";
import Button from "@/shared/components/Button";

function forrmateTime(intl: IntlShape, time: string) {
  if (time.includes("/")) {
    const splitedTime = time.split("/");
    return [
      intl.formatNumber(parseInt(splitedTime[0]), {
        minimumIntegerDigits: 2,
      }),
      intl.formatNumber(parseInt(splitedTime[1]), {
        minimumIntegerDigits: 2,
      }),
    ].join("/");
  } else if (!isNaN(parseInt(time))) {
    return intl.formatNumber(parseInt(time));
  } else {
    return time;
  }
}

export default function DashboardFinancialRecordsTotalIncome() {
  const intl = useIntl();

  const [tooltipData, setTooltipData] = useState<{
    item: {
      label: string;
      value: number;
      debtor: number;
      creditor: number;
    };
    position: { left: number; top: number };
  } | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - درامد کل</title>
      </Head>
      <SectionHeader
        title="سوابق مالی"
        description="سوابق مالی را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="درامد کل"
          end={
            <Link href="/dashboard/financial-records">
              <Button varient="content-title-none">
                بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/financial-records"
          title="درامد کل"
        />
        <BarChart
          data={[
            {
              label: forrmateTime(intl, "05/10"),
              value: 40000,
              debtor: 400000,
              creditor: 40000,
            },
            {
              label: forrmateTime(intl, "05/11"),
              value: 50000,
              debtor: 500000,
              creditor: 50000,
            },
            {
              label: forrmateTime(intl, "05/12"),
              value: 60000,
              debtor: 600000,
              creditor: 60000,
            },
            {
              label: forrmateTime(intl, "05/13"),
              value: 80000,
              debtor: 800000,
              creditor: 80000,
            },
            {
              label: forrmateTime(intl, "05/14"),
              value: 100000,
              debtor: 1000000,
              creditor: 100000,
            },
            {
              label: forrmateTime(intl, "05/15"),
              value: 80000,
              debtor: 800000,
              creditor: 80000,
            },
            {
              label: forrmateTime(intl, "05/16"),
              value: 60000,
              debtor: 600000,
              creditor: 60000,
            },
            {
              label: forrmateTime(intl, "05/17"),
              value: 80000,
              debtor: 800000,
              creditor: 80000,
            },
            {
              label: forrmateTime(intl, "05/18"),
              value: 130000,
              debtor: 1300000,
              creditor: 130000,
            },
            {
              label: forrmateTime(intl, "05/19"),
              value: 150000,
              debtor: 1500000,
              creditor: 150000,
            },
            {
              label: forrmateTime(intl, "05/20"),
              value: 200000,
              debtor: 2000000,
              creditor: 200000,
            },
            {
              label: forrmateTime(intl, "05/21"),
              value: 180000,
              debtor: 1800000,
              creditor: 180000,
            },
            {
              label: forrmateTime(intl, "05/22"),
              value: 140000,
              debtor: 1400000,
              creditor: 140000,
            },
            {
              label: forrmateTime(intl, "05/23"),
              value: 130000,
              debtor: 1300000,
              creditor: 130000,
            },
            {
              label: forrmateTime(intl, "05/24"),
              value: 110000,
              debtor: 1100000,
              creditor: 110000,
            },
            {
              label: forrmateTime(intl, "05/25"),
              value: 100000,
              debtor: 1000000,
              creditor: 100000,
            },
            {
              label: forrmateTime(intl, "05/26"),
              value: 130000,
              debtor: 1300000,
              creditor: 130000,
            },
            {
              label: forrmateTime(intl, "05/27"),
              value: 100000,
              debtor: 1000000,
              creditor: 100000,
            },
            {
              label: forrmateTime(intl, "05/28"),
              value: 70000,
              debtor: 700000,
              creditor: 70000,
            },
            {
              label: forrmateTime(intl, "05/29"),
              value: 50000,
              debtor: 500000,
              creditor: 50000,
            },
            {
              label: forrmateTime(intl, "05/30"),
              value: 40000,
              debtor: 400000,
              creditor: 40000,
            },
          ]}
          setTooltipData={setTooltipData}
        />
        {tooltipData && (
          <div
            className={styles.Tooltip}
            style={{
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
      </SectionContent>
    </>
  );
}

DashboardFinancialRecordsTotalIncome.getLayout = function getLayout(
  page: ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
