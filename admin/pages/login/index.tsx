import styles from "./style.module.scss";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import LogoWithName from "@/shared/assets/images/logoWithName.svg";
import ArrowForwardIcon from "@/shared/assets/icons/arrowForward.svg";
import Thumbnail from "@/shared/assets/images/printing.svg";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

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
          <div>
            <div className={styles.Title}>ورود</div>
            <div className={styles.SubTitle}>
              لطفا وارد حساب کاربری خود شوید
            </div>
          </div>
          <TextInput
            inputProps={{ placeholder: "شماره موبایل" }}
            value={phoneNumber}
            onChange={setPhoneNumber}
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
            <Link href="/forgot-password">
              <a>فراموشی رمز عبور</a>
            </Link>
          </div>
          <div>
            <Link href="/dashboard">
              <Button varient="gradient">ورود</Button>
            </Link>
          </div>
        </div>
        <div className={styles.Thumbnail}>
          <Thumbnail />
        </div>
      </div>
    </div>
  );
}
