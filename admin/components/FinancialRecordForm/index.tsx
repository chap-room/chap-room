import styles from "./style.module.scss";
import {
  User,
  FinancialRecordType,
  FinancialRecordStatus,
} from "@/shared/types";
import { useState } from "react";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Select from "@/shared/components/Select";

interface FinancialRecordData {
  user: User;
  amount: number;
  details: string;
  type: FinancialRecordType;
  status: FinancialRecordStatus;
}

interface FinancialRecordFormProps {
  defaultValues?: Partial<FinancialRecordData>;
  onSave: (data: FinancialRecordData) => void;
}

export default function FinancialRecordForm({
  defaultValues,
  onSave,
}: FinancialRecordFormProps) {
  const [user, setUser] = useState(defaultValues?.user?.name || "");
  const [amount, setAmount] = useState(defaultValues?.amount?.toString() || "");
  const [details, setDetails] = useState(""); // TODO
  const [type, setType] = useState(
    defaultValues?.type || FinancialRecordType.creditor
  );

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.Label}>کاربر:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ placeholder: "کاربر" }}
            value={user}
            onChange={setUser}
          />
        </div>
        <div className={styles.Label}>مبلغ:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ placeholder: "مبلغ", type: "number" }}
            value={amount}
            onChange={setAmount}
          />
        </div>
        <div className={styles.Label}>نوع:</div>
        <div className={styles.Input}>
          <Select
            options={{
              [FinancialRecordType.creditor]: FinancialRecordType.creditor,
              [FinancialRecordType.debtor]: FinancialRecordType.debtor,
            }}
            value={type}
            onChange={(newValue) => setType(newValue as FinancialRecordType)}
          />
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={
            () => 0 /* onSave({ // TODO
            user: {parseInt(amount)},
            amount: parseInt(amount),
          }) */
          }
          disabled={isNaN(parseInt(amount)) || parseInt(amount) < 0}
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
