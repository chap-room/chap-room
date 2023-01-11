import styles from "./style.module.scss";
import { useState } from "react";
import { useValidation, validatePhoneNumber } from "@/shared/utils/validation";
import Dialog from "@/shared/components/Dialog";
import TextInput from "@/shared/components/TextInput";
import ErrorList from "@/shared/components/ErrorList";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";

interface BookPublishingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => Promise<any>;
}

export default function BookPublishingDialog({
  open,
  onClose,
  onSubmit,
}: BookPublishingDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formValidation = useValidation(
    {
      phoneNumber: [validatePhoneNumber()],
    },
    {
      phoneNumber,
    }
  );

  return (
    <Dialog
      title="درخواست مشاوره رایگان"
      open={open}
      onClose={onClose}
      fullScreenInMobile
      hideTitleInMobile
    >
      <div className={styles.DialogContent}>
        <div className={styles.MobileTitle}>درخواست مشاوره رایگان</div>
        <div>
          <div className={styles.Label}>شماره موبایل:</div>
          <div className={styles.Input}>
            <TextInput
              inputProps={{ type: "number", placeholder: "شماره موبایل" }}
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
            <ErrorList errors={formValidation.errors.phoneNumber} />
          </div>
        </div>
        <BottomActions>
          <Button
            varient="filled"
            style={{ minWidth: 155 }}
            onClick={() => {
              setIsSubmitting(true);
              onSubmit(phoneNumber).finally(() => setIsSubmitting(false));
            }}
            loading={isSubmitting}
            disabled={isSubmitting || !formValidation.isValid}
          >
            ثبت درخواست
          </Button>
        </BottomActions>
      </div>
    </Dialog>
  );
}
