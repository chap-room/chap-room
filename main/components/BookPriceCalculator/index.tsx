import styles from "./style.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import { BookTariffs } from "@/shared/types";
import { submitBookPublishingRequest } from "@/main/api";
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
import BookPublishingDialog from "@/main/components/Dashboard/BookPublishingDialog";

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

  const [showBookPublishingDialog, setShowBookPublishingDialog] =
    useState(false);

  return (
    <>
      <div className={styles.Calculator}>
        <div className={styles.Title}>
          ???? ???????? ?????? ?????????? ???????? ?????? ?????? ???? ???????????? ????????
        </div>
        <div className={styles.Input}>
          <Select
            value={bookSize}
            onChange={setBookSize}
            options={{ rahli: "????????", raqai: "????????", vaziri: "??????????" }}
            varient="shadow-without-bg"
            placeholder="?????? ????????"
            height={48}
          />
          <ErrorList errors={formValidation.errors.bookSize} />
        </div>
        <div className={styles.Input}>
          <Select
            value={bookPaperType}
            onChange={setBookPaperType}
            options={{
              writing80Grams: "?????????? 80 ????????",
            }}
            varient="shadow-without-bg"
            placeholder="?????? ????????"
            height={48}
          />
          <ErrorList errors={formValidation.errors.bookPaperType} />
        </div>
        <div className={styles.Input}>
          <Select
            value={bookBindingType}
            onChange={setBookBindingType}
            options={{
              hotGlue: "?????? ??????",
            }}
            varient="shadow-without-bg"
            placeholder="?????? ??????????"
            height={48}
          />
          <ErrorList errors={formValidation.errors.bookBindingType} />
        </div>
        <div className={styles.Row}>
          <div className={styles.Input}>
            <TextInput
              inputProps={{ type: "number", placeholder: "?????????? ????????" }}
              varient="shadow-without-bg"
              height={48}
              value={countOfPages}
              onChange={setCountOfPages}
            />
            <ErrorList errors={formValidation.errors.countOfPages} />
            {bookPrice && (
              <div className={styles.BookPrice}>
                <span>???????? ???? ????????: </span>
                <span>{formatNumber(bookPrice)} ??????????</span>
              </div>
            )}
          </div>
          <div className={styles.Input}>
            <TextInput
              inputProps={{
                type: "number",
                placeholder: "?????????? (?????????? 50 ????????)",
              }}
              varient="shadow-without-bg"
              height={48}
              value={countOfCopies}
              onChange={setCountOfCopies}
            />
            <ErrorList errors={countOfCopiesValidation.errors.countOfCopies} />
            {totalPrice && (
              <div className={styles.TotalPrice}>
                <span>???????? ????: </span>
                <span>{formatNumber(totalPrice)} ??????????</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.Bottom}>
          <Button
            varient="gradient"
            onClick={() => setShowBookPublishingDialog(true)}
            style={{ padding: "0 30px" }}
          >
            ???????????? ????????????
          </Button>
        </div>
      </div>
      <BookPublishingDialog
        open={showBookPublishingDialog}
        onClose={() => setShowBookPublishingDialog(false)}
        onSubmit={(phoneNumber) =>
          submitBookPublishingRequest(phoneNumber)
            .then(toast.success)
            .catch(toast.error)
        }
      />
    </>
  );
}
