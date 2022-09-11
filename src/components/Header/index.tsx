import styles from "./style.module.scss";
import { ReactComponent as LogoWithName } from "../../assets/images/logoWithName.svg";

interface HeaderProps {
  showNavMenu?: boolean;
}

export default function Header({ showNavMenu = false }: HeaderProps) {
  return (
    <div className={styles.Header}>
      <div className={styles.Logo}>
        <LogoWithName />
      </div>
    </div>
  );
}
