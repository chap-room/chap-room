import styles from "./style.module.scss";
import { ReactNode } from "react";

interface SwitchProps {
  currentViewId: string;
  views: {
    id: string;
    content: ReactNode;
  }[];
}

export default function Switch({ currentViewId, views }: SwitchProps) {
  return (
    <div className={styles.Switch}>
      {views.map((view) => (
        <div
          key={view.id}
          className={currentViewId === view.id ? styles.Current : undefined}
        >
          {view.content}
        </div>
      ))}
    </div>
  );
}
