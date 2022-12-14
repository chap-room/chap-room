import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./style.module.scss";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  varient?: "filled" | "outlined" | "none";
  size?: number;
  onClick?: () => void;
  loading?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { varient = "none", size = 54, loading = false, ...props }: IconButtonProps,
    ref
  ) => {
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
    if (loading) {
      className.push(styles.Loading);
    }

    return (
      <button
        className={className.join(" ")}
        {...props}
        style={{ width: size, height: size, ...props.style }}
        ref={ref}
      >
        {props.children}
      </button>
    );
  }
);

export default IconButton;
