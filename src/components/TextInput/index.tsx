import React, { InputHTMLAttributes } from "react";
import styles from "./style.module.scss";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onTextChange?: (newValue: string) => void;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ onTextChange, ...props }: TextInputProps, ref) => (
    <input
      ref={ref}
      {...props}
      className={
        props.className ? props.className + " " + styles.Input : styles.Input
      }
      onChange={(event) => {
        onTextChange && onTextChange(event.target.value);
        if (typeof props?.onChange === "function") {
          return props.onChange.apply(this, [event]);
        }
      }}
    />
  )
);

export default TextInput;
