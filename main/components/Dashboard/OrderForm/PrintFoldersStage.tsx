import styles from "./style.module.scss";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { PrintFolder } from "@/shared/types";
import { deletePrintFolder, getPrintFolders } from "@/main/api";
import DataLoader from "@/shared/components/DataLoader";
import PrintFolderList from "@/main/components/Dashboard/PrintFolderList";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";

interface PrintFoldersStageProps {
  data: PrintFolder[];
  setData: (newValue: PrintFolder[]) => void;
  actions: {
    new: () => void;
    edit: (printFolderId: number) => void;
    finish: () => void;
  };
}

export default function PrintFoldersStage({
  data,
  setData,
  actions,
}: PrintFoldersStageProps) {
  const [pendingPrintFolderDeleteRequest, setPendingPrintFolderDeleteRequest] =
    useState<number | null>(null);

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <DataLoader
      load={() => getPrintFolders()}
      reloadRef={reloadRef}
      setData={setData}
    >
      <div className={styles.PrintFolder}>
        <PrintFolderList
          printFolders={data}
          onEditPrintFolder={actions.edit}
          onDeletePrintFolder={setPendingPrintFolderDeleteRequest}
        />
        <WarningConfirmDialog
          open={pendingPrintFolderDeleteRequest !== null}
          onClose={() => {
            setPendingPrintFolderDeleteRequest(null);
          }}
          onConfirm={() =>
            deletePrintFolder(pendingPrintFolderDeleteRequest!)
              .then((message) => {
                toast.success(message);
                setPendingPrintFolderDeleteRequest(null);
                if (reloadRef.current) reloadRef.current();
              })
              .catch(toast.error)
          }
          message="از حذف این پوشه مطمئن هستید؟"
          confirmButtonText="حذف"
        />
        <button
          className={styles.NewFolderButton}
          onClick={() => actions.new()}
        >
          <div className={styles.Title}>افزودن پوشه +</div>
          <div className={styles.Description}>
            در هر پوشه فایلهایی که مشخصات چاپ یکسانی دارند را آپلود کنید
          </div>
        </button>
      </div>
      <div className={styles.BottomActionsContainer}>
        <BottomActions>
          <div />
          <Button
            varient="filled"
            style={{ minWidth: 110 }}
            onClick={actions.finish}
            disabled={data.length === 0}
          >
            بعدی
          </Button>
        </BottomActions>
      </div>
    </DataLoader>
  );
}
