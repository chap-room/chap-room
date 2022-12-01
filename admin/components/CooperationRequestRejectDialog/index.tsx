import styles from "./style.module.scss";
import { useState } from "react";
import Dialog from "@/shared/components/Dialog";
import TextArea from "@/shared/components/TextArea";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";

interface CooperationRequestRejectDialogData {
  description: string;
}

interface CooperationRequestRejectDialogProps {
  onClose: () => void;
  defaultValues?: Partial<CooperationRequestRejectDialogData>;
  onRejectCooperationRequest: (
    data: CooperationRequestRejectDialogData
  ) => Promise<any>;
}

export default function CooperationRequestRejectDialog({
  onClose,
  defaultValues,
  onRejectCooperationRequest,
}: CooperationRequestRejectDialogProps) {
  const [description, setDescription] = useState(
    defaultValues?.description || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog title="رد کردن درخواست ها همکاری" open={true} onClose={onClose}>
      <div className={styles.DialogContent}>
        <TextArea
          placeholder="توضیحات"
          value={description}
          onTextChange={setDescription}
          rows={5}
        />
      </div>
      <BottomActions>
        <Button
          varient="filled"
          onClick={() => {
            setIsSubmitting(true);
            onRejectCooperationRequest({
              description,
            }).finally(() => setIsSubmitting(false));
          }}
          style={{ minWidth: 100 }}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          رد کردن
        </Button>
      </BottomActions>
    </Dialog>
  );
}
