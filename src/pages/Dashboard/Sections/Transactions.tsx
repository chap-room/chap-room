import { useContext } from "react";
import { Helmet } from "react-helmet";
import Section from "../../../components/Dashboard/Section";
import ContentHeader from "../../../components/Dashboard/ContentHeader";
import { DashboardDataContext } from "../../../context/DashboardData";
import TransactionTabel from "../../../components/Dashboard/TransactionTabel";

export default function DashboardTransactions() {
  const data = useContext(DashboardDataContext);

  return (
    <Section
      title="تراکنش ها"
      description="سوابق مالی خود را از این بخش مشاهده کنید"
    >
      <Helmet title="داشبورد - تراکنش ها" />
      <ContentHeader title="همه سوابق مالی" />
      <TransactionTabel
        transactions={data.state.transactions}
        onSeeDetails={(transactionId) => {
          console.log(transactionId);
        }}
      />
    </Section>
  );
}
