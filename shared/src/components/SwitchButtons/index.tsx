import { ReactNode } from "react";
import styles from "./style.module.scss";

type SwitchButtonsProps =
  | {
      nullable?: undefined;
      options: Record<string, ReactNode>;
      value: string;
      onChange: (newValue: string) => void;
    }
  | {
      nullable: true;
      options: Record<string, ReactNode>;
      value: string | null;
      onChange: (newValue: string | null) => void;
    };

export default function SwitchButtons({
  nullable,
  options,
  value,
  onChange,
}: SwitchButtonsProps) {
  return (
    <div className={styles.SwitchButtons}>
      {Object.entries(options).map(([optionValue, optionLabel]) => (
        <button
          key={optionValue}
          className={value === optionValue ? styles.Current : undefined}
          onClick={() => {
            if (nullable && value === optionValue) {
              onChange(null);
              return;
            }

            onChange(optionValue);
          }}
        >
          {optionLabel}
        </button>
      ))}
    </div>
  );
}
