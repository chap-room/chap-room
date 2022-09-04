import { ReactNode } from "react";
import styles from "./style.module.scss";

interface FormTableProps {
  fields: {
    key: string;
    label: string;
    component: ReactNode;
  }[];
}

export default function FormTable({ fields }: FormTableProps) {
  return (
    <table className={styles.FormTable}>
      <tbody>
        {fields.map((field) => (
          <tr key={field.key}>
            <td>{field.label}</td>
            <td>{field.component}</td>
          </tr>
        ))}
      </tbody>
    </table>  
  );
}
