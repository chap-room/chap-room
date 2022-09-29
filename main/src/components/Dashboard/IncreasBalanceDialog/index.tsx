import styles from "./style.module.scss";
import { useState } from "react";
import Dialog from "@chap-room/shared/components/Dialog";
import TextInput from "@chap-room/shared/components/TextInput";
import Select from "@chap-room/shared/components/Select";
import BottomActions from "@chap-room/shared/components/Dashboard/BottomActions";
import { PaymentMethod } from "@chap-room/shared/types";
import Button from "@chap-room/shared/components/Button";

interface IncreasBalanceDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function IncreasBalanceDialog({
  open,
  onClose,
}: IncreasBalanceDialogProps) {
  const [amount, setAmount] = useState("");
  const [gate, setGate] = useState<string>(PaymentMethod.zarinPalGate);

  return (
    <Dialog title="افزایش موجودی" open={open} onClose={onClose}>
      <div className={styles.DialogContent}>
        <div>
          <div>مبلغ مورد نظر:</div>
          <div>
            <TextInput
              inputProps={{
                type: "number",
                placeholder: "مبلغ",
              }}
              value={amount}
              onChange={setAmount}
              suffix="تومان"
            />
          </div>
          <div>انتخاب درگاه:</div>
          <div>
            <Select
              options={{
                [PaymentMethod.zarinPalGate]: "زرین پال",
              }}
              value={gate}
              onChange={(newValue) => setGate(newValue)}
            />
          </div>
        </div>
      </div>
      <BottomActions>
        <Button varient="filled" style={{ minWidth: 100 }}>
          پرداخت
        </Button>
      </BottomActions>
    </Dialog>
  );
}
