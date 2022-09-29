import styles from "./style.module.scss";
import { PropsWithChildren, useId } from "react";
import {
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react-dom-interactions";
import { ReactComponent as CloseIcon } from "@chap-room/shared/assets/icons/close.svg";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export default function Dialog({
  open,
  onClose,
  title,
  children,
}: PropsWithChildren<DialogProps>) {
  const { floating, context } = useFloating({
    open,
    onOpenChange: (open) => {
      if (!open) onClose()
    }
  });

  const id = useId();
  const labelId = `${id}-label`;

  const { getFloatingProps } = useInteractions([
    useRole(context),
    useDismiss(context)
  ]);

  return (
    <FloatingPortal>
      {open && (
        <div className={styles.Container}>
          <FloatingFocusManager context={context}>
            <div
              className={styles.Dialog}
              ref={floating}
              aria-labelledby={labelId}
              {...getFloatingProps()}
            >
              {title && (
                <div className={styles.Header}>
                  <div className={styles.Start} />
                  <div className={styles.Center}>
                    <div className={styles.Title} id={labelId}>
                      {title}
                    </div>
                  </div>
                  <div className={styles.End}>
                    <button
                      className={styles.CloseButton}
                      onClick={() => onClose()}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              )}
              <div className={styles.Content}>{children}</div>
            </div>
          </FloatingFocusManager>
        </div>
      )}
    </FloatingPortal>
  );
}
