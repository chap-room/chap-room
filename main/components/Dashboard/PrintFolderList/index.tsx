import styles from "./style.module.scss";
import { FormattedNumber } from "react-intl";
import { PrintFolder } from "@/shared/types";
import EditIcon from "@/shared/assets/icons/edit.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";

interface PrintFolderListProps {
  printFolders: PrintFolder[];
  onEditPrintFolder: (printFolderId: number) => void;
  onDeletePrintFolder: (printFolderId: number) => void;
}

export default function PrintFolderList({
  printFolders,
  onEditPrintFolder,
  onDeletePrintFolder,
}: PrintFolderListProps) {
  return (
    <div className={styles.PrintFolderList}>
      {printFolders.map((printFolder, index) => (
        <div className={styles.PrintFolder} key={printFolder.id}>
          <div className={styles.Header}>
            <div className={styles.Label}>
              <span>پوشه {index + 1}</span>
              <span>
                (<FormattedNumber value={printFolder.amount} /> تومان)
              </span>
            </div>
            <div className={styles.Actions}>
              <button
                className={styles.EditButton}
                onClick={() => onEditPrintFolder(printFolder.id)}
              >
                <EditIcon />
              </button>
              <button
                className={styles.DeleteButton}
                onClick={() => onDeletePrintFolder(printFolder.id)}
              >
                <DeletetIcon />
              </button>
            </div>
          </div>
          <div>
            فایلها:{" "}
            {printFolder.printFiles
              .map((printFile) => printFile.name)
              .join(" / ")}
          </div>
          <div>
            خلاصه: {printFolder.printColor} / {printFolder.printSize} /{" "}
            {printFolder.printSide}
          </div>
          {printFolder.description && (
            <div>توضیحات: {printFolder.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
