import styles from "./style.module.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@chap-room/main/components/Header";
import TextInput from "@chap-room/shared/components/TextInput";
import Button from "@chap-room/shared/components/Button";
import { ReactComponent as Thumbnail } from "@chap-room/shared/assets/images/thinking.svg";

export default function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const navigation = useNavigate();

  return (
    <div className={styles.ForgotPassword}>
      <Helmet title="فراموشی رمز عبور" />
      <Header hideLogoInMobile showBackButtonInMobile />
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
            <Button varient="gradient" onClick={() => navigation("/login")}>
              بازیابی رمز عبور
            </Button>
            <div className={styles.BottomNote}>
              <Link to="/login">بازگشت به صفحه ورود</Link>
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
