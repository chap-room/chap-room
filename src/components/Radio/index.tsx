import styles from "./style.module.scss";

interface RadioProps {
  checked: boolean;
  onChecked: () => void;
}

export default function Radio({ checked, onChecked }: RadioProps) {
  return (
    <div
      data-checked={checked}
      className={styles.Radio}
      onClick={() => !checked && onChecked()}
    />
  );
}
