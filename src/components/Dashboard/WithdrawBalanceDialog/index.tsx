import styles from "./style.module.scss";
import { useState } from "react";
import Dialog from "../../Dialog";
import TextInput from "../../TextInput";
import BottomActions from "../BottomActions";
import Button from "../../Button";

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

  return (
    <Dialog title="برداشت موجودی" open={open} onClose={onClose}>
      <div className={styles.DialogContent}>
        <div>
          <div>شماره شبا:</div>
          <div>
            <TextInput
              dir="ltr"
              type="number"
              value={shabaNumber}
              onTextChange={(newValue) =>
                setShabaNumber(newValue.substring(0, 24))
              }
              prefix="IR"
            />
          </div>
        </div>
        <div>
          <div>نام صاحب حساب:</div>
          <div>
            <TextInput
              value={accountHolderName}
              onTextChange={(newValue) => setAccountHolder(newValue)}
            />
          </div>
        </div>
      </div>
      <BottomActions>
        <Button varient="filled" style={{ minWidth: 100 }}>ثبت درخواست</Button>
      </BottomActions>
    </Dialog>
  );
}
