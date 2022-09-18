import styles from "./style.module.scss";
import { useState } from "react";
import Dialog from "../../Dialog";
import TextInput from "../../TextInput";
import Select from "../../Select";
import BottomActions from "../BottomActions";
import { PaymentMethod } from "../../../types";
import Button from "../../Button";

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
              type="number"
              value={amount}
              onTextChange={(newValue) => setAmount(newValue)}
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
        <Button varient="filled" style={{ minWidth: 100 }}>پرداخت</Button>
      </BottomActions>
    </Dialog>
  );
}
