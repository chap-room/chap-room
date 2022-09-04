import { useState } from "react";
import Dialog from "../../Dialog";
import FormTable from "../FormTable";
import TextInput from "../../TextInput";
import Select from "../../Select";
import BottomActions from "../BottomActions";
import { PaymentMethod } from "../../../types";

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
      <FormTable
        fields={[
          {
            key: "amount",
            label: "مبلغ مورد نظر (تومان):",
            component: (
              <TextInput
                type="number"
                value={amount}
                onTextChange={(newValue) => setAmount(newValue)}
              />
            ),
          },
          {
            key: "gate",
            label: "انتخاب درگاه:",
            component: (
              <Select
                options={{
                  [PaymentMethod.zarinPalGate]: "زرین پال",
                }}
                value={gate}
                onChange={(newValue) => setGate(newValue)}
              />
            ),
          },
        ]}
      />
      <BottomActions
        actions={[
          {
            key: "pay",
            label: "پرداخت",
            variant: "filled",
            onClick: () => {},
          },
        ]}
      />
    </Dialog>
  );
}
