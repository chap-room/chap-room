import styles from "./style.module.scss";
import { useState } from "react";
import Link from "next/link";
import { PrintTariffs } from "@/shared/types";
import {
  useValidation,
  validateNotEmpty,
  validateInt,
} from "@/shared/utils/validation";
import { formatNumber } from "@/shared/utils/format";
import { useUserData } from "@/main/context/userData";
import Button from "@/shared/components/Button";
import Select from "@/shared/components/Select";
import TextInput from "@/shared/components/TextInput";
import ErrorList from "@/shared/components/ErrorList";

interface PrintPriceCalculatorProps {
  printTariffs: PrintTariffs;
}

export default function PrintPriceCalculator({
  printTariffs,
}: PrintPriceCalculatorProps) {
  const userData = useUserData();

  const [printColor, setPrintColor] = useState<
    "blackAndWhite" | "normalColor" | "fullColor" | null
  >(null);
  const [printSize, setPrintSize] = useState<"a4" | "a5" | "a3" | null>(null);
  const [printSide, setPrintSide] = useState<
    | "singleSided"
    | "doubleSided"
    | "singleSidedGlossy"
    | "doubleSidedGlossy"
    | null
  >(null);
  const [countOfPapers, setCountOfPapers] = useState("");

  const formValidation = useValidation(
    {
      printColor: [validateNotEmpty()],
      printSize: [validateNotEmpty()],
      printSide: [validateNotEmpty()],
      countOfPapers: [validateInt({ unsigned: true, min: 1 })],
    },
    {
      printColor,
      printSize,
      printSide,
      countOfPapers,
    }
  );

  let pagePrice = null;
  let calculatedPrice = null;
  if (formValidation.isValid) {
    const printPrice = printTariffs[printSize!][printColor!];
    const breakpoints = [
      {
        at: 1,
        singleSided: printPrice.singleSided,
        doubleSided: printPrice.doubleSided,
        singleSidedGlossy: printPrice.singleSidedGlossy,
        doubleSidedGlossy: printPrice.doubleSidedGlossy,
      },
      ...printPrice.breakpoints,
    ];
    let breakpoint = breakpoints[0];
    for (let item of breakpoints) {
      if (parseInt(countOfPapers) >= item.at) {
        breakpoint = item;
      }
    }
    pagePrice = breakpoint[printSide!];
    calculatedPrice = (parseInt(countOfPapers) || 0) * pagePrice;
  }

  return (
    <div className={styles.Calculator}>
      <div className={styles.Title}>
        از منوی زیر خدمات مورد نظر خود را انتخاب کنید
      </div>
      <div className={styles.Input}>
        <Select
          varient="shadow-without-bg"
          placeholder="سیاه و سفید / رنگی "
          options={{
            blackAndWhite: "سیاه و سفید",
            normalColor: "رنگی معمولی",
            fullColor: "تمام رنگی",
          }}
          value={printColor}
          onChange={setPrintColor}
          height={48}
        />
        <ErrorList errors={formValidation.errors.printColor} />
      </div>
      <div className={styles.Input}>
        <Select
          varient="shadow-without-bg"
          placeholder="اندازه کاغذ"
          options={{
            a4: "A4",
            a5: "A5",
            a3: "A3",
          }}
          value={printSize}
          onChange={setPrintSize}
          height={48}
        />
        <ErrorList errors={formValidation.errors.printSize} />
      </div>
      <div className={styles.Input}>
        <Select
          varient="shadow-without-bg"
          placeholder="یک رو / دو رو"
          options={{
            singleSided: "یک رو",
            doubleSided: "دو رو",
            singleSidedGlossy: "یک رو گلاسه",
            doubleSidedGlossy: "دو رو گلاسه",
          }}
          value={printSide}
          onChange={setPrintSide}
          height={48}
        />
        <ErrorList errors={formValidation.errors.printSide} />
      </div>
      <div className={styles.Row}>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number", placeholder: "تعداد" }}
            varient="shadow-without-bg"
            suffix="برگ"
            value={countOfPapers}
            onChange={setCountOfPapers}
            height={48}
          />
          <ErrorList errors={formValidation.errors.countOfPapers} />
        </div>
        <div>
          {pagePrice && (
            <>
              <span>قیمت هر برگ: </span>
              <span>{formatNumber(pagePrice)} تومان</span>
            </>
          )}
        </div>
      </div>
      {((printSide &&
        parseInt(countOfPapers) &&
        !isNaN(parseInt(countOfPapers))) ||
        false) && (
        <div>
          <span style={{ color: "#0077b5" }}>
            {countOfPapers} برگ{" "}
            {
              {
                singleSided: "یک رو",
                doubleSided: "دو رو",
                singleSidedGlossy: "یک رو",
                doubleSidedGlossy: "دو رو",
              }[printSide]
            }{" "}
            معادل{" "}
            <u>
              {parseInt(countOfPapers) *
                (printSide === "singleSided" ||
                printSide === "singleSidedGlossy"
                  ? 1
                  : 2)}{" "}
              صفحه
            </u>{" "}
            می باشد
          </span>
        </div>
      )}
      <div className={styles.Bottom}>
        {calculatedPrice && (
          <div>
            <div>قیمت کل: {formatNumber(calculatedPrice)} تومان</div>
          </div>
        )}
        <Link href={userData.isLoggedIn ? "/dashboard/orders/new" : "/login"}>
          <Button varient="gradient" style={{ padding: "0 30px" }}>
            سفارش پرینت
          </Button>
        </Link>
      </div>
    </div>
  );
}
