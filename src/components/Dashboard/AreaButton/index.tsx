import styles from "./style.module.scss";

interface AreaButtonProps {
  title: string;
  description: string;
  onClick: () => void;
}

export default function AreaButton({
  title,
  description,
  onClick,
}: AreaButtonProps) {
  return (
    <div className={styles.AreaButton} onClick={() => onClick()}>
      <div className={styles.Title}>{title}</div>
      <div className={styles.Description}>{description}</div>
    </div>
  );
}
