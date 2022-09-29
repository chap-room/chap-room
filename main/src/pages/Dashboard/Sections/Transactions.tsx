import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import SectionHeader from "@chap-room/shared/components/Dashboard/SectionHeader";
import SectionContent from "@chap-room/shared/components/Dashboard/SectionContent";
import ContentHeader from "@chap-room/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@chap-room/shared/components/Dashboard/MobileContentHeader";
import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import TransactionTable from "@chap-room/main/components/Dashboard/TransactionTable";

export default function DashboardTransactions() {
  const data = useContext(DashboardDataContext);

  return (
    <>
      <Helmet title="داشبورد - تراکنش ها" />
      <SectionHeader
        title="تراکنش ها"
        description="سوابق مالی خود را از این بخش مشاهده کنید"
      />
      <SectionContent>
        <ContentHeader title="همه سوابق مالی" />
        <MobileContentHeader backTo="/dashboard" title="سوابق مالی" />
        <TransactionTable
          transactions={data.state.transactions}
          onSeeDetails={(transactionId) => {
            console.log(transactionId);
          }}
        />
      </SectionContent>
    </>
  );
}
