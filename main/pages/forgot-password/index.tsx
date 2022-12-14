import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import {
  getIsLoggedIn,
  passwordReset,
  passwordResetConfirmCode,
  passwordResetSet,
  resendCode,
} from "@/main/api";
import {
  useValidation,
  validateInt,
  validateLength,
  validatePasswordRepeat,
  validatePhoneNumber,
} from "@/shared/utils/validation";
import LogoWithName from "@/shared/assets/images/logoWithName.svg";
import ArrowForwardIcon from "@/shared/assets/icons/arrowForward.svg";
import Image from "@/shared/assets/images/thinking.svg";
import TextInput from "@/shared/components/TextInput";
import ErrorList from "@/shared/components/ErrorList";
import Button from "@/shared/components/Button";

export default function ForgotPassword() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [confirmCodeExpirationDate, setConfirmCodeExpirationDate] =
    useState<null | Date>(null);
  const [passwordResetToken, setPasswordResetToken] = useState<null | string>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const formValidation = useValidation(
    {
      phoneNumber: [validatePhoneNumber()],
    },
    {
      phoneNumber,
    }
  );

  const confirmCodeValidation = useValidation(
    {
      confirmCode: [
        validateLength({ length: 6 }),
        validateInt({ unsigned: true }),
      ],
    },
    {
      confirmCode,
    }
  );

  const newPasswordValidation = useValidation(
    {
      newPassword: [validateLength({ min: 8 })],
      newPasswordRepeat: [
        validateLength({ min: 8 }),
        validatePasswordRepeat(newPassword),
      ],
    },
    {
      newPassword,
      newPasswordRepeat,
    }
  );

  useEffect(() => {
    getIsLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) router.replace("/dashboard");
    });
  }, []);

  return (
    <div className={styles.ForgotPassword}>
      <Head>
        <title>?????????????? ?????? ????????</title>
      </Head>
      <div className={styles.Header}>
        <Link href="/">
          <a className={styles.Logo}>
            <LogoWithName />
          </a>
        </Link>
        <Link href="/">
          <a className={styles.MobileBackButton}>
            <ArrowForwardIcon />
          </a>
        </Link>
      </div>
      <div className={styles.Content}>
        <div className={styles.Form}>
          {confirmCodeExpirationDate === null ? (
            <>
              <div className={styles.Column}>
                <div className={styles.Title}>?????????????? ?????? ????????</div>
                <div className={styles.SubTitle}>
                  ?????????? ?????????????? ???? ???? ???? ?????? ?????? ????????????????? ???? ???????? ????????????
                </div>
              </div>
              <div className={styles.Column}>
                <TextInput
                  inputProps={{ type: "number", placeholder: "?????????? ????????????" }}
                  varient="shadow"
                  value={phoneNumber}
                  onChange={(newValue) =>
                    setPhoneNumber(newValue.substring(0, 11))
                  }
                />
                <ErrorList errors={formValidation.errors.phoneNumber} />
              </div>
              <div className={styles.Column}>
                <Button
                  varient="gradient"
                  onClick={() => {
                    setIsSubmitting(true);
                    passwordReset(phoneNumber)
                      .then(({ message, expireAt }) => {
                        toast.success(message);
                        setConfirmCodeExpirationDate(new Date(expireAt));
                      })
                      .catch(toast.error)
                      .finally(() => setIsSubmitting(false));
                  }}
                  loading={isSubmitting}
                  disabled={isSubmitting || !formValidation.isValid}
                >
                  ?????????? ???? ????????????
                </Button>
                <div className={styles.BottomNote}>
                  <Link href="/login">
                    <a>???????????? ???? ???????? ????????</a>
                  </Link>
                </div>
              </div>
            </>
          ) : passwordResetToken === null ? (
            <>
              <div className={styles.Column}>
                <div className={styles.Title}>???????????? ?????????? ????????????</div>
                <div className={styles.SubTitle}>
                  ???? 6 ???????? ???? ?????????? {phoneNumber} ?????????? ????.
                </div>
              </div>
              <div className={styles.Column}>
                <TextInput
                  inputProps={{ type: "number", placeholder: "???? ????????????" }}
                  varient="shadow"
                  value={confirmCode}
                  onChange={(newValue) =>
                    setConfirmCode(newValue.substring(0, 6))
                  }
                  suffix={<CountDown date={confirmCodeExpirationDate} />}
                />
                <ErrorList errors={confirmCodeValidation.errors.confirmCode} />
              </div>
              <div className={styles.ConfirmCodeActions}>
                <button
                  onClick={() => {
                    setIsResending(true);
                    resendCode(phoneNumber)
                      .then(({ message, expireAt }) => {
                        toast.success(message);
                        setConfirmCodeExpirationDate(new Date(expireAt));
                      })
                      .catch(toast.error)
                      .finally(() => setIsResending(false));
                  }}
                  disabled={isResending}
                >
                  ?????????? ????????
                </button>
                <button
                  onClick={() => {
                    setConfirmCode("");
                    setConfirmCodeExpirationDate(null);
                  }}
                >
                  ????????????
                </button>
              </div>
              <div className={styles.Column}>
                <Button
                  varient="gradient"
                  onClick={() => {
                    setIsSubmitting(true);
                    passwordResetConfirmCode(phoneNumber, parseInt(confirmCode))
                      .then(({ message, passwordResetToken }) => {
                        toast.success(message);
                        setPasswordResetToken(passwordResetToken);
                      })
                      .catch(toast.error)
                      .finally(() => setIsSubmitting(false));
                  }}
                  loading={isSubmitting}
                  disabled={isSubmitting || !confirmCodeValidation.isValid}
                >
                  ???????????? ????
                </Button>
                <div className={styles.BottomNote}>
                  <Link href="/login">
                    <a>???????????? ???? ???????? ????????</a>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.Column}>
                <div className={styles.Title}>?????? ???????? ????????</div>
                <div className={styles.SubTitle}>
                  ???????? ?????? ???????? ???????? ?????? ???? ???????? ????????????
                </div>
              </div>
              <div className={styles.Column}>
                <TextInput
                  inputProps={{
                    type: "password",
                    placeholder: "?????? ????????",
                  }}
                  varient="shadow"
                  value={newPassword}
                  onChange={setNewPassword}
                />
                <ErrorList errors={newPasswordValidation.errors.newPassword} />
              </div>
              <div className={styles.Column}>
                <TextInput
                  inputProps={{
                    type: "password",
                    placeholder: "?????????? ?????? ????????",
                  }}
                  varient="shadow"
                  value={newPasswordRepeat}
                  onChange={setNewPasswordRepeat}
                />
                <ErrorList
                  errors={newPasswordValidation.errors.newPasswordRepeat}
                />
              </div>
              <div className={styles.Column}>
                <Button
                  varient="gradient"
                  onClick={() => {
                    setIsSubmitting(true);
                    passwordResetSet(passwordResetToken, newPassword)
                      .then(({ data }) => {
                        toast.success(data.message);
                        router.push(
                          data.token?.access ? "/dashboard" : "/login"
                        );
                      })
                      .catch(toast.error)
                      .finally(() => setIsSubmitting(false));
                  }}
                  loading={isSubmitting}
                  disabled={isSubmitting || !newPasswordValidation.isValid}
                >
                  ?????????????? ?????? ????????
                </Button>
                <div className={styles.BottomNote}>
                  <Link href="/login">
                    <a>???????????? ???? ???????? ????????</a>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.Image}>
          <Image />
        </div>
      </div>
    </div>
  );
}

interface CountDownProps {
  date: Date;
}

function CountDown({ date }: CountDownProps) {
  function getRemaningTime() {
    return Math.floor((date.getTime() - new Date().getTime()) / 1000);
  }
  const [remaningTime, setRemaningTime] = useState(getRemaningTime());

  useEffect(() => {
    const update = () => {
      const remaningTime = getRemaningTime();
      if (remaningTime > 0) {
        setRemaningTime(remaningTime);
      } else {
        setRemaningTime(0);
        clearInterval(interval);
      }
    };

    const interval = setInterval(update, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [date]);

  const remaningMinutes = Math.floor(remaningTime / 60);
  const remaningSeconds = Math.floor(remaningTime % 60);

  return (
    <>
      {remaningTime === 0
        ? "?????????? ??????"
        : `${remaningMinutes < 10 ? `0${remaningMinutes}` : remaningMinutes}:${
            remaningSeconds < 10 ? `0${remaningSeconds}` : remaningSeconds
          }`}
    </>
  );
}
