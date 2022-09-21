import styles from "./style.module.scss";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy.svg";
import IconButton from "../IconButton";

interface CopyableTextProps {
  text: string;
}

export default function CopyableText({ text }: CopyableTextProps) {
  return (
    <div className={styles.CopyableText}>
      <div className={styles.Text}>{text}</div>
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
