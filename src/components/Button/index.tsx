import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./style.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  varient?: "filled" | "outlined";
}

const Button = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(({ varient = "outlined", children, ...props }: ButtonProps, ref) => {
  const className = [
    styles.Button,
    varient === "outlined" ? styles.Outlined : styles.Filled,
  ];
  if (props.className) {
    className.push(props.className);
  }

  return (
    <button ref={ref} {...props} className={className.join(" ")}>
      {children}
    </button>
  );
});

export default Button;
