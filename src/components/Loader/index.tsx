import styles from "./style.module.scss";
import { ReactComponent as LoaderImage } from "../../assets/images/loader.svg";

interface LoaderProps {}

export default function Loader({}: LoaderProps) {
  return (
    <div className={styles.Loader}>
      <LoaderImage />
    </div>
  );
}
