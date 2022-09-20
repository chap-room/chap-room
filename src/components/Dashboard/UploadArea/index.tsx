import styles from "./style.module.scss";
import { ReactComponent as UploadImage } from "../../../assets/images/upload.svg";
import { FormattedList, FormattedNumber } from "react-intl";
import { useRef, useState } from "react";

interface UploadAreaProps {
  onSelectFile: (file: File) => void;
  // key is display name and value is A valid case-insensitive filename extension,
  // starting with a period (".") character. For example: .jpg, .pdf, or .doc.
  // Or a valid MIME type string, with no extensions.
  acceptedTypes: Record<string, string[]>;
  maxSizeInMB: number;
  multiple?: boolean;
}

export default function UploadArea({
  onSelectFile,
  acceptedTypes,
  maxSizeInMB,
  multiple,
}: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = useState(false);

  return (
    <div
      className={styles.UploadArea}
      data-drag-active={dragActive}
      onClick={() => inputRef.current?.click()}
      onDragEnter={() => {
        setDragActive(true);
      }}
      onDragLeave={() => {
        setDragActive(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();

        const dataTransfer = event.dataTransfer;
        Array.from(dataTransfer.files).forEach(onSelectFile);
        setDragActive(false);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className={styles.Input}
        accept={Object.values(acceptedTypes)
          .map((types) => types.join(","))
          .join(",")}
        onChange={() => {
          const input = inputRef.current;
          if (!input || !input.files) return;
          Array.from(input.files).forEach(onSelectFile);
        }}
        multiple={multiple}
      />
      <div className={styles.Image}>
        <UploadImage />
      </div>
      <div className={styles.Message}>
        فایل‌ها را اینجا بکشید و رها کنید یا بارگزاری کنید
      </div>
      <div className={styles.Footer}>
        <div>
          فرمت مجاز: <FormattedList value={Object.keys(acceptedTypes)} />
        </div>
        <div>
          حداکثر هر فایل: <FormattedNumber value={maxSizeInMB} /> مگابایت
        </div>
      </div>
    </div>
  );
}
