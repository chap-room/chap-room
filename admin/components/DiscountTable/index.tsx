import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { Discount, DiscountType } from "@/shared/types";
import EditIcon from "@/shared/assets/icons/edit.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import IconButton from "@/shared/components/IconButton";

interface DiscountTableProps {
  discounts: Discount[];
  onEditDiscount: (discountId: number) => void;
  onDeleteDiscount: (discountId: number) => void;
}

export default function DiscountTable({
  discounts,
  onEditDiscount,
  onDeleteDiscount,
}: DiscountTableProps) {
  return (
    <table className={styles.DiscountTable}>
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
        {discounts.map((discount) => (
          <tr key={discount.id}>
            <td>
              <span className={styles.MobileLabel}>کد:</span>
              <div>
                <div className={styles.Code}>{discount.code}</div>
                <div>{discount.description}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>نوع:</span>
              {discount.user !== null ? (
                <span>
                  <span>{discount.user!.name}</span>
                  <br />
                  <span>{discount.user!.phoneNumber}</span>
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
                    {discount.discountType === DiscountType.fixedAmount ? (
                      <>
                        <FormattedNumber value={discount.discountValue} />{" "}
                        تومان
                      </>
                    ) : discount.discountType ===
                      DiscountType.countOfPages ? (
                      <>
                        <FormattedNumber value={discount.discountValue} />{" "}
                        صفحه
                      </>
                    ) : discount.discountType ===
                      DiscountType.percentage ? (
                      <>
                        <FormattedNumber value={discount.discountValue} />{" "}
                        درصد
                      </>
                    ) : (
                      <></>
                    )}
                  </span>
                </span>
                {discount.usageLimit && (
                  <span>
                    <span>محدودیت استفاده:</span>
                    <span>
                      <FormattedNumber value={discount.usageLimit} /> بار /{" "}
                      <FormattedNumber value={discount.timesUsed || 0} />{" "}
                      بار
                    </span>
                  </span>
                )}
                {discount.expireDate && (
                  <span>
                    <span>تاریخ انقضا:</span>
                    <span>
                      <FormattedDate
                        value={discount.expireDate}
                        dateStyle="medium"
                      />{" "}
                      <FormattedTime
                        value={discount.expireDate}
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
                  discount.active ? styles.Active : styles.Inactive
                }
              >
                {discount.active ? "فعال" : "غیر فعال"}
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>عملیات:</span>
              <div className={styles.OperationButtons}>
                <div className={styles.EditButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onEditDiscount(discount.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
                <div className={styles.DeleteButton}>
                  <IconButton
                    varient="none"
                    size={34}
                    onClick={() => onDeleteDiscount(discount.id)}
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