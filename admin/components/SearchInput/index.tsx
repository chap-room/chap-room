import styles from "./style.module.scss";
import React, { ForwardedRef, InputHTMLAttributes } from "react";
import SearchIcon from "@/admin/assets/icons/search.svg";
import TextInput from "@/shared/components/TextInput";

interface SearchInputProps {
  value: string;
  setValue: (newValue: string) => void;
  boxProps?: InputHTMLAttributes<HTMLDivElement>;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  inputRef?: ForwardedRef<HTMLInputElement>;
}

const SearchInput = React.forwardRef<HTMLDivElement, SearchInputProps>(
  ({ value, setValue, boxProps, inputRef, inputProps }, ref) => (
    <div className={styles.Input}>
      <TextInput
        ref={ref}
        varient="outlined"
        value={value}
        onChange={setValue}
        inputProps={inputProps}
        inputRef={inputRef}
        suffix={
          <div className={styles.Icon}>
            <SearchIcon />
          </div>
        }
        boxProps={{
          ...(boxProps || {}),
          style: {
            paddingLeft: 10,
            ...(boxProps?.style || {}),
          },
        }}
      />
    </div>
  )
);

export default SearchInput;
