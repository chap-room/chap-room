import styles from "./style.module.scss";
import { useState } from "react";
import { FormattedNumber, useIntl } from "react-intl";
// import { PrintTariffs } from "@/shared/types";
// import {
//   useValidation,
//   validateNotEmpty,
//   validateInt,
// } from "@/shared/utils/validation";
import Button from "@/shared/components/Button";
import Select from "@/shared/components/Select";
import TextInput from "@/shared/components/TextInput";
import {
  englishToPersianNumbers,
  persianToEnglishNumbers,
} from "@/shared/utils/numbers";
// import ErrorList from "@/shared/components/ErrorList";

interface BookPriceCalculatorProps {
  // printTariffs: PrintTariffs;
}

export default function BookPriceCalculator({}: // printTariffs,
BookPriceCalculatorProps) {
  const intl = useIntl();

  // const [printColor, setPrintColor] = useState<
  //   "blackAndWhite" | "normalColor" | "fullColor" | null
  // >(null);
  // const [printSize, setPrintSize] = useState<"a4" | "a5" | "a3" | null>(null);
  // const [printSide, setPrintSide] = useState<
  //   "singleSided" | "doubleSided" | null
  // >(null);
  const [countOfPages, setCountOfPages] = useState("");
  const [countOfCopies, setCountOfCopies] = useState("");

  // const formValidation = useValidation(
  //   {
  //     printColor: [validateNotEmpty()],
  //     printSize: [validateNotEmpty()],
  //     printSide: [validateNotEmpty()],
  //     countOfPages: [validateInt({ unsigned: true, min: 1 })],
  //   },
  //   {
  //     printColor,
  //     printSize,
  //     printSide,
  //     countOfPages,
  //   }
  // );

  return (
    <div className={styles.Calculator}>
      <div className={styles.Title}>
        از منوی زیر خدمات مورد نظر خود را انتخاب کنید
      </div>
      <div className={styles.Input}>
        <Select
          value={null}
          onChange={() => {}}
          options={{}}
          varient="shadow-without-bg"
          placeholder="قطع کتاب"
          readOnly
          height={48}
        />
      </div>
      <div className={styles.Input}>
        <Select
          value={null}
          onChange={() => {}}
          options={{}}
          varient="shadow-without-bg"
          placeholder="جنس کاغذ"
          readOnly
          height={48}
        />
      </div>
      <div className={styles.Input}>
        <Select
          value={null}
          onChange={() => {}}
          options={{}}
          varient="shadow-without-bg"
          placeholder="نوع صحافی"
          readOnly
          height={48}
        />
      </div>
      <div className={styles.Row}>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ placeholder: "تعداد صفحه" }}
            varient="shadow-without-bg"
            height={48}
            value={englishToPersianNumbers(countOfPages)}
            onChange={(newValue) =>
              setCountOfPages(persianToEnglishNumbers(newValue, false))
            }
          />
        </div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              placeholder: `تیراژ (حداقل ${englishToPersianNumbers(50)} نسخه)`,
            }}
            varient="shadow-without-bg"
            height={48}
            value={englishToPersianNumbers(countOfCopies)}
            onChange={(newValue) =>
              setCountOfCopies(persianToEnglishNumbers(newValue, false))
            }
          />
        </div>
      </div>
      <div className={styles.Row}>
        <div>
          <span>قیمت هر کتاب: </span>
          <span>
            <FormattedNumber value={56000} /> تومان
          </span>
        </div>
        <div>
          <span>قیمت کل: </span>
          <span>
            <FormattedNumber value={560000} /> تومان
          </span>
        </div>
      </div>
      <div className={styles.Bottom}>
        <Button varient="gradient" style={{ padding: "0 30px" }}>
          مشاوره رایگان
        </Button>
      </div>
    </div>
  );
}
