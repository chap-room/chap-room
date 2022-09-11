import styles from "./style.module.scss";
import Section from "../../../../components/Dashboard/Section";
import { ReactComponent as LinkIcon } from "../../../../assets/icons/link.svg";
import { ReactComponent as PercentIcon } from "../../../../assets/icons/percent.svg";
import CopyableText from "../../../../components/CopyableText";
import { FormattedNumber } from "react-intl";

export default function DashboardMarketing() {
  return (
    <Section
      title="بازاریابی"
      description="با استفاده از این سیستم می توانید به راحتی برای خود درآمدزایی کنید"
    >
      <div className={styles.Container}>
        <div className={styles.DedicatedLink}>
          <div>
            <LinkIcon className={styles.LinkIcon} />
            <div className={styles.Title}>درباره لینک اختصاصی</div>
            <div className={styles.Description}>
              شما می‌توانید با اشتراک گذاری <u>لینک اختصاصی خودتان</u> خود کسب
              درآمد کنید. لازم به ذکر است پس از اولین بازدید از طریق لینک شما تا
              یک ماه بعد (حتی اگر کاربر شما توسط لینک‌های دیگر وارد سایت چاپ روم
              شود) کاربر خریدی انجام دهد، 10 درصد از خرید آن مشتری در پنل
              بازاریابی شما لحاظ می‌شود.
            </div>
          </div>
          <div>
            <div className={styles.Title}>لینک اختصاصی شما</div>
            <CopyableText text="https://chaproom.ir/ref=1615" />
            <div className={styles.Status}>
              <div>
                <div>تعداد کلیک</div>
                <div>
                  <FormattedNumber value={8451} />
                </div>
              </div>
              <div className={styles.Separator} />
              <div>
                <div>تعداد فروش</div>
                <div>
                  <FormattedNumber value={451} />
                </div>
              </div>
              <div className={styles.Separator} />
              <div>
                <div>کل فروش</div>
                <div>
                  <FormattedNumber value={20000000} /> تومان
                </div>
              </div>
              <div className={styles.Separator} />
              <div>
                <div>سهم کاربر</div>
                <div>
                  <FormattedNumber value={2000000} /> تومان
                </div>
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
              شما می‌توانید با اشتراک گذاری <u>کد تخفیف اختصاصی خودتان</u> نیم
              یا تمام سهم خود از بازاریابی را به دیگران هدیه دهید.
            </div>
          </div>
          <div>
            <div className={styles.Title}>کدهای تخفیف اختصاصی شما</div>
            <div className={styles.DiscountCodes}>
              <div>
                <span>
                  {/* eslint-disable-next-line react/style-prop-object */}
                  کد تخفیف <FormattedNumber value={0.1} style="percent" />
                </span>
                <CopyableText text="HGVFCD" />
              </div>
              <div>
                  {/* eslint-disable-next-line react/style-prop-object */}
                  کد تخفیف <FormattedNumber value={0.05} style="percent" />
                <CopyableText text="NC5WFh" />
              </div>
            </div>
            <div className={styles.Status}>
              <div>
                <div>دفعات استفاده</div>
                <div>
                  <FormattedNumber value={451} />
                </div>
              </div>
              <div className={styles.Separator} />
              <div>
                <div>کل فروش</div>
                <div>
                  <FormattedNumber value={20000000} /> تومان
                </div>
              </div>
              <div className={styles.Separator} />
              <div>
                <div>سهم کاربر</div>
                <div>
                  <FormattedNumber value={2000000} /> تومان
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}