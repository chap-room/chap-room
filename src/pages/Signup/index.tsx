import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/Header";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { ReactComponent as Thumbnail } from "../../assets/images/printing.svg";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  return (
    <div className={styles.Signup}>
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
            onTextChange={setFullName}
            placeholder="نام و نام خانوادگی"
          />
          <TextInput
            value={phoneNumber}
            onTextChange={setPhoneNumber}
            placeholder="شماره موبایل"
          />
          <TextInput
            value={password}
            onTextChange={setPassword}
            placeholder="رمز عبور"
            type="password"
          />
          <TextInput
            value={passwordRepeat}
            onTextChange={setPasswordRepeat}
            placeholder="تکرار رمز عبور"
            type="password"
          />
          <div>
            <Button varient="filled">ثبت نام</Button>
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
