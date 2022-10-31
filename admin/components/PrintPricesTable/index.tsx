import styles from "./style.module.scss";
import {
  AllPrintPrices,
  PrintSize,
  PrintColor,
  PrintPrices,
  PrintSide,
} from "@/shared/types";
import { FormattedNumber } from "react-intl";

interface PrintPricesTableProps {
  allPrintPrices: AllPrintPrices;
  onEditPrintPrices: (
    printSize: PrintSize,
    printColor: PrintColor
  ) => void;
}

export default function PrintPricesTable({
  allPrintPrices,
  onEditPrintPrices,
}: PrintPricesTableProps) {
  return (
    <table className={styles.OrderTable}>
      <thead>
        <tr>
          <th>سایز کاغذ</th>
          <th>نوع</th>
          <th>یک رو</th>
          <th>دو رو</th>
          <th>یک رو گلاسه</th>
          <th>دو رو گلاسه</th>
          <th>ویرایش</th>
        </tr>
      </thead>
      <tbody>
        {(
          [
            [PrintSize.a4, PrintColor.blackAndWhite],
            [PrintSize.a4, PrintColor.normalColor],
            [PrintSize.a4, PrintColor.fullColor],
            [PrintSize.a3, PrintColor.blackAndWhite],
            [PrintSize.a3, PrintColor.normalColor],
            [PrintSize.a3, PrintColor.fullColor],
            [PrintSize.a5, PrintColor.blackAndWhite],
            [PrintSize.a5, PrintColor.normalColor],
            [PrintSize.a5, PrintColor.fullColor],
          ] as [PrintSize, PrintColor][]
        ).map(([printSize, printColor]) => (
          <tr key={printSize + "-" + printColor}>
            <td>
              <span className={styles.MobileLabel}>سایز کاغذ:</span>
              {printSize}
            </td>
            <td>
              <span className={styles.MobileLabel}>نوع:</span>
              {printColor}
            </td>
            <td>
              <span className={styles.MobileLabel}>یک رو:</span>
              <PrintPricesView
                printPrices={allPrintPrices[printSize][printColor]}
                printSide={PrintSide.singleSided}
              />
            </td>
            <td>
              <span className={styles.MobileLabel}>دو رو:</span>
              <PrintPricesView
                printPrices={allPrintPrices[printSize][printColor]}
                printSide={PrintSide.doubleSided}
              />
            </td>
            <td>
              <span className={styles.MobileLabel}>یک رو گلاسه:</span>
              <PrintPricesView
                printPrices={allPrintPrices[printSize][printColor]}
                printSide={PrintSide.singleSidedGlossy}
              />
            </td>
            <td>
              <span className={styles.MobileLabel}>دو رو گلاسه:</span>
              <PrintPricesView
                printPrices={allPrintPrices[printSize][printColor]}
                printSide={PrintSide.doubleSidedGlossy}
              />
            </td>
            <td>
              <button
                className={styles.EditButton}
                onClick={() => onEditPrintPrices(printSize, printColor)}
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

interface PrintPricesViewProps {
  printPrices: PrintPrices;
  printSide: PrintSide;
}

function PrintPricesView({ printPrices, printSide }: PrintPricesViewProps) {
  const breakpoints = [
    {
      at: 1,
      [PrintSide.singleSided]: printPrices[PrintSide.singleSided],
      [PrintSide.doubleSided]: printPrices[PrintSide.doubleSided],
      [PrintSide.singleSidedGlossy]: printPrices[PrintSide.singleSidedGlossy],
      [PrintSide.doubleSidedGlossy]: printPrices[PrintSide.doubleSidedGlossy],
    },
    ...printPrices.breakpoints,
  ];

  return (
    <div className={styles.PrintPricesView}>
      {breakpoints.map((breakpoint, index) => {
        const nextBreakpoints = breakpoints[index + 1];

        if (nextBreakpoints) {
          return (
            <span>
              <FormattedNumber value={breakpoint.at} /> -{" "}
              <FormattedNumber value={nextBreakpoints.at - 1} />:{" "}
              <FormattedNumber value={breakpoint[printSide]} /> تومان
            </span>
          );
        } else {
          return (
            <span>
              <FormattedNumber value={breakpoint.at} /> به بالا:{" "}
              <FormattedNumber value={breakpoint[printSide]} /> تومان
            </span>
          );
        }
      })}
    </div>
  );
}
