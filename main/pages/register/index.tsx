import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { FormattedNumber } from "react-intl";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import { isLoggedIn, register, registerConfirm, resendCode } from "@/main/api";
import Thumbnail from "@/shared/assets/images/printing.svg";
import Header from "@/main/components/Header";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import CheckBox from "@/shared/components/CheckBox";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [agreeTermsAndConditions, setAgreeTermsAndConditions] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [confirmCodeExpirationDate, setConfirmCodeExpirationDate] =
    useState<null | Date>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    isLoggedIn().then(() => {
      router.replace("/dashboard");
    }).catch(() => {});
  }, []);

  return (
    <div className={styles.Register}>
      <Head>
        <title>ثبت نام</title>
      </Head>
      <Header hideLogoInMobile showBackButtonInMobile />
      <div className={styles.Content}>
        <div className={styles.Form}>
          {confirmCodeExpirationDate === null ? (
            <>
              <div className={styles.Column}>
                <div className={styles.Title}>ثبت نام</div>
                <div className={styles.SubTitle}>
                  برای ثبت نام اطلاعات خود را وارد کنید
                </div>
              </div>
              <TextInput
                value={name}
                onChange={setName}
                inputProps={{ placeholder: "نام و نام خانوادگی" }}
              />
              <TextInput
                inputProps={{ type: "number", placeholder: "شماره موبایل" }}
                value={phoneNumber}
                onChange={(newValue) =>
                  setPhoneNumber(newValue.substring(0, 11))
                }
              />
              <TextInput
                inputProps={{
                  type: "password",
                  placeholder: "رمز عبور",
                }}
                value={password}
                onChange={setPassword}
              />
              <TextInput
                inputProps={{
                  type: "password",
                  placeholder: "تکرار رمز عبور",
                }}
                value={passwordRepeat}
                onChange={setPasswordRepeat}
              />
              <div className={styles.CheckBoxWithLabel}>
                <CheckBox
                  checked={agreeTermsAndConditions}
                  onChange={setAgreeTermsAndConditions}
                />
                <span>
                  با{" "}
                  <Link href="#">
                    {/* TODO */}
                    <a>قوانین و مقررات</a>
                  </Link>{" "}
                  چاپ روم موافق هستم
                </span>
              </div>
              <div className={styles.Column}>
                <Button
                  varient="gradient"
                  onClick={() => {
                    setIsSubmitting(true);
                    register(
                      name,
                      phoneNumber,
                      password,
                      localStorage.getItem("referralSlug")
                    )
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
                    isNaN(parseInt(phoneNumber)) ||
                    password.length < 8 ||
                    password !== passwordRepeat ||
                    !agreeTermsAndConditions
                  }
                >
                  ارسال کد تائیید
                </Button>
                <div className={styles.BottomNote}>
                  حساب کاربری دارید؟{" "}
                  <Link href="/login">
                    <a>وارد شوید</a>
                  </Link>
                </div>
              </div>
            </>
          ) : (
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
              <Button
                varient="gradient"
                onClick={() => {
                  setIsSubmitting(true);
                  registerConfirm(phoneNumber, parseInt(confirmCode))
                    .then(() => router.push("/dashboard"))
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
                ثبت نام
              </Button>
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
