import styles from "./style.module.scss";
import { ReactComponent as CheckIcon } from "../../assets/icons/check.svg";
import { useId } from "react";

interface CheckBoxProps {
  checked: boolean;
  onChange: (newValue: boolean) => void;
}

export default function CheckBox({ checked, onChange }: CheckBoxProps) {
  const id = useId();

  return (
    <>
      <input
        className={styles.Input}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id} className={styles.CheckBox}>
        <CheckIcon />
      </label>
    </>
  );
}
