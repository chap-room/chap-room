import styles from "./style.module.scss";
import { useState } from "react";
import {
  optionalValidate,
  useValidation,
  validateNotEmpty,
} from "@/shared/utils/validation";
import Dialog from "@/shared/components/Dialog";
import TextInput from "@/shared/components/TextInput";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import ErrorList from "@/shared/components/ErrorList";
import Button from "@/shared/components/Button";
import ContentSelect from "@/shared/components/ContentSelect";

interface OrderCancelDialogProps {
  onClose: () => void;
  onCancelOrder: (reason: string) => Promise<any>;
}

export default function OrderCancelDialog({
  onClose,
  onCancelOrder,
}: OrderCancelDialogProps) {
  const [reason, setReason] = useState<string>(
    "تعداد برگ با سفارش همخوانی ندارد"
  );
  const [reasonText, setReasonText] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formValidation = useValidation(
    {
      reasonText: [
        optionalValidate({
          enabled: reason === "دیگر",
          validator: validateNotEmpty(),
        }),
      ],
    },
    {
      reasonText,
    }
  );

  return (
    <Dialog title="لغو سفارش" open={true} onClose={() => onClose()}>
      <div className={styles.DialogContent}>
        <div className={styles.Label}>انتخاب علت:</div>
        <div className={styles.Input}>
          <ContentSelect
            options={[
              "تعداد برگ با سفارش همخوانی ندارد",
              "کیفیت فایل نامناسب است",
              "اشتباه در انتخاب رنگی معمولی",
              "اشتباه در انتخاب تمام رنگی",
              "فایل ها تصویر پس زمینه دارد",
              "تعداد فایل ها زیاد است",
              "دیگر",
            ]}
            value={reason}
            onChange={setReason}
          />
        </div>
        {reason === "دیگر" && (
          <>
            <div className={styles.Label}>متن:</div>
            <div className={styles.Input}>
              <TextInput
                inputProps={{ placeholder: "متن" }}
                value={reasonText}
                onChange={setReasonText}
              />
              <ErrorList errors={formValidation.errors.reasonText} />
            </div>
          </>
        )}
      </div>
      <BottomActions>
        <Button
          varient="filled"
          onClick={() => {
            setIsSubmitting(true);
            onCancelOrder(reason === "دیگر" ? reasonText : reason).finally(() =>
              setIsSubmitting(false)
            );
          }}
          style={{ minWidth: 100 }}
          loading={isSubmitting}
          disabled={isSubmitting || !formValidation.isValid}
        >
          لغو کردن
        </Button>
      </BottomActions>
    </Dialog>
  );
}
