import styles from "./style.module.scss";
import UploadImage from "@/shared/assets/images/upload.svg";
import { useRef, useState } from "react";
import { formatList, formatNumber } from "@/shared/utils/format";
import { toast } from "react-hot-toast";

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

  function handleFileSelect(file: File) {
    if (file.size / 1024 / 1024 > maxSizeInMB) {
      toast.error("اندازه فایل بزرگتر از حداکثر مجاز است");
      return;
    }

    if (
      !([] as string[])
        .concat(...Object.values(acceptedTypes))
        .includes(file.type)
    ) {
      toast.error("نوع فایل مجاز نیست");
      return;
    }

    onSelectFile(file);
  }

  return (
    <div className={styles.UploadArea} data-drag-active={dragActive}>
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
          Array.from(input.files).forEach(handleFileSelect);
          input.value = "";
        }}
        multiple={multiple}
      />
      <button
        className={styles.DropZone}
        onClick={() => inputRef.current?.click()}
        onDragEnter={() => setDragActive(true)}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();

          const dataTransfer = event.dataTransfer;
          Array.from(dataTransfer.files).forEach(handleFileSelect);
          setDragActive(false);
        }}
      />
      <div className={styles.Image}>
        <UploadImage />
      </div>
      <div className={styles.Message}>
        فایل‌ها را اینجا بکشید و رها کنید یا بارگزاری کنید
      </div>
      <div className={styles.MobileMessage}>
        برای انتخاب فایل اینجا کلیک کنید
      </div>
      <div className={styles.Footer}>
        <div>فرمت مجاز: {formatList(Object.keys(acceptedTypes))}</div>
        <div>حداکثر هر فایل: {formatNumber(maxSizeInMB)} مگابایت</div>
      </div>
    </div>
  );
}
