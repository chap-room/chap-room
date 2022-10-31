import styles from "./style.module.scss";
import { ReactElement, useState } from "react";
import { FormattedNumber } from "react-intl";
import Head from "next/head";
import { PrintSize } from "@/shared/types";
import Layout from "@/main/components/Layout";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import Select from "@/shared/components/Select";
import SwitchButtons from "@/shared/components/SwitchButtons";
import Switch from "@/shared/components/Switch";
import PrintPrices from "@/main/components/PrintPrices";

export default function Prices() {
  const [pricesPrintSize, setPricesPrintSize] = useState(PrintSize.a4);

  return (
    <div className={styles.Container}>
      <Head>
        <title>تماس با ما</title>
      </Head>
      <div>
        <h1>سفارش پرینت</h1>
        <div>
          <Select
            value={null}
            onChange={() => {}}
            options={{}}
            placeholder="اندازه کاغذ"
            readOnly
          />
          <Select
            value={null}
            onChange={() => {}}
            options={{}}
            placeholder="سیاه و سفید/ رنگی"
            readOnly
          />
          <Select
            value={null}
            onChange={() => {}}
            options={{}}
            placeholder="یک رو / دو رو"
            readOnly
          />
          <div className={styles.Row}>
            <TextInput
              inputProps={{ type: "number", placeholder: "تعداد برگ" }}
            />
            <div>
              <span>قیمت هر برگ: </span>
              <span>
                <FormattedNumber value={380} /> تومان
              </span>
            </div>
          </div>
          <div className={styles.Bottom}>
            <Button varient="gradient">سفارش پرینت</Button>
          </div>
        </div>
      </div>
      <div>
        <h1>تعرفه پرینت</h1>
        <div>
          <div>
            <SwitchButtons
              options={[
                {
                  id: PrintSize.a4,
                  label: "سایز A4",
                },
                {
                  id: PrintSize.a5,
                  label: "سایز A5",
                },
                {
                  id: PrintSize.a3,
                  label: "سایز A3",
                },
              ]}
              value={pricesPrintSize}
              onChange={(newValue) => setPricesPrintSize(newValue as PrintSize)}
            />
          </div>
          <Switch
            currentViewId={pricesPrintSize}
            views={[
              {
                id: PrintSize.a4,
                content: <PrintPrices />,
              },
              {
                id: PrintSize.a5,
                content: <PrintPrices />,
              },
              {
                id: PrintSize.a3,
                content: <PrintPrices />,
              },
            ]}
          />
          <div>
            <p>توضیحات:</p>
            <ul>
              <li>
                قیمت ها بر اساس{" "}
                <u>
                  کاغذ تحریر <FormattedNumber value={80} /> گرمی درجه{" "}
                  <FormattedNumber value={1} />
                </u>{" "}
                می باشد.
              </li>
              <li>
                برای سفارش روی کاغذ گلاسه{" "}
                <u>
                  <FormattedNumber value={125} /> گرمی
                </u>
                به قیمت های فوق مبلغ <FormattedNumber value={800} /> تومان اضافه
                می گردد.
              </li>
              <li>
                <u>رنگی معمولی</u> یعنی پس زمینه تصویر سفید است اما المان های
                رنگی مانند نمودار، متون رنگی، شکل، سرصفحه، پا صفحه، لوگو و ...
                دارد. (تا نصف صفحه رنگی باشد)
              </li>
              <li>
                <u>تمام رنگی</u> یعنی پس زمینه تصویر رنگی است و شامل صفحاتی می
                شود که تقریبا تمامی صفحات آنها رنگی می باشد. (بیش از نصف صفحه
                رنگی باشد)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

Prices.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
