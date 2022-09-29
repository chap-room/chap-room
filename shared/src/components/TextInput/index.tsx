import React, { InputHTMLAttributes, Ref } from "react";
import styles from "./style.module.scss";

interface TextInputProps {
  prefix?: string;
  value?: string;
  suffix?: string;
  onChange?: (newValue: string) => void;
  boxProps?: InputHTMLAttributes<HTMLDivElement>;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  inputRef?: Ref<HTMLInputElement>;
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
    }: TextInputProps,
    ref
  ) => (
    <div
      ref={ref}
      className={
        inputProps?.readOnly
          ? styles.ReadOnly + " " + styles.InputBox
          : styles.InputBox
      }
    >
      {prefix}
      <input
        ref={inputRef}
        {...inputProps}
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
