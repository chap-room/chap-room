import styles from "./style.module.scss";

interface TransactionListProps {
  title: string;
}

export default function TransactionList({ title }: TransactionListProps) {
  return (
    <div className={styles.ContentHeader}>
    </div>
  );
}
