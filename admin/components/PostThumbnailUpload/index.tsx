import styles from "./style.module.scss";
import { FormattedNumber } from "react-intl";
import { useEffect, useRef, useState } from "react";
import UploadImage from "@/shared/assets/images/upload.svg";
import ProgressBar from "@/shared/components/ProgressBar";
import CloseIcon from "@/shared/assets/icons/close.svg";
import IconButton from "@/shared/components/IconButton";
import toast from "react-hot-toast";
import { request, uploadBlogPostImage } from "@/admin/api";
import Button from "@/shared/components/Button";
import { useDataLoader } from "@/shared/components/DataLoader";

interface PostThumbnailUploadProps {
  value: string | null;
  onChange: (newValue: string | null) => void;
}

export default function PostThumbnailUpload({
  value,
  onChange,
}: PostThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const [inUploadFile, setInUploadFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const abortControllerRef = useRef<AbortController>();
  useDataLoader({
    load: () => {
      if (inUploadFile) {
        const request = uploadBlogPostImage(inUploadFile, setProgress);
        request[0].finally(() => {
          setInUploadFile(null);
          setProgress(0);
        });
        abortControllerRef.current = request[1];
        return request;
      }
    },
    deps: [inUploadFile],
    setData: ({ message, url }) => {
      toast.success(message);
      onChange(url);
    },
  });

  return (
    <div className={styles.Container}>
      {value === null && inUploadFile === null && (
        <div className={styles.ImageSelect} data-drag-active={dragActive}>
          <input
            ref={inputRef}
            type="file"
            className={styles.Input}
            accept="image/*"
            onChange={() => {
              const input = inputRef.current;
              if (!input || !input.files || !input.files[0]) return;
              setInUploadFile(input.files[0]);
              input.value = "";
            }}
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
              setInUploadFile(dataTransfer.files[0]);
              setDragActive(false);
            }}
          />
          <div className={styles.Image}>
            <UploadImage />
          </div>
          <div className={styles.Message}>
            تصویر را اینجا بکشید و رها کنید یا <span>بارگزاری</span> کنید
          </div>
        </div>
      )}
      {inUploadFile !== null && (
        <div className={styles.ImageUpload}>
          <div>
            <div>{inUploadFile.name}</div>
            <div className={styles.CencelIcon}>
              <IconButton
                size={36}
                onClick={() => abortControllerRef.current?.abort()}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div>
            <FormattedNumber value={progress} style="percent" />
            <ProgressBar progress={progress} />
          </div>
        </div>
      )}
      {value !== null && (
        <div className={styles.ImagePreview}>
          <img src={value} />
          <Button varient="filled" onClick={() => onChange(null)}>
            حذف
          </Button>
        </div>
      )}
    </div>
  );
}
