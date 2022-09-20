import { PrintFolder } from "../../../types";
import styles from "./style.module.scss";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { ReactComponent as DeletetIcon } from "../../../assets/icons/delete.svg";

interface PrintFolderListProps {
  printFolders: PrintFolder[];
  onEditPrintFolder: (printFolderIndex: number) => void;
  onDeletePrintFolder: (printFolderIndex: number) => void;
}

export default function PrintFolderList({
  printFolders,
  onEditPrintFolder,
  onDeletePrintFolder,
}: PrintFolderListProps) {
  return (
    <div className={styles.PrintFolderList}>
      {printFolders.map((printFolder, index) => (
        <div className={styles.PrintFolder} key={index}>
          <div className={styles.Header}>
            <div className={styles.Label}>پوشه {index + 1}</div>
            <div className={styles.Actions}>
              <button
                className={styles.EditButton}
                onClick={() => onEditPrintFolder(index)}
              >
                <EditIcon />
              </button>
              <button
                className={styles.DeleteButton}
                onClick={() => onDeletePrintFolder(index)}
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
            خلاصه سفارش : {printFolder.printColors} /{" "}
            {printFolder.printPaperSize} / {printFolder.printType}
          </div>
          {printFolder.description && (
            <div>توضیحات: {printFolder.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
