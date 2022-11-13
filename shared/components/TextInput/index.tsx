import React, { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./style.module.scss";

interface TextInputProps {
  prefix?: ReactNode;
  value?: string;
  suffix?: ReactNode;
  onChange?: (newValue: string) => void;
  varient?: "outlined" | "shadow" | "shadow-without-bg";
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
      varient = "outlined",
      boxProps,
      inputProps,
      inputRef,
      readOnly = false,
    }: TextInputProps,
    ref
  ) => {
    const className = [styles.InputBox];
    switch (varient) {
      case "outlined":
        className.push(styles.Outlined);
        break;
      case "shadow":
        className.push(styles.Shadow);
        break;
      case "shadow-without-bg":
        className.push(styles.ShadowWithoutBg);
        break;
    }
    if (readOnly) {
      className.push(styles.ReadOnly);
    }
    if (boxProps?.className) {
      className.push(boxProps.className);
    }

    return (
      <div ref={ref} className={className.join(" ")} {...boxProps}>
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
    );
  }
);

export default TextInput;
