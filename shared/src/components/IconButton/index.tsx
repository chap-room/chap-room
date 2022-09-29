import { PropsWithChildren } from "react";
import styles from "./style.module.scss";

interface IconButtonProps {
  varient?: "filled" | "outlined" | "none";
  size?: number;
  onClick?: () => void;
}

export default function IconButton({
  varient = "none",
  size = 54,
  onClick,
  children,
}: PropsWithChildren<IconButtonProps>) {
  const className = [styles.IconButton];
  switch (varient) {
    case "outlined":
      className.push(styles.Outlined);
      break;
    case "filled":
      className.push(styles.Filled);
      break;
    case "none":
      className.push(styles.None);
      break;
  }

  return (
    <button
      className={className.join(" ")}
      style={{ width: size, height: size }}
      onClick={() => onClick && onClick()}
    >
      {children}
    </button>
  );
}
