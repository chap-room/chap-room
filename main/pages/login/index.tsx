import styles from "./style.module.scss";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { login } from "@/main/api";
import Thumbnail from "@/shared/assets/images/printing.svg";
import Header from "@/main/components/Header";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.Login}>
      <Head>
        <title>ورود</title>
      </Head>
      <Header hideLogoInMobile showBackButtonInMobile />
      <div className={styles.Content}>
        <div className={styles.Form}>
          <div className={styles.Column}>
            <div className={styles.Title}>ورود</div>
            <div className={styles.SubTitle}>
              لطفا وارد حساب کاربری خود شوید
            </div>
          </div>
          <TextInput
            inputProps={{ type: "number", placeholder: "شماره موبایل" }}
            value={phoneNumber}
            onChange={(newValue) => setPhoneNumber(newValue.substring(0, 11))}
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
                phoneNumber.length !== 11 ||
                !phoneNumber.startsWith("09") ||
                isNaN(parseInt(phoneNumber)) ||
                password.length < 8
              }
            >
              ورود
            </Button>
            <div className={styles.BottomNote}>
              حساب کاربری ندارید؟{" "}
              <Link href="/register">
                <a>ثبت نام کنید</a>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.Thumbnail}>
          <Thumbnail />
        </div>
      </div>
    </div>
  );
}
