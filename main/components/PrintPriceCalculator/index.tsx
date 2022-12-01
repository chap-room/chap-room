import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { FormattedNumber } from "react-intl";
import Link from "next/link";
import { PrintTariffs } from "@/shared/types";
import {
  useValidation,
  validateNotEmpty,
  validateInt,
} from "@/shared/utils/validation";
import Button from "@/shared/components/Button";
import Select from "@/shared/components/Select";
import TextInput from "@/shared/components/TextInput";
import ErrorList from "@/shared/components/ErrorList";
import { isLoggedIn } from "@/main/api";

interface PrintPriceCalculatorProps {
  printTariffs: PrintTariffs;
}

export default function PrintPriceCalculator({
  printTariffs,
}: PrintPriceCalculatorProps) {
  const [printColor, setPrintColor] = useState<
    "blackAndWhite" | "normalColor" | "fullColor" | null
  >(null);
  const [printSize, setPrintSize] = useState<"a4" | "a5" | "a3" | null>(null);
  const [printSide, setPrintSide] = useState<
    "singleSided" | "doubleSided" | null
  >(null);
  const [countOfPages, setCountOfPages] = useState("");

  const formValidation = useValidation(
    {
      printColor: [validateNotEmpty()],
      printSize: [validateNotEmpty()],
      printSide: [validateNotEmpty()],
      countOfPages: [validateInt({ unsigned: true, min: 1 })],
    },
    {
      printColor,
      printSize,
      printSide,
      countOfPages,
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
      if (parseInt(countOfPages) >= item.at) {
        breakpoint = item;
      }
    }
    pagePrice = breakpoint[printSide!];
    calculatedPrice = (parseInt(countOfPages) || 0) * pagePrice;
  }

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "");
      if (userData) setIsUserLoggedIn(true);
    } catch {}

    isLoggedIn()
      .then((userData) => setIsUserLoggedIn(!!userData))
      .catch(() => {});
  }, []);

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
            inputProps={{ placeholder: "تعداد برگ" }}
            varient="shadow-without-bg"
            value={countOfPages
              .split("")
              .map(
                (char) =>
                  ({
                    "0": "۰",
                    "۰": "۰",
                    "1": "۱",
                    "۱": "۱",
                    "2": "۲",
                    "۲": "۲",
                    "3": "۳",
                    "۳": "۳",
                    "4": "۴",
                    "۴": "۴",
                    "5": "۵",
                    "۵": "۵",
                    "6": "۶",
                    "۶": "۶",
                    "7": "۷",
                    "۷": "۷",
                    "8": "۸",
                    "۸": "۸",
                    "9": "۹",
                    "۹": "۹",
                  }[char])
              )
              .join("")}
            onChange={(newValue) =>
              setCountOfPages(
                newValue
                  .split("")
                  .map(
                    (char) =>
                      ({
                        "۰": "0",
                        "0": "0",
                        "۱": "1",
                        "1": "1",
                        "۲": "2",
                        "2": "2",
                        "۳": "3",
                        "3": "3",
                        "۴": "4",
                        "4": "4",
                        "۵": "5",
                        "5": "5",
                        "۶": "6",
                        "6": "6",
                        "۷": "7",
                        "7": "7",
                        "۸": "8",
                        "8": "8",
                        "۹": "9",
                        "9": "9",
                      }[char])
                  )
                  .join("")
              )
            }
            height={48}
          />
          <ErrorList errors={formValidation.errors.countOfPages} />
        </div>
        <div>
          {pagePrice && (
            <>
              <span>قیمت هر برگ: </span>
              <span>
                <FormattedNumber value={pagePrice} /> تومان
              </span>
            </>
          )}
        </div>
      </div>
      <div className={styles.Bottom}>
        {calculatedPrice && (
          <div>
            <span>قیمت کل: </span>
            <span>
              <FormattedNumber value={calculatedPrice} /> تومان
            </span>
          </div>
        )}
        <Link href={isUserLoggedIn ? "/dashboard/orders/new" : "/auth"}>
          <Button varient="gradient" style={{ padding: "0 30px" }}>
            سفارش پرینت
          </Button>
        </Link>
      </div>
    </div>
  );
}
