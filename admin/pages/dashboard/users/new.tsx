import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { DataContext } from "@/admin/context/Data";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import UserForm from "@/shared/components/Dashboard/UserForm";

export default function DashboardNewUser() {
  const data = useContext(DataContext);
  const router = useRouter();

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - افزودن کاربر</title>
      </Head>
      <SectionHeader
        title="کاربران"
        description="کاربران را از این بخش اضافه و ویرایش کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="افزودن کاربر جدید"
          end={
            <Link href="/dashboard/users">
              <Button
                style={{ padding: 0 }}
                onClick={() => router.push("/dashboard/users")}
              >
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/users"
          title="افزودن کاربر جدید"
        />
        <UserForm
          canEditPhoneNumber
          onSave={(userFormData) => {
            data.dispatch({
              type: "USERS:PUSH",
              payload: {
                id: uuidv4(),
                ...userFormData,
                avatar: null,
                wallet: {
                  balance: 0,
                  marketingSales: 0,
                },
                addresses: [],
                orders: [],
                transactions: [],
              },
            });
            router.push("/dashboard/users");
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
