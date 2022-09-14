import styles from "./style.module.scss";
import { ReactComponent as Loader } from "../../assets/images/loader.svg";

export default function SuspensePage() {
  return (
    <div className={styles.Container}>
      <Loader />
    </div>
  );
}
