import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./style.module.scss";

interface FilledIconContainer extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export default function FilledIconContainer({
  size = 34,
  children,
  ...props
}: PropsWithChildren<FilledIconContainer>) {
  return (
    <div
      {...props}
      className={[styles.FilledIconContainer, props.className].join(" ")}
      style={{ width: size, height: size, ...props.style }}
    >
      {children}
    </div>
  );
}
