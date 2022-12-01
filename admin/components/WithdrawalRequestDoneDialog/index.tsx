import styles from "./style.module.scss";
import { useState } from "react";
import moment from "jalali-moment";
import { useValidation, validateInt } from "@/shared/utils/validation";
import Dialog from "@/shared/components/Dialog";
import TextInput from "@/shared/components/TextInput";
import ErrorList from "@/shared/components/ErrorList";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";

interface WithdrawalRequestDoneDialogProps {
  onClose: () => void;
  onDoneWithdrawalRequest: (
    transactionDate: string,
    trackingCode: string
  ) => Promise<any>;
}

export default function WithdrawalRequestDoneDialog({
  onClose,
  onDoneWithdrawalRequest,
}: WithdrawalRequestDoneDialogProps) {
  const jaliliMoment = moment();
  const [transactionDateDay, setTransactionDateDay] = useState(
    jaliliMoment.jDate().toString()
  );
  const [transactionDateMonth, setTransactionDateMonth] = useState(
    (jaliliMoment.jMonth() + 1).toString()
  );
  const [transactionDateYear, setTransactionDateYear] = useState(
    jaliliMoment.jYear().toString()
  );
  const [trackingCode, setTrackingCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formValidation = useValidation(
    {
      transactionDate: [
        (value) => {
          if (!moment.from(value, "fa-IR", "jYYYY/jMM/jDD").isValid()) {
            return "تاریخ نامعتبر است";
          }
        },
      ],
      trackingCode: [validateInt({ unsigned: true })],
    },
    {
      transactionDate: [
        transactionDateYear,
        transactionDateMonth,
        transactionDateDay,
      ].join("/"),
      trackingCode,
    }
  );

  return (
    <Dialog
      title="انجام دادن درخواست برداشت"
      open={true}
      onClose={() => onClose()}
    >
      <div className={styles.DialogContent}>
        <div>تاریخ انجام:</div>
        <div>
          <div className={styles.DateInput}>
            <TextInput
              inputProps={{ type: "number", placeholder: "روز" }}
              value={transactionDateDay}
              onChange={(newValue) =>
                setTransactionDateDay(newValue.substring(0, 2))
              }
            />
            <TextInput
              inputProps={{ type: "number", placeholder: "ماه" }}
              value={transactionDateMonth}
              onChange={(newValue) =>
                setTransactionDateMonth(newValue.substring(0, 2))
              }
            />
            <TextInput
              inputProps={{ type: "number", placeholder: "سال" }}
              value={transactionDateYear}
              onChange={(newValue) =>
                setTransactionDateYear(newValue.substring(0, 4))
              }
            />
          </div>
          <ErrorList errors={formValidation.errors.transactionDate} />
        </div>
        <div>کد پیگیری:</div>
        <div>
          <TextInput
            inputProps={{ type: "number", placeholder: "کد پیگیری" }}
            value={trackingCode}
            onChange={setTrackingCode}
          />
          <ErrorList errors={formValidation.errors.trackingCode} />
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          onClick={() => {
            setIsSubmitting(true);
            onDoneWithdrawalRequest(
              [
                transactionDateYear,
                transactionDateMonth,
                transactionDateDay,
              ].join("/"),
              trackingCode
            ).finally(() => setIsSubmitting(false));
          }}
          style={{ minWidth: 100 }}
          loading={isSubmitting}
          disabled={isSubmitting || !formValidation.isValid}
        >
          انجام دادن
        </Button>
      </BottomActions>
    </Dialog>
  );
}
