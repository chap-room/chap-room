import styles from "./style.module.scss";
import { useState } from "react";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import {
  optionalValidate,
  useValidation,
  validateInt,
  validateLength,
  validateNotEmpty,
  validatePasswordRepeat,
  validatePhoneNumber,
} from "@/shared/utils/validation";
import ErrorList from "@/shared/components/ErrorList";

interface UserFormData {
  phoneNumber: string;
  name: string;
  password: string;
  walletBalance: number;
}

interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  isEdit?: boolean;
  onSave: (data: UserFormData) => Promise<any>;
}

export default function UserForm({
  defaultValues,
  isEdit,
  onSave,
}: UserFormProps) {
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

  const formValidation = useValidation(
    {
      phoneNumber: [validatePhoneNumber()],
      name: [validateNotEmpty()],
      password: [
        optionalValidate({
          enabled: !isEdit || password !== "",
          validator: validateLength({ min: 8 }),
        }),
      ],
      retryPassword: [
        optionalValidate({
          enabled: !isEdit || password !== "",
          validator: validateLength({ min: 8 }),
        }),
        validatePasswordRepeat(password),
      ],
      walletBalance: [
        optionalValidate({
          enabled: walletBalance !== "",
          validator: validateInt({ unsigned: true }),
        }),
      ],
    },
    {
      phoneNumber,
      name,
      password,
      retryPassword,
      walletBalance,
    }
  );

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.Label}>?????????? ????????????:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number", placeholder: "?????????? ????????????" }}
            value={phoneNumber}
            onChange={(newValue) => setPhoneNumber(newValue.substring(0, 11))}
          />
          <ErrorList errors={formValidation.errors.phoneNumber} />
        </div>
        <div className={styles.Label}>?????? ?? ?????? ????????????????:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ placeholder: "?????? ?? ?????? ????????????????" }}
            value={name}
            onChange={setName}
          />
          <ErrorList errors={formValidation.errors.name} />
        </div>
        <div className={styles.Label}>?????? ????????:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "password",
              placeholder: "?????? ????????",
            }}
            value={password}
            onChange={setPassword}
          />
          <ErrorList errors={formValidation.errors.password} />
        </div>
        <div className={styles.Label}>?????????? ?????? ????????:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "password",
              placeholder: "?????????? ?????? ????????",
            }}
            value={retryPassword}
            onChange={setRetryPassword}
          />
          <ErrorList errors={formValidation.errors.retryPassword} />
        </div>
        <div className={styles.Label}>???????????? ?????? ??????:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "number",
              placeholder: "???????????? ?????? ??????",
            }}
            value={walletBalance}
            onChange={setWalletBalance}
          />
          <ErrorList errors={formValidation.errors.walletBalance} />
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
          disabled={isSubmitting || !formValidation.isValid}
        >
          ??????????
        </Button>
      </BottomActions>
    </>
  );
}
