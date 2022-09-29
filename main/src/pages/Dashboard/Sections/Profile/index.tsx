import styles from "./style.module.scss";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import SectionHeader from "@chap-room/shared/components/Dashboard/SectionHeader";
import SectionContent from "@chap-room/shared/components/Dashboard/SectionContent";
import ContentHeader from "@chap-room/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@chap-room/shared/components/Dashboard/MobileContentHeader";
import TextInput from "@chap-room/shared/components/TextInput";
import BottomActions from "@chap-room/shared/components/Dashboard/BottomActions";
import Button from "@chap-room/shared/components/Button";

export default function DashboardProfile() {
  const data = useContext(DashboardDataContext);
  const [fullName, setFullName] = useState(data.state.currentUser.name);
  const [password, setPassword] = useState("");
  const [retryPassword, setRetryPassword] = useState("");

  return (
    <>
      <Helmet title="داشبورد - پروفایل" />
      <SectionHeader
        title="پروفایل"
        description="تنظیمات پروفایل خود را از این بخش تغییر دهید"
      />
      <SectionContent>
        <ContentHeader title="اطلاعات من" />
        <MobileContentHeader backTo="/dashboard" title="اطلاعات من" />
        <div className={styles.Form}>
          <div className={styles.Label}>شماره موبایل:</div>
          <div className={styles.Input}>
            {data.state.currentUser.phoneNumber}
          </div>
          <div className={styles.Label}>نام کامل:</div>
          <div className={styles.Input}>
            <TextInput value={fullName} onChange={setFullName} />
          </div>
          <div className={styles.Label}>رمز عبور:</div>
          <div className={styles.Input}>
            <TextInput
              inputProps={{
                type: "password",
                placeholder: "رمز عبور",
              }}
              value={password}
              onChange={setPassword}
            />
          </div>
          <div className={styles.Label}>تکرار رمز عبور:</div>
          <div className={styles.Input}>
            <TextInput
              inputProps={{
                type: "password",
                placeholder: "تکرار رمز عبور",
              }}
              value={retryPassword}
              onChange={setRetryPassword}
            />
          </div>
        </div>
        <BottomActions>
          <Button varient="filled" style={{ minWidth: 100 }}>
            ذخیره
          </Button>
        </BottomActions>
      </SectionContent>
    </>
  );
}
