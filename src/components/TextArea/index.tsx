import React, { PropsWithChildren, TextareaHTMLAttributes } from "react";
import styles from "./style.module.scss";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onTextChange?: (newValue: string) => void;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, PropsWithChildren<TextAreaProps>>(
  ({ onTextChange, ...props }: TextAreaProps, ref) => (
    <textarea
      ref={ref}
      {...props}
      className={
        props.className ? props.className + " " + styles.TextArea : styles.TextArea
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

export default TextArea;
