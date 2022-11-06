import styles from "./style.module.scss";
import { useState } from "react";
import { PaymentMethod } from "@/shared/types";
import Dialog from "@/shared/components/Dialog";
import TextInput from "@/shared/components/TextInput";
import Select from "@/shared/components/Select";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";
import { walletDeposit } from "@/main/api";
import toast from "react-hot-toast";

interface IncreasBalanceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<any>;
}

export default function IncreasBalanceDialog({
  open,
  onClose,
  onSubmit,
}: IncreasBalanceDialogProps) {
  const [amount, setAmount] = useState("");
  const [gate, setGate] = useState<string>(PaymentMethod.zarinPalGate);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
              varient="shadow"
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
              varient="shadow"
              value={gate}
              onChange={(newValue) => setGate(newValue)}
              readOnly
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
            onSubmit(parseInt(amount)).finally(() => setIsSubmitting(false));
          }}
          loading={isSubmitting}
          disabled={
            isSubmitting || isNaN(parseInt(amount)) || parseInt(amount) <= 0
          }
        >
          پرداخت
        </Button>
      </BottomActions>
    </Dialog>
  );
}
