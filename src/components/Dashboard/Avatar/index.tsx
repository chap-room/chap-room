import styles from "./style.module.scss";
import { useContext } from "react";
import { DashboardDataContext } from "../../../context/DashboardData";
import { ReactComponent as DefaultAvatar } from "../../../assets/images/avatar.svg";

export default function Avatar() {
  const data = useContext(DashboardDataContext);

  return (
    <div className={styles.Avatar}>
      {data.state.currentUser.avatar ? (
        <img src={data.state.currentUser.avatar} alt="User Avatar" />
      ) : (
        <div className={styles.DefaultAvatar}>
          <DefaultAvatar />
        </div>
      )}
    </div>
  );
}
