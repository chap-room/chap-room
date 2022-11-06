import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { FormattedNumber } from "react-intl";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import {
  isLoggedIn,
  passwordReset,
  passwordResetConfirmCode,
  passwordResetSet,
  resendCode,
} from "@/main/api";
import Header from "@/main/components/Header";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import Thumbnail from "@/shared/assets/images/thinking.svg";

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

  useEffect(() => {
    isLoggedIn()
      .then(() => {
        router.replace("/dashboard");
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.ForgotPassword}>
      <Head>
        <title>فراموشی رمز عبور</title>
      </Head>
      <Header hideLogoInMobile showBackButtonInMobile />
      <div className={styles.Content}>
        <div className={styles.Form}>
          {confirmCodeExpirationDate === null ? (
            <>
              <div className={styles.Column}>
                <div className={styles.Title}>فراموشی رمز عبور</div>
                <div className={styles.SubTitle}>
                  شماره موبایلی که با آن ثبت نام کرده‌اید را وارد نمایید
                </div>
              </div>
              <TextInput
                inputProps={{ type: "number", placeholder: "شماره موبایل" }}
                varient="shadow"
                value={phoneNumber}
                onChange={(newValue) =>
                  setPhoneNumber(newValue.substring(0, 11))
                }
              />
              <div className={styles.Column}>
                <Button
                  varient="gradient"
                  onClick={() => {
                    setIsSubmitting(true);
                    passwordReset(phoneNumber)
                      .then(({ message, expireAt }) => {
                        toast.success(message);
                        setConfirmCodeExpirationDate(expireAt);
                      })
                      .catch(toast.error)
                      .finally(() => setIsSubmitting(false));
                  }}
                  loading={isSubmitting}
                  disabled={
                    isSubmitting ||
                    phoneNumber.length !== 11 ||
                    !phoneNumber.startsWith("09") ||
                    isNaN(parseInt(phoneNumber))
                  }
                >
                  ارسال کد تائیید
                </Button>
                <div className={styles.BottomNote}>
                  <Link href="/login">
                    <a>بازگشت به صفحه ورود</a>
                  </Link>
                </div>
              </div>
            </>
          ) : passwordResetToken === null ? (
            <>
              <div className={styles.Column}>
                <div className={styles.Title}>تایید شماره موبایل</div>
                <div className={styles.SubTitle}>
                  کد 6 رقمی به شماره{" "}
                  <FormattedNumber
                    value={parseInt(phoneNumber)}
                    minimumIntegerDigits={11}
                    useGrouping={false}
                  />{" "}
                  ارسال شد.
                </div>
              </div>
              <TextInput
                inputProps={{ type: "number", placeholder: "کد تائیید" }}
                varient="shadow"
                value={confirmCode}
                onChange={(newValue) =>
                  setConfirmCode(newValue.substring(0, 6))
                }
                suffix={<CountDown date={confirmCodeExpirationDate} />}
              />
              <div className={styles.ConfirmCodeActions}>
                <button
                  onClick={() => {
                    setIsResending(true);
                    resendCode(phoneNumber)
                      .then(({ message, expireAt }) => {
                        toast.success(message);
                        setConfirmCodeExpirationDate(expireAt);
                      })
                      .catch(toast.error)
                      .finally(() => setIsResending(false));
                  }}
                  disabled={isResending}
                >
                  ارسال مجدد
                </button>
                <button
                  onClick={() => {
                    setConfirmCode("");
                    setConfirmCodeExpirationDate(null);
                  }}
                >
                  بازگشت
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
                  disabled={
                    isSubmitting ||
                    confirmCode.length !== 6 ||
                    isNaN(parseInt(confirmCode))
                  }
                >
                  تایید کد
                </Button>
                <div className={styles.BottomNote}>
                  <Link href="/login">
                    <a>بازگشت به صفحه ورود</a>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.Column}>
                <div className={styles.Title}>رمز عبور جدید</div>
                <div className={styles.SubTitle}>
                  لطفا رمز عبور جدید خود را وارد نمایید
                </div>
              </div>
              <TextInput
                inputProps={{
                  type: "password",
                  placeholder: "رمز عبور",
                }}
                varient="shadow"
                value={newPassword}
                onChange={setNewPassword}
              />
              <TextInput
                inputProps={{
                  type: "password",
                  placeholder: "تکرار رمز عبور",
                }}
                varient="shadow"
                value={newPasswordRepeat}
                onChange={setNewPasswordRepeat}
              />
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
                  disabled={
                    isSubmitting ||
                    newPassword.length < 8 ||
                    newPassword !== newPasswordRepeat
                  }
                >
                  بازیابی رمز عبور
                </Button>
                <div className={styles.BottomNote}>
                  <Link href="/login">
                    <a>بازگشت به صفحه ورود</a>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.Thumbnail}>
          <Thumbnail />
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

  return (
    <>
      {remaningTime === 0 ? (
        "منقضی شده"
      ) : (
        <>
          <FormattedNumber
            value={Math.floor(remaningTime / 60)}
            minimumIntegerDigits={2}
          />
          :
          <FormattedNumber
            value={Math.floor(remaningTime % 60)}
            minimumIntegerDigits={2}
          />
        </>
      )}
    </>
  );
}
