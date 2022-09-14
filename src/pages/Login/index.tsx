import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/Header";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { ReactComponent as Thumbnail } from "../../assets/images/printing.svg";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.Login}>
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
            value={phoneNumber}
            onTextChange={setPhoneNumber}
            placeholder="شماره موبایل"
          />
          <div>
            <TextInput
              value={password}
              onTextChange={setPassword}
              placeholder="رمز عبور"
              type="password"
            />
            <Link to="/forgot-password">فراموشی رمز عبور</Link>
          </div>
          <div>
            <Button varient="filled">ورود</Button>
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
