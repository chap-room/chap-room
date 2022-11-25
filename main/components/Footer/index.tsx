import styles from "./style.module.scss";
import { FormattedNumber } from "react-intl";
import Link from "next/link";
import LocationIcon from "@/main/assets/icons/location.svg";
import CaillIcon from "@/main/assets/icons/call.svg";
import MailIcon from "@/main/assets/icons/mail.svg";
import AparatIcon from "@/main/assets/icons/aparat.svg";
import InstagramIcon from "@/main/assets/icons/instagram.svg";
import BottomButtons from "@/main/components/BottomButtons";

export default function Footer() {
  return (
    <div className={styles.Footer}>
      <div className={styles.Logo}>
        <img src="/assets/images/footerLogo.svg" alt="Footer Logo" />
      </div>
      <div className={styles.FooterContent}>
        <div className={styles.Symbol}>
          <img src="/assets/images/enamad.png" alt="نماد اعتماد الکترونیکی" />
        </div>
        <div className={styles.ContactUs}>
          <h3>تماس با ما</h3>
          <ul>
            <li>
              <CaillIcon />{" "}
              <FormattedNumber value={21} minimumIntegerDigits={3} />-
              <FormattedNumber value={91090772} useGrouping={false} />
            </li>
            <li>
              <CaillIcon />{" "}
              <FormattedNumber value={31} minimumIntegerDigits={3} />-
              <FormattedNumber value={91090414} useGrouping={false} />
            </li>
            <li>
              <MailIcon /> info@chaproom.com
            </li>
            <li>
              <LocationIcon /> تهران، میدان انقلاب
            </li>
            <li>
              <LocationIcon /> اصفهان، خیابان احمدآباد
            </li>
          </ul>
        </div>
        <div className={styles.Guide}>
          <h3>راهنما</h3>
          <ul>
            <li>
              <Link href="/blog">
                <a>وبلاگ</a>
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions">
                <a>قوانین و مقررات</a>
              </Link>
            </li>
            <li>
              {/* TODO */}
              <Link href="/">
                <a>راهنمای ثبت سفارش</a>
              </Link>
            </li>
            <li>
              <Link href="/faq">
                <a>پاسخ به پرسش‌های متداول</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.SocialMedia}>
          <h3>چاپ روم را در شبکه‌های اجتماعی دنبال کنید</h3>
          <div className={styles.SocialMediaIcons}>
            <a href="https://www.instagram.com/chap.room/">
              <InstagramIcon />
            </a>
            <a href="https://www.aparat.com/chaproom">
              <AparatIcon />
            </a>
          </div>
        </div>
        <div className={styles.UsefulLinks}>
          <h3>لینک های مفید</h3>
          <div>
            <ul>
              <li>
                <a href="#">شابک</a>
              </li>
              <li>
                <a href="#">فیپا</a>
              </li>
              <li>
                <a href="#">مجوز وزارت ارشاد</a>
              </li>
              <li>
                <a href="#">قیمت چاپ کتاب</a>
              </li>
              <li>
                <a href="#">طراحی جلد کتاب</a>
              </li>
            </ul>
            <ul>
              <li>
                <a href="#">تبدیل پایان نامه به کتاب</a>
              </li>
              <li>
                <a href="#">چاپ کتاب با تیراژ پایین</a>
              </li>
              <li>
                <a href="#">پرینت رنگی</a>
              </li>
              <li>
                <a href="#">پرینت سیاه سفید</a>
              </li>
              <li>
                <a href="#">ویرایشگر آنلاین فایل های PDF</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.Symbol}>
          <img src="/assets/images/samandehi.png" alt="نماد ساماندهی" />
        </div>
      </div>
      <div className={styles.Copyrights}>
        <div>کلیه حقوق این وبسایت متعلق به چاپ روم می باشد.</div>
      </div>
      <div className={styles.BottomButtonsPlaceholder}>
        <BottomButtons />
      </div>
    </div>
  );
}
