import styles from "./style.module.scss";
import { ReactElement, useState } from "react";
import toast from "react-hot-toast";
import Head from "next/head";
import { submitContactUs } from "@/main/api";
import {
  useValidation,
  validateNotEmpty,
  validatePhoneNumber,
} from "@/shared/utils/validation";
import Layout from "@/main/components/Layout";
import TextInput from "@/shared/components/TextInput";
import TextArea from "@/shared/components/TextArea";
import Button from "@/shared/components/Button";
import AddressesIcon from "@/main/assets/icons/addresses.svg";
import CaillIcon from "@/main/assets/icons/call.svg";
import MailIcon from "@/main/assets/icons/mail.svg";
import ErrorList from "@/shared/components/ErrorList";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formValidation = useValidation(
    {
      name: [validateNotEmpty()],
      phoneNumber: [validatePhoneNumber()],
      message: [validateNotEmpty()],
    },
    {
      name,
      phoneNumber,
      message,
    }
  );

  return (
    <div className={styles.Container}>
      <Head>
        <title>تماس با ما</title>
      </Head>
      <div className={styles.Form}>
        <h1>تماس با ما</h1>
        <div className={styles.Row}>
          <div className={styles.NameInputContainer}>
            <TextInput
              inputProps={{ placeholder: "نام و نام خانوادگی" }}
              varient="shadow"
              value={name}
              onChange={setName}
            />
            <ErrorList errors={formValidation.errors.name} />
          </div>
          <div className={styles.PhoneNumberInputContainer}>
            <TextInput
              inputProps={{ placeholder: "شماره موبایل", type: "number" }}
              varient="shadow"
              value={phoneNumber}
              onChange={(newValue) => setPhoneNumber(newValue.substring(0, 11))}
            />
            <ErrorList errors={formValidation.errors.phoneNumber} />
          </div>
        </div>
        <div className={styles.MessageInputContainer}>
          <TextArea
            placeholder="پیام خودتان را بنویسید ..."
            varient="shadow"
            rows={5}
            value={message}
            onTextChange={setMessage}
          />
          <ErrorList errors={formValidation.errors.message} />
        </div>
        <div className={styles.SubmitButtonContainer}>
          <Button
            varient="gradient"
            style={{ minWidth: 150 }}
            onClick={() => {
              setIsSubmitting(true);
              submitContactUs(name, phoneNumber, message)
                .then(toast.success)
                .catch(toast.error)
                .finally(() => setIsSubmitting(false));
            }}
            loading={isSubmitting}
            disabled={isSubmitting || !formValidation.isValid}
          >
            ارسال
          </Button>
        </div>
        <div className={styles.Details}>
          <div>
            <h2>تماس</h2>
            <ul>
              <li>
                <CaillIcon /> 021-91090772
              </li>
              <li>
                <CaillIcon /> 031-91090414
              </li>
              <li>
                <MailIcon /> info@chaproom.com
              </li>
            </ul>
          </div>
          <div>
            <h2>نشانی</h2>
            <ul>
              <li>
                <AddressesIcon /> شعبه 1: تهران، خیابان فخر راضی
              </li>
              <li>
                <AddressesIcon /> شعبه 2: اصفهان، خیابان پروین
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.Map}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d92388.97815863125!2d51.3890247582092!3d35.68383192377295!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8dfe05732c2e91%3A0xfcbec017befd15f4!2z2KjYsdisINii2LLYp9iv2Yo!5e0!3m2!1sar!2str!4v1666358621694!5m2!1sar!2str"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

ContactUs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
