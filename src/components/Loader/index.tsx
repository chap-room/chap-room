import styles from "./style.module.scss";
import { ReactComponent as LoaderImage } from "../../assets/images/loader.svg";

export default function Loader() {
  return (
    <div className={styles.Loader}>
      <LoaderImage />
    </div>
  );
}
