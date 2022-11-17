import styles from "./style.module.scss";
import { FormattedNumber } from "react-intl";
import Link from "next/link";
import AddressesIcon from "@/main/assets/icons/addresses.svg";
import CaillIcon from "@/main/assets/icons/call.svg";
import MailIcon from "@/main/assets/icons/mail.svg";
import LinkedinIcon from "@/main/assets/icons/linkedin.svg";
import TwitterIcon from "@/main/assets/icons/twitter.svg";
import YoutubeIcon from "@/main/assets/icons/youtube.svg";
import AparatIcon from "@/main/assets/icons/aparat.svg";
import InstagramIcon from "@/main/assets/icons/instagram.svg";
import BottomButtons from "@/main/components/BottomButtons";

export default function Footer() {
  return (
    <div className={styles.FooterWrapper}>
      <div className={styles.LogoContainer}>
        <div className={styles.LogoWave}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.Logo}>
          <img src="/assets/images/footerLogo.svg" alt="Footer Logo" />
        </div>
      </div>
      <div className={styles.Footer}>
        <div className={styles.FooterContent}>
          <div>
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
                  <AddressesIcon /> شعبه 1: تهران، خیابان فخر راضی
                </li>
                <li>
                  <AddressesIcon /> شعبه 2: اصفهان، خیابان پروین
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
            <div className={styles.AnoutUs}>
              <h3>درباره ما</h3>
              <p>
                چاپ روم یک سرویس پرینت و کپی آنلاین است که از سال 1398 فعالیت
                خود را در جهت بهینه سازی هزینه های چاپ و پرینت تا 90 درصد آغاز
                نمود. شما قادر خواهید بود از طریق وب سایت چاپ روم یا شبکه های
                اجتماعی سفارش خود را ثبت کنید سپس جزوه یا فایل خود را در قسمت
                مربوطه آپلود نمایید و با بالاترین کیفیت و سرعت جزوه خود را پرینت
                و درب منزل دریافت کنید.
              </p>
            </div>
          </div>
          <div>
            <div className={styles.SocialMedia}>
              <h2>چاپ روم را در شبکه‌های اجتماعی دنبال کنید</h2>
              <div className={styles.SocialMediaIcons}>
                <a href="https://www.instagram.com/chap.room/">
                  <InstagramIcon />
                </a>
                <a href="https://www.aparat.com/chaproom">
                  <AparatIcon />
                </a>
                <a href="https://www.youtube.com/user/Chaproom">
                  <YoutubeIcon />
                </a>
                <a href="https://twitter.com/chaproom1">
                  <TwitterIcon />
                </a>
                <a href="https://www.linkedin.com/in/chaproom-chaproom-6166b9202/">
                  <LinkedinIcon />
                </a>
              </div>
            </div>
            <div className={styles.Symbols}>
              <div>
                <img
                  src="/assets/images/enamad.png"
                  alt="نماد اعتماد الکترونیکی"
                />
              </div>
              <div>
                <img src="/assets/images/samandehi.png" alt="نماد ساماندهی" />
              </div>
            </div>
          </div>
          <div className={styles.Copyrights}>
            کلیه حقوق این وبسایت متعلق به چاپ روم می باشد.
          </div>
        </div>
        <div className={styles.BottomButtonsPlaceholder}>
          <BottomButtons />
        </div>
      </div>
    </div>
  );
}
