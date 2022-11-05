import styles from "./style.module.scss";
import { useState } from "react";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";

interface UserFormData {
  phoneNumber: string;
  name: string;
  password: string;
  walletBalance: number;
}

interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSave: (data: UserFormData) => Promise<any>;
}

export default function UserForm({ defaultValues, onSave }: UserFormProps) {
  const [phoneNumber, setPhoneNumber] = useState(
    defaultValues?.phoneNumber || ""
  );
  const [name, setName] = useState(defaultValues?.name || "");
  const [password, setPassword] = useState(defaultValues?.password || "");
  const [retryPassword, setRetryPassword] = useState(
    defaultValues?.password || ""
  );
  const [walletBalance, setWalletBalance] = useState(
    defaultValues?.walletBalance?.toString() || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.Label}>شماره موبایل:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ placeholder: "شماره موبایل" }}
            value={phoneNumber}
            onChange={(newValue) => setPhoneNumber(newValue.substring(0, 11))}
          />
        </div>
        <div className={styles.Label}>نام کامل:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ placeholder: "نام کامل" }}
            value={name}
            onChange={setName}
          />
        </div>
        <div className={styles.Label}>رمز عبور:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "password",
              placeholder: "رمز عبور",
            }}
            value={password}
            onChange={setPassword}
          />
        </div>
        <div className={styles.Label}>تکرار رمز عبور:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "password",
              placeholder: "تکرار رمز عبور",
            }}
            value={retryPassword}
            onChange={setRetryPassword}
          />
        </div>
        <div className={styles.Label}>موجودی کیف پول:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "number",
              placeholder: "موجودی کیف پول",
            }}
            value={walletBalance}
            onChange={setWalletBalance}
          />
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() => {
            setIsSubmitting(true);
            onSave({
              phoneNumber,
              name,
              password,
              walletBalance: parseInt(walletBalance),
            }).finally(() => setIsSubmitting(false));
          }}
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            phoneNumber.length !== 11 ||
            !phoneNumber.startsWith("09") ||
            isNaN(parseInt(phoneNumber)) ||
            isNaN(parseInt(walletBalance)) ||
            parseInt(walletBalance) < 0 ||
            !name ||
            (password !== "" && password.length < 8) ||
            password !== retryPassword
          }
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
