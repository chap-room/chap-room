import styles from "./style.module.scss";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Thumbnail } from "@chap-room/shared/assets/images/printing.svg";
import Header from "@chap-room/main/components/Header";
import TextInput from "@chap-room/shared/components/TextInput";
import Button from "@chap-room/shared/components/Button";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const navigation = useNavigate();

  return (
    <div className={styles.Signup}>
      <Helmet title="ثبت نام" />
      <Header hideLogoInMobile showBackButtonInMobile />
      <div className={styles.Content}>
        <div className={styles.Form}>
          <div>
            <div className={styles.Title}>ثبت نام</div>
            <div className={styles.SubTitle}>
              برای ثبت نام اطلاعات خود را وارد کنید
            </div>
          </div>
          <TextInput
            value={fullName}
            onChange={setFullName}
            inputProps={{ placeholder: "نام و نام خانوادگی" }}
          />
          <TextInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            inputProps={{ placeholder: "شماره موبایل" }}
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
          <div>
            <Button varient="gradient" onClick={() => navigation("/dashboard")}>
              ثبت نام
            </Button>
            <div className={styles.BottomNote}>
              حساب کاربری دارید؟ <Link to="/login">وارد شوید</Link>
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
