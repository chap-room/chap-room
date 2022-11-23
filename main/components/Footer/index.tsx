import styles from "./style.module.scss";
import { FormattedNumber } from "react-intl";
import Link from "next/link";
import AddressesIcon from "@/main/assets/icons/addresses.svg";
import CaillIcon from "@/main/assets/icons/call.svg";
import MailIcon from "@/main/assets/icons/mail.svg";
import AparatIcon from "@/main/assets/icons/aparat.svg";
import InstagramIcon from "@/main/assets/icons/instagram.svg";
import BottomButtons from "@/main/components/BottomButtons";

export default function Footer() {
  return (
    <div className={styles.Footer}>
      <div className={styles.LogoContainer}>
        <div className={styles.Logo}>
          <img src="/assets/images/footerLogo.svg" alt="Footer Logo" />
        </div>
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
              <AddressesIcon /> تهران، میدان انقلاب
            </li>
            <li>
              <AddressesIcon /> اصفهان، خیابان احمدآباد
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
                <a>شابک</a>
              </li>
              <li>
                <a>فیپا</a>
              </li>
              <li>
                <a>مجوز وزارت ارشاد</a>
              </li>
              <li>
                <a>قیمت چاپ کتاب</a>
              </li>
              <li>
                <a>طراحی جلد کتاب</a>
              </li>
            </ul>
            <ul>
              <li>
                <a>تبدیل پایان نامه به کتاب</a>
              </li>
              <li>
                <a>چاپ کتاب با تیراژ پایین</a>
              </li>
              <li>
                <a>پرینت رنگی</a>
              </li>
              <li>
                <a>پرینت سیاه سفید</a>
              </li>
              <li>
                <a>ویرایشگر آنلاین فایل های PDF</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.Symbol}>
          <img src="/assets/images/samandehi.png" alt="نماد ساماندهی" />
        </div>
      </div>
      <div className={styles.Copyrights}>
        کلیه حقوق این وبسایت متعلق به چاپ روم می باشد.
      </div>
      <div className={styles.BottomButtonsPlaceholder}>
        <BottomButtons />
      </div>
    </div>
  );
}
