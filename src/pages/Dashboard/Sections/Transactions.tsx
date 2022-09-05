import Section from "../../../components/Dashboard/Section";
import ContentHeader from "../../../components/Dashboard/ContentHeader";
import { useContext } from "react";
import { DataContext } from "../../../dataContext";
import TransactionTabel from "../../../components/Dashboard/TransactionTabel";

export default function DashboardTransactions() {
  const data = useContext(DataContext);

  return (
    <Section
      title="تراکنش ها"
      description="سوابق مالی خود را از این بخش مشاهده کنید"
    >
      <ContentHeader title="همه سوابق مالی" />
      <TransactionTabel
        transactions={data.transactions}
        onSeeDetails={(transactionId) => {
          console.log(transactionId);
        }}
      />
    </Section>
  );
}
