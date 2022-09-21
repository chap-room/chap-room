import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { DashboardDataContext } from "../../../context/DashboardData";
import Section from "../../../components/Dashboard/Section";
import ContentHeader from "../../../components/Dashboard/ContentHeader";
import TextInput from "../../../components/TextInput";
import FormTable from "../../../components/Dashboard/FormTable";
import BottomActions from "../../../components/Dashboard/BottomActions";
import Button from "../../../components/Button";

export default function DashboardProfile() {
  const data = useContext(DashboardDataContext);
  const [fullName, setFullName] = useState(data.state.currentUser.name);
  const [password, setPassword] = useState("");
  const [retryPassword, setRetryPassword] = useState("");

  return (
    <Section
      title="پروفایل"
      description="تنظیمات پروفایل خود را از این بخش تغییر دهید"
    >
      <Helmet title="داشبورد - پروفایل" />
      <ContentHeader title="اطلاعات من" />
      <FormTable
        fields={[
          {
            key: "phoneNumber",
            label: "شماره موبایل:",
            component: data.state.currentUser.phoneNumber,
          },
          {
            key: "fullName",
            label: "نام کامل:",
            component: (
              <TextInput
                value={fullName}
                onTextChange={(newValue) => setFullName(newValue)}
              />
            ),
          },
          {
            key: "password",
            label: "رمز عبور:",
            component: (
              <TextInput
                type="password"
                value={password}
                onTextChange={(newValue) => setPassword(newValue)}
              />
            ),
          },
          {
            key: "retryPassword",
            label: "تکرار رمز عبور:",
            component: (
              <TextInput
                type="password"
                value={retryPassword}
                onTextChange={(newValue) => setRetryPassword(newValue)}
              />
            ),
          },
        ]}
      />
      <BottomActions>
        <Button varient="filled" style={{ minWidth: 100 }}>ذخیره</Button>
      </BottomActions>
    </Section>
  );
}
