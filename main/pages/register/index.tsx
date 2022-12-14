import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getIsLoggedIn,
  register,
  registerConfirm,
  resendCode,
} from "@/main/api";
import {
  useValidation,
  validateInt,
  validateLength,
  validateNotEmpty,
  validatePasswordRepeat,
  validatePhoneNumber,
} from "@/shared/utils/validation";
import LogoWithName from "@/shared/assets/images/logoWithName.svg";
import ArrowForwardIcon from "@/shared/assets/icons/arrowForward.svg";
import Image from "@/shared/assets/images/printing.svg";
import TextInput from "@/shared/components/TextInput";
import ErrorList from "@/shared/components/ErrorList";
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

  const formValidation = useValidation(
    {
      name: [validateNotEmpty()],
      phoneNumber: [validatePhoneNumber()],
      password: [validateLength({ min: 8 })],
      passwordRepeat: [
        validateLength({ min: 8 }),
        validatePasswordRepeat(password),
      ],
    },
    {
      name,
      phoneNumber,
      password,
      passwordRepeat,
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

  useEffect(() => {
    getIsLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) router.replace("/dashboard");
    });
  }, []);

  return (
    <div className={styles.Register}>
      <Head>
        <title>?????? ??????</title>
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
                <div className={styles.Title}>?????? ??????</div>
                <div className={styles.SubTitle}>
                  ???????? ?????? ?????? ?????????????? ?????? ???? ???????? ????????
                </div>
              </div>
              <div className={styles.Column}>
                <TextInput
                  inputProps={{ placeholder: "?????? ?? ?????? ????????????????" }}
                  varient="shadow"
                  value={name}
                  onChange={setName}
                />
                <ErrorList errors={formValidation.errors.name} />
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
                <TextInput
                  inputProps={{
                    type: "password",
                    placeholder: "?????? ????????",
                  }}
                  varient="shadow"
                  value={password}
                  onChange={setPassword}
                />
                <ErrorList errors={formValidation.errors.password} />
              </div>
              <div className={styles.Column}>
                <TextInput
                  inputProps={{
                    type: "password",
                    placeholder: "?????????? ?????? ????????",
                  }}
                  varient="shadow"
                  value={passwordRepeat}
                  onChange={setPasswordRepeat}
                />
                <ErrorList errors={formValidation.errors.passwordRepeat} />
              </div>
              <div className={styles.CheckBoxWithLabel}>
                <CheckBox
                  checked={agreeTermsAndConditions}
                  onChange={setAgreeTermsAndConditions}
                />
                <span>
                  ????{" "}
                  <Link href="/terms-and-conditions">
                    <a>???????????? ?? ????????????</a>
                  </Link>{" "}
                  ?????? ?????? ?????????? ????????
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
                        setConfirmCodeExpirationDate(new Date(expireAt));
                      })
                      .catch(toast.error)
                      .finally(() => setIsSubmitting(false));
                  }}
                  loading={isSubmitting}
                  disabled={
                    isSubmitting ||
                    !formValidation.isValid ||
                    !agreeTermsAndConditions
                  }
                >
                  ?????????? ???? ????????????
                </Button>
                <div className={styles.BottomNote}>
                  ???????? ???????????? ????????????{" "}
                  <Link href="/login">
                    <a>???????? ????????</a>
                  </Link>
                </div>
              </div>
            </>
          ) : (
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
                disabled={isSubmitting || !confirmCodeValidation.isValid}
              >
                ?????? ??????
              </Button>
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
