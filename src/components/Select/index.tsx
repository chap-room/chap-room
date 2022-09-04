import styles from "./style.module.scss";
import { ReactComponent as ExpandMoreIcon } from "../../assets/svg/expandMore.svg";

interface SelectProps {
  options: Record<string, string>;
  placeholder?: string;
  value?: string;
  onChange?: (newValue: string) => void;
}

export default function Select({
  options,
  placeholder,
  value,
  onChange,
}: SelectProps) {
  return (
    <div className={styles.Select}>
      <span>{options[value || ""] || placeholder}</span>
      <div className={styles.Spacer} />
      <ExpandMoreIcon className={styles.ExpandMore} />
    </div>
  );
}
