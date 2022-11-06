import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { FormattedNumber } from "react-intl";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { isLoggedIn, login, loginConfirm, resendCode } from "@/admin/api";
import LogoWithName from "@/shared/assets/images/logoWithName.svg";
import ArrowForwardIcon from "@/shared/assets/icons/arrowForward.svg";
import Thumbnail from "@/shared/assets/images/printing.svg";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";

export default function Login() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
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
    <div className={styles.Login}>
      <Head>
        <title>ورود</title>
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
                <div className={styles.Title}>ورود</div>
                <div className={styles.SubTitle}>
                  لطفا وارد حساب کاربری خود شوید
                </div>
              </div>
              <TextInput
                inputProps={{ type: "number", placeholder: "شماره موبایل" }}
                value={phoneNumber}
                onChange={(newValue) =>
                  setPhoneNumber(newValue.substring(0, 11))
                }
              />
              <div>
                <TextInput
                  inputProps={{
                    type: "password",
                    placeholder: "رمز عبور",
                  }}
                  value={password}
                  onChange={setPassword}
                />
              </div>
              <div className={styles.Column}>
                <Link href="/forgot-password">
                  <a>فراموشی رمز عبور</a>
                </Link>
                <Button
                  varient="gradient"
                  onClick={() => {
                    setIsSubmitting(true);
                    login(phoneNumber, password)
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
                    password.length < 8
                  }
                >
                  ارسال کد تائیید
                </Button>
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
                  loginConfirm(phoneNumber, parseInt(confirmCode))
                    .then(() =>
                      router.query.redirectTo
                        ? router.push(router.query.redirectTo as string)
                        : router.push("/dashboard")
                    )
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
                ورود
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