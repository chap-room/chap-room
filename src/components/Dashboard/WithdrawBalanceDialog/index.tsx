import { useState } from "react";
import Dialog from "../../Dialog";
import FormTable from "../FormTable";
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
      <FormTable
        fields={[
          {
            key: "shabaNumber",
            label: "شماره شبا:",
            component: (
              <TextInput
                type="number"
                value={shabaNumber}
                onTextChange={(newValue) => setShabaNumber(newValue)}
              />
            ),
          },
          {
            key: "accountHolderName",
            label: "نام صاحب حساب:",
            component: (
              <TextInput
                value={accountHolderName}
                onTextChange={(newValue) => setAccountHolder(newValue)}
              />
            ),
          },
        ]}
      />
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
