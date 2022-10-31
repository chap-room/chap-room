import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { DiscountCode, DiscountType } from "@/shared/types";
import EditIcon from "@/shared/assets/icons/edit.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import ToggleOffIcon from "@/admin/assets/icons/toggleOff.svg";
import ToggleOnIcon from "@/admin/assets/icons/toggleOn.svg";
import IconButton from "@/shared/components/IconButton";

interface DiscountCodeTableProps {
  discountCodes: DiscountCode[];
  onEditDiscountCode: (discountCodeId: string) => void;
  onActivateDiscountCode: (discountCodeId: string) => void;
  onInactivateDiscountCode: (discountCodeId: string) => void;
  onDeleteDiscountCode: (discountCodeId: string) => void;
}

export default function DiscountCodeTable({
  discountCodes,
  onEditDiscountCode,
  onActivateDiscountCode,
  onInactivateDiscountCode,
  onDeleteDiscountCode,
}: DiscountCodeTableProps) {
  return (
    <table className={styles.DiscountCodeTable}>
      <thead>
        <tr>
          <th>کد</th>
          <th>نوع</th>
          <th>تنظیمات تخفیف</th>
          <th>وضعیت</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {discountCodes.map((discountCode) => (
          <tr key={discountCode.code}>
            <td>
              <span className={styles.MobileLabel}>کد:</span>
              <div>
                <div className={styles.Code}>{discountCode.code}</div>
                <div>{discountCode.description}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>نوع:</span>
              {discountCode.customer !== null ? (
                <span>
                  <span>{discountCode.customer!.name}</span>
                  <br />
                  <span>{discountCode.customer!.phoneNumber}</span>
                </span>
              ) : (
                <span>عمومی</span>
              )}
            </td>
            <td>
              <span className={styles.MobileLabel}>تنظیمات تخفیف:</span>
              <span className={styles.DiscountSettings}>
                <span>
                  <span>مقدار:</span>
                  <span>
                    {discountCode.discountType === DiscountType.fixedAmount ? (
                      <>
                        <FormattedNumber value={discountCode.discountValue} />{" "}
                        تومان
                      </>
                    ) : discountCode.discountType ===
                      DiscountType.numberOfPages ? (
                      <>
                        <FormattedNumber value={discountCode.discountValue} />{" "}
                        صفحه
                      </>
                    ) : discountCode.discountType ===
                      DiscountType.percentage ? (
                      <>
                        <FormattedNumber value={discountCode.discountValue} />{" "}
                        درصد
                      </>
                    ) : (
                      <></>
                    )}
                  </span>
                </span>
                {discountCode.percentageDiscountCeiling && (
                  <span>
                    <span>سقف تخفیف درصدی:</span>
                    <span>
                      <FormattedNumber
                        value={discountCode.percentageDiscountCeiling}
                      />{" "}
                      تومان
                    </span>
                  </span>
                )}
                {discountCode.minPageCount && (
                  <span>
                    <span>حداقل تعداد صفحات:</span>
                    <span>
                      <FormattedNumber value={discountCode.minPageCount} /> صفحه
                    </span>
                  </span>
                )}
                {discountCode.maxPageCount && (
                  <span>
                    <span>حداکثر تعداد صفحات:</span>
                    <span>
                      <FormattedNumber value={discountCode.maxPageCount} /> صفحه
                    </span>
                  </span>
                )}
                {discountCode.minOrderAmount && (
                  <span>
                    <span>حداقل مبلغ سفارش:</span>
                    <span>
                      <FormattedNumber value={discountCode.minOrderAmount} />{" "}
                      تومان
                    </span>
                  </span>
                )}
                {discountCode.maxOrderAmount && (
                  <span>
                    <span>حداکثر مبلغ سفارش:</span>
                    <span>
                      <FormattedNumber value={discountCode.maxOrderAmount} />{" "}
                      تومان
                    </span>
                  </span>
                )}
                {discountCode.usageLimit && (
                  <span>
                    <span>محدودیت استفاده:</span>
                    <span>
                      <FormattedNumber value={discountCode.usageLimit} /> بار /{" "}
                      <FormattedNumber value={discountCode.timesUsed || 0} />{" "}
                      بار
                    </span>
                  </span>
                )}
                {discountCode.expirationDate && (
                  <span>
                    <span>تاریخ انقضا:</span>
                    <span>
                      <FormattedDate
                        value={discountCode.expirationDate}
                        dateStyle="medium"
                      />{" "}
                      <FormattedTime
                        value={discountCode.expirationDate}
                        hour12
                      />
                    </span>
                  </span>
                )}
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>وضعیت:</span>
              <span
                className={
                  discountCode.active ? styles.Active : styles.Inactive
                }
              >
                {discountCode.active ? "فعال" : "غیر فعال"}
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>عملیات:</span>
              <div className={styles.OperationButtons}>
                <div
                  className={
                    discountCode.active ? styles.InactiveButton : styles.ActiveButton
                  }
                >
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() =>
                      discountCode.active
                        ? onInactivateDiscountCode(discountCode.id)
                        : onActivateDiscountCode(discountCode.id)
                    }
                  >
                    {discountCode.active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                  </IconButton>
                </div>
                <div className={styles.EditButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onEditDiscountCode(discountCode.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
                <div className={styles.DeleteButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onDeleteDiscountCode(discountCode.id)}
                  >
                    <DeletetIcon />
                  </IconButton>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
