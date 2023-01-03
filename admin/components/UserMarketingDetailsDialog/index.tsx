import styles from "./style.module.scss";
import { useState } from "react";
import { getUserMarketing } from "@/admin/api";
import { User } from "@/shared/types";
import { formatNumber } from "@/shared/utils/format";
import Dialog from "@/shared/components/Dialog";
import DataLoader from "@/shared/components/DataLoader";
import CopyableText from "@/shared/components/CopyableText";

interface UserMarketingDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

export default function UserMarketingDetailsDialog({
  open,
  onClose,
  userId,
}: UserMarketingDetailsDialogProps) {
  const [data, setData] = useState<{
    user: User | null;
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
    user: null,
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
    <Dialog
      open={open}
      onClose={onClose}
      title="اطلاعات بازاریابی"
      subTitle={
        data.user ? `(${data.user.name} / ${data.user.phoneNumber})` : undefined
      }
      fullScreenInMobile
    >
      <DataLoader
        load={() => {
          if (userId !== null) return getUserMarketing(userId);
        }}
        deps={[userId]}
        setData={setData}
      >
        <div className={styles.Container}>
          <div className={styles.DedicatedLink}>
            <div className={styles.Title}>لینک اختصاصی شما</div>
            <CopyableText text={`https://chaproom.com/?${data!.referral.slug}`}>
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
          <div className={styles.Separator} />
          <div className={styles.DedicatedDiscountCodes}>
            <div className={styles.Title}>کدهای تخفیف اختصاصی شما</div>
            <div className={styles.DiscountCodes}>
              {data!.discount.data.map((item) => (
                <div key={item.value}>
                  <span>کد تخفیف {item.value}٪</span>
                  <CopyableText text={item.code}>{item.code}</CopyableText>
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
      </DataLoader>
    </Dialog>
  );
}
