import { useId } from "@floating-ui/react-dom-interactions";
import styles from "./style.module.scss";

interface RadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChecked: () => void;
}

export default function Radio({ name, value, checked, onChecked }: RadioProps) {
  const id = useId();

  return (
    <>
      <input
        id={id}
        className={styles.Input}
        name={name}
        value={value}
        type="radio"
        checked={checked}
        onChange={(event) => event.target.checked && onChecked()}
      />
      <label htmlFor={id} className={styles.Radio} />
    </>
  );
}
