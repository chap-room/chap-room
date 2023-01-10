import styles from "./style.module.scss";
import { useState } from "react";
import { BookTariffs } from "@/shared/types";
import {
  useValidation,
  validateNotEmpty,
  validateInt,
} from "@/shared/utils/validation";
import { formatNumber } from "@/shared/utils/format";
import Button from "@/shared/components/Button";
import Select from "@/shared/components/Select";
import TextInput from "@/shared/components/TextInput";
import ErrorList from "@/shared/components/ErrorList";

interface BookPriceCalculatorProps {
  bookTariffs: BookTariffs;
}

export default function BookPriceCalculator({
  bookTariffs,
}: BookPriceCalculatorProps) {
  const [bookSize, setBookSize] = useState<"rahli" | "raqai" | "vaziri" | null>(
    null
  );
  const [bookPaperType, setBookPaperType] = useState<"writing80Grams" | null>(
    null
  );
  const [bookBindingType, setBookBindingType] = useState<"hotGlue" | null>(
    null
  );
  const [countOfPages, setCountOfPages] = useState("");
  const [countOfCopies, setCountOfCopies] = useState("");

  const formValidation = useValidation(
    {
      bookSize: [validateNotEmpty()],
      bookPaperType: [validateNotEmpty()],
      bookBindingType: [validateNotEmpty()],
      countOfPages: [validateInt({ unsigned: true, min: 1 })],
    },
    {
      bookSize,
      bookPaperType,
      bookBindingType,
      countOfPages,
    }
  );

  const countOfCopiesValidation = useValidation(
    {
      countOfCopies: [validateInt({ unsigned: true, min: 50 })],
    },
    {
      countOfCopies,
    }
  );

  let bookPrice = null;
  let totalPrice = null;
  if (formValidation.isValid) {
    const pagePrice = bookTariffs[bookSize!][bookPaperType!][bookBindingType!];
    bookPrice = (parseInt(countOfPages) || 0) * pagePrice;

    if (countOfCopiesValidation.isValid) {
      totalPrice = (parseInt(countOfCopies) || 0) * bookPrice;
    }
  }

  return (
    <div className={styles.Calculator}>
      <div className={styles.Title}>
        از منوی زیر خدمات مورد نظر خود را انتخاب کنید
      </div>
      <div className={styles.Input}>
        <Select
          value={bookSize}
          onChange={setBookSize}
          options={{ rahli: "رحلی", raqai: "رقعی", vaziri: "وزیری" }}
          varient="shadow-without-bg"
          placeholder="قطع کتاب"
          height={48}
        />
        <ErrorList errors={formValidation.errors.bookSize} />
      </div>
      <div className={styles.Input}>
        <Select
          value={bookPaperType}
          onChange={setBookPaperType}
          options={{
            writing80Grams: "تحریر 80 گرمی",
          }}
          varient="shadow-without-bg"
          placeholder="جنس کاغذ"
          height={48}
        />
        <ErrorList errors={formValidation.errors.bookPaperType} />
      </div>
      <div className={styles.Input}>
        <Select
          value={bookBindingType}
          onChange={setBookBindingType}
          options={{
            hotGlue: "چسب گرم",
          }}
          varient="shadow-without-bg"
          placeholder="نوع صحافی"
          height={48}
        />
        <ErrorList errors={formValidation.errors.bookBindingType} />
      </div>
      <div className={styles.Row}>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number", placeholder: "تعداد صفحه" }}
            varient="shadow-without-bg"
            height={48}
            value={countOfPages}
            onChange={setCountOfPages}
          />
          <ErrorList errors={formValidation.errors.countOfPages} />
          {bookPrice && (
            <div className={styles.BookPrice}>
              <span>قیمت هر کتاب: </span>
              <span>{formatNumber(bookPrice)} تومان</span>
            </div>
          )}
        </div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "number",
              placeholder: "تیراژ (حداقل 50 نسخه)",
            }}
            varient="shadow-without-bg"
            height={48}
            value={countOfCopies}
            onChange={setCountOfCopies}
          />
          <ErrorList errors={countOfCopiesValidation.errors.countOfCopies} />
          {totalPrice && (
            <div className={styles.TotalPrice}>
              <span>قیمت کل: </span>
              <span>{formatNumber(totalPrice)} تومان</span>
            </div>
          )}
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
