import styles from "./style.module.scss";
import { ReactComponent as CheckIcon } from "@chap-room/shared/assets/icons/check.svg";

interface CheckBoxProps {
  checked: boolean;
  onChange: (newValue: boolean) => void;
}

export default function CheckBox({ checked, onChange }: CheckBoxProps) {
  return (
    <button
      data-checked={checked}
      className={styles.CheckBox}
      onClick={() => onChange(!checked)}
    >
      <CheckIcon />
    </button>
  );
}
