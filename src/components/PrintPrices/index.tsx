import styles from "./style.module.scss";
import { FormattedNumber } from "react-intl";
import { PrintColors } from "../../types";
import Tabs from "../Dashboard/Tabs";

export default function PrintPrices() {
  return (
    <Tabs
      tabs={[
        {
          id: PrintColors.blackAndWhite,
          label: PrintColors.blackAndWhite,
          content: (
            <table className={styles.PrintPricesTable}>
              <thead>
                <tr>
                  <th>تعداد برگ</th>
                  <th>قیمت یک رو</th>
                  <th>قیمت دو رو</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <FormattedNumber value={1} useGrouping={false} />-
                    <FormattedNumber value={500} useGrouping={false} />
                  </td>
                  <td>
                    <FormattedNumber value={480} useGrouping={false} /> تومان
                  </td>
                  <td>
                    <FormattedNumber value={620} useGrouping={false} /> تومان
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedNumber value={501} useGrouping={false} />-
                    <FormattedNumber value={1000} useGrouping={false} />
                  </td>
                  <td>
                    <FormattedNumber value={460} useGrouping={false} /> تومان
                  </td>
                  <td>
                    <FormattedNumber value={580} useGrouping={false} /> تومان
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedNumber value={1001} useGrouping={false} /> به بالا
                  </td>
                  <td>
                    <FormattedNumber value={430} useGrouping={false} /> تومان
                  </td>
                  <td>
                    <FormattedNumber value={560} useGrouping={false} /> تومان
                  </td>
                </tr>
              </tbody>
            </table>
          ),
        },
        {
          id: PrintColors.normalColor,
          label: PrintColors.normalColor,
          content: (
            <table className={styles.PrintPricesTable}>
              <thead>
                <tr>
                  <th>تعداد برگ</th>
                  <th>قیمت یک رو</th>
                  <th>قیمت دو رو</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1-500</td>
                  <td>480 تومان</td>
                  <td>620 تومان</td>
                </tr>
                <tr>
                  <td>501-1000</td>
                  <td>460 تومان</td>
                  <td>580 تومان</td>
                </tr>
                <tr>
                  <td>1001 به بالا</td>
                  <td>430 تومان</td>
                  <td>560 تومان</td>
                </tr>
              </tbody>
            </table>
          ),
        },
        {
          id: PrintColors.fullColor,
          label: PrintColors.fullColor,
          content: (
            <table className={styles.PrintPricesTable}>
              <thead>
                <tr>
                  <th>تعداد برگ</th>
                  <th>قیمت یک رو</th>
                  <th>قیمت دو رو</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1-500</td>
                  <td>480 تومان</td>
                  <td>620 تومان</td>
                </tr>
                <tr>
                  <td>501-1000</td>
                  <td>460 تومان</td>
                  <td>580 تومان</td>
                </tr>
                <tr>
                  <td>1001 به بالا</td>
                  <td>430 تومان</td>
                  <td>560 تومان</td>
                </tr>
              </tbody>
            </table>
          ),
        },
      ]}
    />
  );
}
