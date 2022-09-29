import styles from "./style.module.scss";
import { useState } from "react";
import Dialog from "@chap-room/shared/components/Dialog";
import TextInput from "@chap-room/shared/components/TextInput";
import BottomActions from "@chap-room/shared/components/Dashboard/BottomActions";
import Button from "@chap-room/shared/components/Button";

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
        <Button varient="filled" style={{ minWidth: 100 }}>
          ثبت درخواست
        </Button>
      </BottomActions>
    </Dialog>
  );
}
