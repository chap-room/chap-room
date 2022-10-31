import styles from "./style.module.scss";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import LogoWithName from "@/shared/assets/images/logoWithName.svg";
import ArrowForwardIcon from "@/shared/assets/icons/arrowForward.svg";
import Thumbnail from "@/shared/assets/images/thinking.svg";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";

export default function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className={styles.ForgotPassword}>
      <Head>
        <title>فراموشی رمز عبور</title>
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
          <div>
            <div className={styles.Title}>فراموشی رمز عبور</div>
            <div className={styles.SubTitle}>
              شماره موبایلی که با آن ثبت نام کرده‌اید را وارد نمایید
            </div>
          </div>
          <TextInput
            inputProps={{ placeholder: "شماره موبایل" }}
            value={phoneNumber}
            onChange={setPhoneNumber}
          />
          <div>
            <Link href="/login">
              <Button varient="gradient">بازیابی رمز عبور</Button>
            </Link>
            <div className={styles.BottomNote}>
              <Link href="/login">
                <a>بازگشت به صفحه ورود</a>
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
