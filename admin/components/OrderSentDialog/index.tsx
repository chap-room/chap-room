import styles from "./style.module.scss";
import { useState } from "react";
import { useValidation, validateInt } from "@/shared/utils/validation";
import Dialog from "@/shared/components/Dialog";
import TextInput from "@/shared/components/TextInput";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";
import ErrorList from "@/shared/components/ErrorList";

interface OrderSentDialogProps {
  onClose: () => void;
  onMarkOrderSent: (trackingCode: string) => Promise<any>;
}

export default function OrderSentDialog({
  onClose,
  onMarkOrderSent,
}: OrderSentDialogProps) {
  const [trackingCode, setTrackingCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formValidation = useValidation(
    {
      trackingCode: [validateInt({ unsigned: true })],
    },
    {
      trackingCode,
    }
  );

  return (
    <Dialog title="ارسال سفارش" open={true} onClose={() => onClose()}>
      <div className={styles.DialogContent}>
        <div className={styles.Label}>کد پیگیری:</div>
        <div className={styles.Input}>
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
            onMarkOrderSent(trackingCode).finally(() => setIsSubmitting(false));
          }}
          style={{ minWidth: 100 }}
          loading={isSubmitting}
          disabled={isSubmitting || !formValidation.isValid}
        >
          ارسال شده
        </Button>
      </BottomActions>
    </Dialog>
  );
}
