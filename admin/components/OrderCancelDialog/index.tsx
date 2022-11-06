import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { OrderCancelReason } from "@/shared/types";
import Dialog from "@/shared/components/Dialog";
import Select from "@/shared/components/Select";
import TextInput from "@/shared/components/TextInput";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";

interface OrderCancelDialogProps {
  open: boolean;
  onClose: () => void;
  onCancelOrder: (reason: string) => Promise<any>;
}

export default function OrderCancelDialog({
  open,
  onClose,
  onCancelOrder,
}: OrderCancelDialogProps) {
  const [reason, setReason] = useState<string>(
    OrderCancelReason.countOfPagesMismatch
  );
  const [reasonText, setReasonText] = useState("");

  useEffect(() => {
    if (open) {
      setReason(OrderCancelReason.countOfPagesMismatch);
      setReasonText("");
    }
  }, [open]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog title="لغو سفارش" open={open} onClose={() => onClose()}>
      <div className={styles.DialogContent}>
        <div>انتخاب علت:</div>
        <div>
          <Select
            options={{
              [OrderCancelReason.countOfPagesMismatch]:
                OrderCancelReason.countOfPagesMismatch,
              other: "دیگر",
            }}
            value={reason}
            onChange={setReason}
          />
        </div>
        {reason === "other" && (
          <>
            <div>علت:</div>
            <div>
              <TextInput
                inputProps={{ placeholder: "علت" }}
                value={reasonText}
                onChange={setReasonText}
              />
            </div>
          </>
        )}
      </div>
      <BottomActions>
        <Button
          varient="filled"
          onClick={() => {
            setIsSubmitting(true);
            onCancelOrder(reason === "other" ? reasonText : reason).finally(
              () => setIsSubmitting(false)
            );
          }}
          style={{ minWidth: 100 }}
          loading={isSubmitting}
          disabled={isSubmitting || (reason === "other" && !reasonText)}
        >
          لغو کردن
        </Button>
      </BottomActions>
    </Dialog>
  );
}