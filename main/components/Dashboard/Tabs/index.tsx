import styles from "./style.module.scss";
import { ReactNode, useState } from "react";
import Switch from "@/shared/components/Switch";

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: ReactNode;
  }[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [currentTabId, setCurrentTabId] = useState(tabs[0]?.id || "");

  return (
    <>
      <div className={styles.Tabs}>
        {tabs.map((tab) => (
          <button
            className={tab.id === currentTabId ? styles.Current : undefined}
            onClick={() => setCurrentTabId(tab.id)}
            key={tab.id}
            disabled={tab.id === currentTabId}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <Switch
        currentViewId={currentTabId}
        views={tabs.map(({ id, content }) => ({
          id,
          content,
        }))}
      />
    </>
  );
}
