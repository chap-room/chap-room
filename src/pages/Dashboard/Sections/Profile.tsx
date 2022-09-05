import { useContext, useState } from "react";
import Section from "../../../components/Dashboard/Section";
import ContentHeader from "../../../components/Dashboard/ContentHeader";
import BottomActions from "../../../components/Dashboard/BottomActions";
import { DataContext } from "../../../dataContext";
import TextInput from "../../../components/TextInput";
import FormTable from "../../../components/Dashboard/FormTable";

export default function DashboardProfile() {
  const data = useContext(DataContext);
  const [fullName, setFullName] = useState(data.currentUser.name);
  const [password, setPassword] = useState("");
  const [retryPassword, setRetryPassword] = useState("");

  return (
    <Section
      title="پروفایل"
      description="تنظیمات پروفایل خود را از این بخش تغییر دهید"
    >
      <ContentHeader title="اطلاعات من" />
      <FormTable
        fields={[
          {
            key: "phoneNumber",
            label: "شماره موبایل:",
            component: data.currentUser.phoneNumber,
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
      <BottomActions
        actions={[
          {
            key: "save",
            label: "ذخیره",
            variant: "filled",
            onClick: () => {},
          },
        ]}
      />
    </Section>
  );
}
