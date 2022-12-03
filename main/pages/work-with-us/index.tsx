import styles from "./style.module.scss";
import { ReactElement } from "react";
import { FormattedNumber } from "react-intl";
import Head from "next/head";
import { englishToPersianNumbers } from "@/shared/utils/numbers";
import Layout from "@/main/components/Layout";
import ExpandMoreIcon from "@/shared/assets/icons/expandMore.svg";
import HappyPeopleImage from "@/main/assets/images/happyPeople.svg";
import MobileMarketingImage from "@/main/assets/images/mobileMarketing.svg";
import SocialMediaImage from "@/main/assets/images/socialMedia.svg";
import MarketingBenefitImage from "@/main/assets/images/marketingBenefit.svg";
import CheckoutImage from "@/main/assets/images/checkout.svg";

export default function WorkWithUs() {
  return (
    <div className={styles.Container}>
      <Head>
        <title>صفحه اصلی</title>
      </Head>
      <div className={styles.Introduction}>
        <div>
          <div>
            <div>
              <div>
                <h1>همکاری در فروش</h1>
                <p>
                  در صورتی که شما با دانش آموزان یا دانشجویان ارتباط دارید،
                  می‌توانید وارد پنل کاربری خود شوید و از قسمت پنل بازاریابی
                  لینک اختصاصی خود را دریافت و به کاربران خود جهت ثبت سفارش
                  ارائه کنید تا با خرید کاربران از سود فروش برخوردار شوید
                </p>
              </div>
            </div>
            <div>
              <HappyPeopleImage />
            </div>
          </div>
        </div>
        <div className={styles.ReadMore}>
          بیشتر بخوانید
          <ExpandMoreIcon />
        </div>
      </div>
      <div className={styles.Section}>
        <h1>پنل بازاریابی برای چه کسانی مناسب است؟</h1>
        <div>
          <div>
            <p>
              این پنل برای هر کسی که به نوعی با دانش آموزان و دانشجویان ارتباط
              دارد مانند موارد زیر مناسب می باشد:
            </p>
            <ul>
              <li>مدیران مدارس و موسسات آموزشی</li>
              <li>مشاوران آموزشی</li>
              <li>سایت های آموزشی</li>
              <li>پیج های دانشجویی و دانشگاهی</li>
              <li>کانالهای تلگرامی دانشجویی</li>
              <li>علاقه‌مندان به بازاریابی مجازی</li>
            </ul>
          </div>
          <div>
            <MobileMarketingImage style={{ maxWidth: 420 }} />
          </div>
        </div>
      </div>
      <div className={styles.Section}>
        <h1>لینک اختصاصی چیست؟</h1>
        <div>
          <div>
            <p>
              پس از ثبت نام در سایت چاپ روم و ورود به پنل کاربری، در قسمت پنل
              بازاریابی لینک اختصاصی شبیه به https://chaproom.ir/?ref=123 دریافت
              خواهید کرد که در سایت یا شبکه‌های اجتماعی خود قرار می‌دهید .
              کاربرانتان از طریق این لینک برای اولین بار به سایت چاپ روم ارجاع
              می‌دهید و پس از اولین ارجاع حتی تا یک ماه بعد اگر کاربر شما از
              طریق لینک‌های دیگر ( مثلا چاپروم دات کام ) وارد چاپ‌روم شوند و
              خریدی انجام دهند ، آن مشتری در پنل بازاریابی شما لحاظ می‌گردد و از
              سود فروش برخوردار می‌شوید.
            </p>
          </div>
          <div>
            <SocialMediaImage style={{ maxWidth: 400 }} />
          </div>
        </div>
      </div>
      <div className={styles.Section}>
        <h1>تسویه حساب چگونه است؟</h1>
        <div>
          <div>
            <p>
              به ازای هر سفارش مشتری از طریق شما،{" "}
              <FormattedNumber value={0.1} style="percent" /> از مبلغ سفارش به
              کیف پول شما واریز می‌گردد.
            </p>
            <p>* توجه: فروش پکیج‌ها در پنل بازاریابی لحاظ نمیگردد.</p>
          </div>
          <div>
            <MarketingBenefitImage />
          </div>
        </div>
      </div>
      <div className={styles.Section}>
        <h1>تسویه حساب چگونه است؟</h1>
        <div>
          <div>
            <p>
              شما می توانید از داخل پنل کاربری روی دکمه برداشت موجودی کلیک کنید
              تا درخواست تسویه حساب برای ما ارسال شود. توجه داشته باشید که حداقل
              موجودی باید <FormattedNumber value={100000} /> تومان باشد
            </p>
          </div>
          <div>
            <CheckoutImage />
          </div>
        </div>
      </div>
      <div className={styles.Steps}>
        <h1>روند پنل همکاری در فروش</h1>
        <div>
          <div>
            <div>
              <div className={styles.NumberCircle}>
                {englishToPersianNumbers(1)}
              </div>
            </div>
            <div>ثبت نام در چاپ روم</div>
          </div>
          <div>
            <div>
              <div className={styles.NumberCircle}>
                {englishToPersianNumbers(2)}
              </div>
            </div>
            <div>دریافت لینک اختصاصی از پنل بازاریابی</div>
          </div>
          <div>
            <div>
              <div className={styles.NumberCircle}>
                {englishToPersianNumbers(3)}
              </div>
            </div>
            <div>اشتراک گذاری لینک اختصاصی</div>
          </div>
          <div>
            <div>
              <div className={styles.NumberCircle}>
                {englishToPersianNumbers(4)}
              </div>
            </div>
            <div>درخواست برداشت موجودی</div>
          </div>
        </div>
      </div>
    </div>
  );
}

WorkWithUs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
