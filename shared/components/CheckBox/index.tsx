import styles from "./style.module.scss";
import CheckIcon from "@/shared/assets/icons/check.svg";

interface CheckBoxProps {
  checked: boolean;
  readonly?: boolean;
  onChange: (newValue: boolean) => void;
}

export default function CheckBox({ checked, readonly, onChange }: CheckBoxProps) {
  return (
    <button
      data-checked={checked}
      className={styles.CheckBox}
      disabled={readonly}
      onClick={() => onChange(!checked)}
    >
      <CheckIcon />
    </button>
  );
}
