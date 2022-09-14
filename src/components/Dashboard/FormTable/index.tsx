import { ReactNode } from "react";
import styles from "./style.module.scss";

interface FormTableProps {
  fullWidth?: boolean;
  fields: {
    key: string;
    label: string;
    component: ReactNode;
  }[];
}

export default function FormTable({ fullWidth, fields }: FormTableProps) {
  return (
    <table className={styles.FormTable} data-full-width={fullWidth}>
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
