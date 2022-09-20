import styles from "./style.module.scss";
import { ReactComponent as CheckIcon } from "../../assets/icons/check.svg";

interface CheckBoxProps {
  checked: boolean;
  onChange: (newValue: boolean) => void;
}

export default function CheckBox({ checked, onChange }: CheckBoxProps) {
  return (
    <div
      data-checked={checked}
      className={styles.CheckBox}
      onClick={() => onChange(!checked)}
    >
      <CheckIcon />
    </div>
  );
}
