import styles from "./style.module.scss";
import { ReactNode, useState } from "react";

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
        {tabs.map((tab) =>
          tab.id === currentTabId ? (
            <div className={styles.Current} key={tab.id}>
              {tab.label}
            </div>
          ) : (
            <button onClick={() => setCurrentTabId(tab.id)} key={tab.id}>
              {tab.label}
            </button>
          )
        )}
      </div>
      {tabs.filter((tab) => tab.id === currentTabId)[0]?.content}
    </>
  );
}
