import toast from "react-hot-toast";
import { newPrintFolder } from "@/main/api";
import PrintFolderForm from "@/main/components/Dashboard/PrintFolderForm";

interface NewPrintFolderStageProps {
  index: number;
  actions: {
    finish: () => void;
  };
}

export default function NewPrintFolderStage({
  index,
  actions,
}: NewPrintFolderStageProps) {
  return (
    <PrintFolderForm
      index={index}
      onCancel={actions.finish}
      onFinish={(printFolderData) =>
        newPrintFolder(printFolderData)
          .then((message) => {
            toast.success(message);
            actions.finish();
          })
          .catch(toast.error)
      }
    />
  );
}
