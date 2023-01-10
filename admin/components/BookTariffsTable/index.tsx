import styles from "./style.module.scss";
import { BookTariffs } from "@/shared/types";
import { formatNumber } from "@/shared/utils/format";

interface BookTariffsTableProps {
  bookTariffs: BookTariffs;
  onEditBookPrices: (
    bookSize: "rahli" | "raqai" | "vaziri",
    bookPaperType: "writing80Grams",
    bookBindingType: "hotGlue"
  ) => void;
}

export default function BookTariffsTable({
  bookTariffs,
  onEditBookPrices,
}: BookTariffsTableProps) {
  return (
    <table className={styles.BookTariffsTable}>
      <thead>
        <tr>
          <th>قطع کتاب</th>
          <th>کاغذ</th>
          <th>نوع صحافی</th>
          <th>قیمت هر صفحه</th>
          <th>ویرایش</th>
        </tr>
      </thead>
      <tbody>
        {(
          [
            ["rahli", "writing80Grams", "hotGlue"],
            ["raqai", "writing80Grams", "hotGlue"],
            ["vaziri", "writing80Grams", "hotGlue"],
          ] as const
        ).map(([size, paperType, bindingType]) => (
          <tr key={`${size}-${paperType}-${bindingType}`}>
            <td>
              <span className={styles.MobileLabel}>قطع کتاب:</span>
              {
                {
                  rahli: "رحلی",
                  raqai: "رقعی",
                  vaziri: "وزیری",
                }[size]
              }
            </td>
            <td>
              <span className={styles.MobileLabel}>نوع کاغذ:</span>
              {
                {
                  writing80Grams: "تحریر 80 گرمی",
                }[paperType]
              }
            </td>
            <td>
              <span className={styles.MobileLabel}>نوع صحافی:</span>
              {
                {
                  hotGlue: "چسب گرم",
                }[bindingType]
              }
            </td>
            <td>
              <span className={styles.MobileLabel}>قیمت هر صفحه:</span>
              {formatNumber(bookTariffs[size][paperType][bindingType])} تومان
            </td>
            <td>
              <button
                className={styles.EditButton}
                onClick={() => onEditBookPrices(size, paperType, bindingType)}
              >
                ویرایش
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
