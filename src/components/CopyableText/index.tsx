import styles from "./style.module.scss";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy.svg";

interface CopyableTextProps {
  text: string;
}

export default function CopyableText({ text }: CopyableTextProps) {
  return (
    <div className={styles.CopyableText}>
      <div className={styles.Text}>{text}</div>
      <div className={styles.Separator} />
      <CopyIcon
        className={styles.CopyIcon}
        onClick={() => {
          navigator.clipboard.writeText(text);
        }}
      />
    </div>
  );
}
