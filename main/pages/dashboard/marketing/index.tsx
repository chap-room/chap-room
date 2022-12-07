import styles from "./style.module.scss";
import { ReactElement, useState } from "react";
import Head from "next/head";
import { getMarketing } from "@/main/api";
import LinkIcon from "@/main/assets/icons/link.svg";
import PercentIcon from "@/main/assets/icons/percent.svg";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/DataLoader";
import CopyableText from "@/shared/components/CopyableText";
import { formatNumber } from "@/shared/utils/format";

export default function DashboardMarketing() {
  const [data, setData] = useState<{
    referral: {
      commission: number;
      slug: string;
      sellCount: number;
      viewCount: number;
      totalSale: number;
      benefit: number;
    };
    discount: {
      totalSales: number;
      benefit: number;
      timesUsed: number;
      data: {
        value: number;
        code: "XCKFR353";
      }[];
    };
  }>({
    referral: {
      commission: 10,
      slug: "",
      sellCount: 0,
      viewCount: 0,
      totalSale: 0,
      benefit: 0,
    },
    discount: {
      data: [],
      totalSales: 0,
      benefit: 0,
      timesUsed: 0,
    },
  });

  return (
    <>
      <Head>
        <title>داشبورد - پنل بازاریابی</title>
      </Head>
      <SectionHeader
        title="پنل بازاریابی"
        description="ــ با استفاده از این سیستم به راحتی می توانید درآمد برای خود ایجاد نمایید"
      />
      <SectionContent>
        <MobileContentHeader backTo="/dashboard" title="پنل بازاریابی" />
        <DataLoader load={() => getMarketing()} setData={setData}>
          <div className={styles.Container}>
            <div className={styles.DedicatedLink}>
              <div>
                <LinkIcon className={styles.LinkIcon} />
                <div className={styles.Title}>درباره لینک اختصاصی</div>
                <div className={styles.Description}>
                  شما می‌توانید با اشتراک گذاری <u>لینک اختصاصی خودتان</u> خود
                  کسب درآمد کنید. لازم به ذکر است پس از اولین بازدید از طریق
                  لینک شما تا یک ماه بعد (حتی اگر کاربر شما توسط لینک‌های دیگر
                  وارد سایت چاپ روم شود) کاربر خریدی انجام دهد،{" "}
                  <span className={styles.Highlight}>
                    {data!.referral.commission} درصد از خرید آن مشتری
                  </span>{" "}
                  در پنل بازاریابی شما لحاظ می‌شود.
                </div>
              </div>
              <div>
                <div className={styles.Title}>لینک اختصاصی شما</div>
                <CopyableText
                  text={`https://chaproom.com/?${data!.referral.slug}`}
                >
                  <div style={{ color: "#7d00ff" }}>
                    https://chaproom.com/?{data!.referral.slug}
                  </div>
                </CopyableText>
                <div className={styles.Status}>
                  <div>
                    <div>تعداد مشاهده</div>
                    <div>{formatNumber(data!.referral.viewCount)}</div>
                  </div>
                  <div className={styles.Separator} />
                  <div>
                    <div>تعداد فروش</div>
                    <div>{formatNumber(data!.referral.sellCount)}</div>
                  </div>
                  <div className={styles.Separator} />
                  <div>
                    <div>کل فروش</div>
                    <div>{formatNumber(data!.referral.totalSale)} تومان</div>
                  </div>
                  <div className={styles.Separator} />
                  <div>
                    <div>سهم کاربر</div>
                    <div>{formatNumber(data!.referral.benefit)} تومان</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.Separator} />
            <div className={styles.DedicatedDiscountCodes}>
              <div>
                <PercentIcon className={styles.PercentIcon} />
                <div className={styles.Title}>درباره کدهای تخفیف اختصاصی</div>
                <div className={styles.Description}>
                  شما می‌توانید با اشتراک گذاری <u>کد تخفیف اختصاصی خودتان</u>{" "}
                  نیم یا تمام سهم خود از بازاریابی را به دیگران هدیه دهید.
                </div>
              </div>
              <div>
                <div className={styles.Title}>کدهای تخفیف اختصاصی شما</div>
                <div className={styles.DiscountCodes}>
                  {data!.discount.data.map((item) => (
                    <div key={item.value}>
                      <span>کد تخفیف {item.value}٪</span>
                      <CopyableText text={item.code}>
                        <div style={{ color: "#7d00ff" }}>{item.code}</div>
                      </CopyableText>
                    </div>
                  ))}
                </div>
                <div className={styles.Status}>
                  <div>
                    <div>دفعات استفاده</div>
                    <div>{formatNumber(data!.discount.timesUsed)}</div>
                  </div>
                  <div className={styles.Separator} />
                  <div>
                    <div>کل فروش</div>
                    <div>{formatNumber(data!.discount.totalSales)} تومان</div>
                  </div>
                  <div className={styles.Separator} />
                  <div>
                    <div>سهم کاربر</div>
                    <div>{formatNumber(data!.discount.benefit)} تومان</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardMarketing.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
