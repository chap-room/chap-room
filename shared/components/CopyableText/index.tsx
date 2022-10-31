import styles from "./style.module.scss";
import { PropsWithChildren } from "react";
import CopyIcon from "@/shared/assets/icons/copy.svg";
import IconButton from "@/shared/components/IconButton";

interface CopyableTextProps {
  text: string;
}

export default function CopyableText({
  text,
  children,
}: PropsWithChildren<CopyableTextProps>) {
  return (
    <div className={styles.CopyableText}>
      <div className={styles.Content}>{children}</div>
      <div className={styles.Separator} />
      <div className={styles.CopyIcon}>
        <IconButton
          varient="none"
          size={34}
          onClick={() => {
            navigator.clipboard.writeText(text);
          }}
        >
          <CopyIcon />
        </IconButton>
      </div>
    </div>
  );
}
