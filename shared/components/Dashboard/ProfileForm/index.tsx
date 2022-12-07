import styles from "./style.module.scss";
import { useState } from "react";
import {
  useValidation,
  validateNotEmpty,
  validateLength,
  validatePasswordRepeat,
  optionalValidate,
  validatePhoneNumber,
} from "@/shared/utils/validation";
import TextInput from "@/shared/components/TextInput";
import ErrorList from "@/shared/components/ErrorList";
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
  inputsVarient?: "outlined" | "shadow";
  canEditPhoneNumber?: boolean;
}

export default function ProfileForm({
  defaultValues,
  onSave,
  inputsVarient,
  canEditPhoneNumber,
}: ProfileFormProps) {
  const [phoneNumber, setPhoneNumber] = useState(
    defaultValues?.phoneNumber || ""
  );
  const [name, setName] = useState(defaultValues?.name || "");
  const [password, setPassword] = useState(defaultValues?.password || "");
  const [passwordRepeat, setPasswordRepeat] = useState(
    defaultValues?.password || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formValidation = useValidation(
    {
      phoneNumber: [validatePhoneNumber()],
      name: [validateNotEmpty()],
      password: [
        optionalValidate({
          enabled: password !== "",
          validator: validateLength({ min: 8 }),
        }),
      ],
      passwordRepeat: [
        optionalValidate({
          enabled: password !== "",
          validator: validateLength({ min: 8 }),
        }),
        validatePasswordRepeat(password),
      ],
    },
    {
      phoneNumber,
      name,
      password,
      passwordRepeat,
    }
  );

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.Label}>شماره موبایل:</div>
        <div className={styles.Input}>
          {canEditPhoneNumber ? (
            <>
              <TextInput
                inputProps={{ type: "number", placeholder: "شماره موبایل" }}
                varient={inputsVarient}
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
              <ErrorList errors={formValidation.errors.name} />
            </>
          ) : (
            phoneNumber
          )}
        </div>
        <div className={styles.Label}>نام و نام خانوادگی:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ placeholder: "نام و نام خانوادگی" }}
            varient={inputsVarient}
            value={name}
            onChange={setName}
          />
          <ErrorList errors={formValidation.errors.name} />
        </div>
        <div className={styles.Label}>رمز عبور:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "password",
              placeholder: "رمز عبور",
            }}
            varient={inputsVarient}
            value={password}
            onChange={setPassword}
          />
          <ErrorList errors={formValidation.errors.password} />
        </div>
        <div className={styles.Label}>تکرار رمز عبور:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "password",
              placeholder: "تکرار رمز عبور",
            }}
            varient={inputsVarient}
            value={passwordRepeat}
            onChange={setPasswordRepeat}
          />
          <ErrorList errors={formValidation.errors.passwordRepeat} />
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
          disabled={isSubmitting || !formValidation.isValid}
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
