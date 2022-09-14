import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/Header";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { ReactComponent as Thumbnail } from "../../assets/images/thinking.svg";

export default function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className={styles.ForgotPassword}>
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
            value={phoneNumber}
            onTextChange={setPhoneNumber}
            placeholder="شماره موبایل"
          />
          <div>
            <Button varient="filled">بازیابی رمز عبور</Button>
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
