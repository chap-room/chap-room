import { ReactNode } from "react";
import styles from "./style.module.scss";

interface Action {
  key: string;
  label: string | ReactNode;
  variant: "filled" | "none";
  onClick: () => void;
}

interface ContentHeaderProps {
  title: string;
  actions?: Action[];
}

export default function ContentHeader({ title, actions }: ContentHeaderProps) {
  return (
    <div className={styles.ContentHeader}>
      <p className={styles.Title}>{title}</p>
      <div className={styles.Spacer} />
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
    </div>
  );
}
