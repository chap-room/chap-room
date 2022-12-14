import styles from "./style.module.scss";
import { PrintFolder } from "@/shared/types";
import { formatNumber } from "@/shared/utils/format";
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
              <span>({formatNumber(printFolder.amount)} تومان)</span>
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
            <div className={styles.Label}>فایلها:</div>
            <div className={styles.Content}>
              {printFolder.filesManuallySent
                ? "از طریق تلگرام و ایتا"
                : printFolder.printFiles
                    .map((printFile) => printFile.name)
                    .join(" / ")}
            </div>
            <div className={styles.Label}>خلاصه سفارش:</div>
            <div className={styles.Content}>
              {[
                {
                  blackAndWhite: "سیاه و سفید",
                  normalColor: "رنگی معمولی",
                  fullColor: "تمام رنگی",
                }[printFolder.printColor],
                { a4: "A4", a5: "A5", a3: "A3" }[printFolder.printSize],
                {
                  singleSided: "یک رو",
                  doubleSided: "دو رو",
                  singleSidedGlossy: "یک رو گلاسه",
                  doubleSidedGlossy: "دو رو گلاسه",
                }[printFolder.printSide],
                `${formatNumber(printFolder.countOfPapers)} برگ`,
                ...(printFolder.bindingOptions === null
                  ? []
                  : [
                      "صحافی",
                      {
                        springNormal: "فنر با طلق معمولی",
                        springPapco: "فنر با طلق پاپکو",
                        stapler: "منگنه",
                      }[printFolder.bindingOptions.bindingType],
                      printFolder.bindingOptions.bindingMethod !==
                      "countOfFiles"
                        ? {
                            allFilesTogether: "همه فایل ها با هم",
                            eachFileSeparated: "هر فایل جدا",
                          }[printFolder.bindingOptions.bindingMethod]
                        : `${formatNumber(
                            printFolder.bindingOptions.countOfFiles || 0
                          )} فایل`,
                      {
                        colorful: "جلد رنگی",
                        blackAndWhite: "جلد سیاه و سفید",
                      }[printFolder.bindingOptions.coverColor],
                    ]),
                `${formatNumber(printFolder.countOfCopies || 1)} نسخه`,
              ].join(" / ")}
            </div>
            {printFolder.description && (
              <>
                <div className={styles.Label}>توضیحات:</div>
                <div className={styles.Content}>{printFolder.description}</div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
