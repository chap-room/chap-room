import { useId } from "@floating-ui/react-dom-interactions";
import styles from "./style.module.scss";

interface RadioProps {
  name: string;
  checked: boolean;
  onChange: (newValue: boolean) => void;
}

export default function Radio({ name, checked, onChange }: RadioProps) {
  const id = useId();

  return (
    <>
      <input
        className={styles.Input}
        name={name}
        id={id}
        type="radio"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id} className={styles.Radio} />
    </>
  );
}
