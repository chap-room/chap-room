import styles from "./style.module.scss";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Thumbnail } from "@chap-room/shared/assets/images/printing.svg";
import Header from "@chap-room/main/components/Header";
import TextInput from "@chap-room/shared/components/TextInput";
import Button from "@chap-room/shared/components/Button";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigate();

  return (
    <div className={styles.Login}>
      <Helmet title="ورود" />
      <Header hideLogoInMobile showBackButtonInMobile />
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
            <Link to="/forgot-password">فراموشی رمز عبور</Link>
          </div>
          <div>
            <Button varient="gradient" onClick={() => navigation("/dashboard")}>
              ورود
            </Button>
            <div className={styles.BottomNote}>
              حساب کاربری ندارید؟ <Link to="/signup">ثبت نام کنید</Link>
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
