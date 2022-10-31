import { useContext } from "react";
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
import AddressForm from "@/shared/components/Dashboard/AddressForm";

export default function DashboardUserAddressEdit() {
  const data = useContext(DataContext);
  const router = useRouter();
  const { userId, addressId } = router.query;
  const user = data.state.users.filter((item) => item.id === userId)[0];
  if (!user) return <></>; // TODO 404
  const address = user.addresses.filter((item) => item.id === addressId)[0];
  if (!address) return <></>; // TODO 404

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - ویرایش آدرس</title>
      </Head>
      <SectionHeader
        title="کاربران"
        description="کاربران را از این بخش اضافه و ویرایش کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن آدرس"
          end={
            <Link href={`/dashboard/users/${userId}/addresses`}>
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={`/dashboard/users/${userId}/addresses`}
          title="ویرایش کردن آدرس"
        />
        <AddressForm
          defaultValues={address}
          onSave={(addressFormData) => {
            data.dispatch({
              type: "USERS:UPDATE",
              payload: {
                ...user,
                addresses: user.addresses.map((item) =>
                  item.id === address.id
                    ? { id: address.id, ...addressFormData }
                    : item
                ),
              },
            });
            router.push(`/dashboard/users/${userId}/addresses`);
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
