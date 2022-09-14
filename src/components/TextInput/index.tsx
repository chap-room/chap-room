import React, { InputHTMLAttributes } from "react";
import styles from "./style.module.scss";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onTextChange?: (newValue: string) => void;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ onTextChange, ...props }: TextInputProps, ref) => (
    <div className={styles.InputBox}>
      <input
        ref={ref}
        {...props}
        onChange={(event) => {
          onTextChange && onTextChange(event.target.value);
          if (typeof props?.onChange === "function") {
            return props.onChange.apply(this, [event]);
          }
        }}
      />
    </div>
  )
);

export default TextInput;
