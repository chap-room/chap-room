import { ReactNode } from "react";
import styles from "./style.module.scss";

interface Action {
  key: string;
  label: string | ReactNode;
  variant: "filled" | "none";
  onClick: () => void;
}

interface ContentHeaderProps {
  actions: Action[];
}

export default function BottomActions({ actions }: ContentHeaderProps) {
  return (
    <>
      {actions && (
        <div className={styles.Actions}>
          {actions.map(({ key, label, variant, onClick }) => (
            <div
              className={
                variant === "filled" ? styles.ActionFilled : styles.Action
              }
              onClick={onClick}
              key={key}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
