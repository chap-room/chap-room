import styles from "./style.module.scss";
import { PropsWithChildren } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "@/shared/assets/icons/copy.svg";
import IconButton from "@/shared/components/IconButton";

interface CopyableTextProps {
  text: string;
  varient?: "outlined" | "shadow";
}

export default function CopyableText({
  text,
  children,
  varient = "outlined",
}: PropsWithChildren<CopyableTextProps>) {
  const className = [styles.CopyableText];
  switch (varient) {
    case "outlined":
      className.push(styles.Outlined);
      break;
    case "shadow":
      className.push(styles.Shadow);
      break;
  }

  return (
    <div className={className.join(" ")}>
      <div className={styles.CopyIcon}>
        <CopyToClipboard text={text}>
          <IconButton varient="none" size={34}>
            <CopyIcon />
          </IconButton>
        </CopyToClipboard>
      </div>
      <div className={styles.Separator} />
      <div className={styles.Content}>{children}</div>
    </div>
  );
}
