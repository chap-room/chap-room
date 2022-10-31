import React, { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./style.module.scss";

interface TextInputProps {
  prefix?: ReactNode;
  value?: string;
  suffix?: ReactNode;
  onChange?: (newValue: string) => void;
  boxProps?: InputHTMLAttributes<HTMLDivElement>;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  inputRef?: Ref<HTMLInputElement>;
  readOnly?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      prefix,
      value,
      suffix,
      onChange,
      boxProps,
      inputProps,
      inputRef,
      readOnly = false,
    }: TextInputProps,
    ref
  ) => (
    <div
      ref={ref}
      className={
        readOnly ? styles.ReadOnly + " " + styles.InputBox : styles.InputBox
      }
      {...boxProps}
    >
      {prefix}
      <input
        ref={inputRef}
        {...inputProps}
        readOnly={readOnly}
        value={
          value !== undefined
            ? value
            : inputProps
            ? inputProps.value
            : undefined
        }
        onChange={(event) => {
          onChange && onChange(event.target.value);
          if (typeof inputProps?.onChange === "function") {
            return inputProps.onChange.apply(this, [event]);
          }
        }}
      />
      {suffix}
    </div>
  )
);

export default TextInput;
