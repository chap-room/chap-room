import styles from "./styles.module.scss";
import { useState } from "react";
import { FormattedNumber } from "react-intl";
import Link from "next/link";
import { PrintTariffs } from "@/shared/types";
import Button from "@/shared/components/Button";
import Select from "@/shared/components/Select";
import TextInput from "@/shared/components/TextInput";

interface PrintPriceCalculatorProps {
  printTariffs: PrintTariffs;
}

export default function PrintPriceCalculator({
  printTariffs,
}: PrintPriceCalculatorProps) {
  const [printSize, setPrintSize] = useState<"a4" | "a5" | "a3">("a4");
  const [printColor, setPrintColor] = useState<
    "blackAndWhite" | "normalColor" | "fullColor"
  >("blackAndWhite");
  const [printSide, setPrintSide] = useState<"singleSided" | "doubleSided">(
    "singleSided"
  );
  const [countOfPages, setCountOfPages] = useState("");

  const printPrice = printTariffs[printSize][printColor];
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
  const pagePrice = breakpoint[printSide];
  const calculatedPrice = (parseInt(countOfPages) || 0) * pagePrice;

  return (
    <div className={styles.Calculator}>
      <Select
        varient="shadow"
        value={printSize}
        onChange={(newValue: string) =>
          setPrintSize(newValue as "a4" | "a5" | "a3")
        }
        options={{
          a4: "A4",
          a5: "A5",
          a3: "A3",
        }}
      />
      <Select
        varient="shadow"
        value={printColor}
        onChange={(newValue: string) =>
          setPrintColor(
            newValue as "blackAndWhite" | "normalColor" | "fullColor"
          )
        }
        options={{
          blackAndWhite: "سیاه و سفید",
          normalColor: "رنگی معمولی",
          fullColor: "تمام رنگی",
        }}
      />
      <Select
        varient="shadow"
        value={printSide}
        onChange={(newValue: string) =>
          setPrintSide(newValue as "singleSided" | "doubleSided")
        }
        options={{
          singleSided: "یک رو",
          doubleSided: "دو رو",
        }}
      />
      <div className={styles.Row}>
        <TextInput
          inputProps={{ type: "number", placeholder: "تعداد برگ" }}
          varient="shadow"
          value={countOfPages}
          onChange={setCountOfPages}
        />
        <div>
          <span>قیمت هر برگ: </span>
          <span>
            <FormattedNumber value={pagePrice} /> تومان
          </span>
        </div>
      </div>
      <div className={styles.Bottom}>
        {calculatedPrice > 0 && (
          <div>
            <FormattedNumber value={calculatedPrice} /> تومان
          </div>
        )}
        <Link href="/login">
          <Button varient="gradient">سفارش پرینت</Button>
        </Link>
      </div>
    </div>
  );
}
