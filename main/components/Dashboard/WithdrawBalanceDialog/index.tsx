import styles from "./style.module.scss";
import { useState } from "react";
import Dialog from "@/shared/components/Dialog";
import TextInput from "@/shared/components/TextInput";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";
import { walletWithdrawal } from "@/main/api";
import toast from "react-hot-toast";

interface WithdrawBalanceDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function WithdrawBalanceDialog({
  open,
  onClose,
}: WithdrawBalanceDialogProps) {
  const [shabaNumber, setShabaNumber] = useState("");
  const [accountHolderName, setAccountHolder] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog title="برداشت موجودی" open={open} onClose={onClose}>
      <div className={styles.DialogContent}>
        <div>
          <div>شماره شبا:</div>
          <div>
            <TextInput
              prefix="IR"
              boxProps={{ dir: "ltr" }}
              inputProps={{
                type: "number",
                placeholder: "شماره شبا",
              }}
              value={shabaNumber}
              onChange={(newValue) => setShabaNumber(newValue.substring(0, 24))}
            />
          </div>
        </div>
        <div>
          <div>نام صاحب حساب:</div>
          <div>
            <TextInput
              inputProps={{ placeholder: "صاحب حساب" }}
              value={accountHolderName}
              onChange={setAccountHolder}
            />
          </div>
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() => {
            setIsSubmitting(true);
            walletWithdrawal(accountHolderName, shabaNumber)
              .then(toast.success)
              .catch(toast.error)
              .finally(() => setIsSubmitting(false));
          }}
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            !accountHolderName ||
            shabaNumber.length !== 24 ||
            isNaN(parseInt(shabaNumber))
          }
        >
          ثبت درخواست
        </Button>
      </BottomActions>
    </Dialog>
  );
}
