import styles from "./style.module.scss";
import { useState } from "react";
import Dialog from "@/shared/components/Dialog";
import TextArea from "@/shared/components/TextArea";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";

interface CooperationRequestAcceptData {
  description: string;
}

interface CooperationRequestAcceptDialogProps {
  onClose: () => void;
  defaultValues?: Partial<CooperationRequestAcceptData>;
  onAcceptCooperationRequest: (
    data: CooperationRequestAcceptData
  ) => Promise<any>;
}

export default function CooperationRequestAcceptDialog({
  onClose,
  defaultValues,
  onAcceptCooperationRequest,
}: CooperationRequestAcceptDialogProps) {
  const [description, setDescription] = useState(
    defaultValues?.description || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog title="قبول کردن درخواست ها همکاری" open={true} onClose={onClose}>
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
            onAcceptCooperationRequest({
              description,
            }).finally(() => setIsSubmitting(false));
          }}
          style={{ minWidth: 100 }}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          قبول کردن
        </Button>
      </BottomActions>
    </Dialog>
  );
}
