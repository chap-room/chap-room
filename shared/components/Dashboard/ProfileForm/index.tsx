import styles from "./style.module.scss";
import { useState } from "react";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";

interface ProfileFormData {
  phoneNumber: string;
  name: string;
  password: string;
}

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormData>;
  onSave: (data: ProfileFormData) => Promise<any>;
}

export default function ProfileForm({
  defaultValues,
  onSave,
}: ProfileFormProps) {
  const [phoneNumber, setPhoneNumber] = useState(
    defaultValues?.phoneNumber || ""
  );
  const [name, setName] = useState(defaultValues?.name || "");
  const [password, setPassword] = useState(defaultValues?.password || "");
  const [retryPassword, setRetryPassword] = useState(
    defaultValues?.password || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.Label}>شماره موبایل:</div>
        <div className={styles.Input}>{phoneNumber}</div>
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
            }).finally(() => setIsSubmitting(false));
          }}
          loading={isSubmitting}
          disabled={
            isSubmitting ||
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
