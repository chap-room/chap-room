import styles from "./style.module.scss";
import { PropsWithChildren, useEffect, useRef } from "react";
import { ReactComponent as CloseIcon } from "../../assets/svg/close.svg";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

export default function Dialog({
  open,
  onClose,
  title,
  children,
}: PropsWithChildren<DialogProps>) {
  const dialogWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = function (event: MouseEvent) {
      if (event.target === dialogWrapperRef.current) {
        onClose();
      }
    };

    window.addEventListener("click", listener);

    return () => {
      window.removeEventListener("click", listener);
    };
  }, [onClose]);

  return (
    <div
      className={
        open ? styles.Container : styles.Container + " " + styles.Close
      }
      ref={dialogWrapperRef}
    >
      <div className={styles.Dialog}>
        <div className={styles.Header}>
          <div className={styles.Start} />
          <div className={styles.Center}>
            <div className={styles.Title}>{title}</div>
          </div>
          <div className={styles.End}>
            <button className={styles.CloseButton} onClick={() => onClose()}>
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className={styles.Content}>{children}</div>
      </div>
    </div>
  );
}
