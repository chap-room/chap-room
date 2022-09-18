import styles from "./style.module.scss";
import Loader from "../Loader";

export default function SuspenseLoader() {
  return (
    <div className={styles.SuspenseLoader}>
      <Loader />
    </div>
  );
}
