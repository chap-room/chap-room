import { useState } from "react";
import Dialog from "../../Dialog";
import TextInput from "../../TextInput";
import BottomActions from "../BottomActions";

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
      <div>
        <div>شماره شبا:</div>
        <div>
          <TextInput
            type="number"
            value={shabaNumber}
            onTextChange={(newValue) => setShabaNumber(newValue)}
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
      <BottomActions
        actions={[
          {
            key: "registerRequest",
            label: "ثبت درخواست",
            variant: "filled",
            onClick: () => {},
          },
        ]}
      />
    </Dialog>
  );
}
