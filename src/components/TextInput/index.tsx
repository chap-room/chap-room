import React, { InputHTMLAttributes } from "react";
import styles from "./style.module.scss";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  suffix?: string;
  onTextChange?: (newValue: string) => void;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ prefix, suffix, onTextChange, ...props }: TextInputProps, ref) => (
    <div className={styles.InputBox} dir={props.dir}>
      {prefix}
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
      {suffix}
    </div>
  )
);

export default TextInput;
