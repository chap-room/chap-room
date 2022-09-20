import { useId } from "@floating-ui/react-dom-interactions";
import Radio from "../Radio";
import styles from "./style.module.scss";

interface RadioListProps {
  options: Record<string, string>;
  value: string;
  onChange: (newValue: string) => void;
}

export default function RadioList({
  options,
  value,
  onChange,
}: RadioListProps) {
  return (
    <div className={styles.RadioList}>
      {Object.entries(options).map(([optionValue, optionLabel]) => (
        <div className={styles.RadioWithLabel}>
          <Radio
            checked={value === optionValue}
            onChecked={() => onChange(optionValue)}
          />
          {optionLabel}
        </div>
      ))}
    </div>
  );
}
