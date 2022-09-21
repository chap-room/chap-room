import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormattedNumber } from "react-intl";
import {
  PrintColors,
  PrintFile,
  PrintPaperSize,
  PrintType,
} from "../../../types";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";
import Button from "../../Button";
import CheckBox from "../../CheckBox";
import ContentSelect from "../../ContentSelect";
import Switch from "../../Switch";
import TextArea from "../../TextArea";
import TextInput from "../../TextInput";
import BottomActions from "../BottomActions";
import UploadArea from "../UploadArea";
import styles from "./style.module.scss";

interface PrintFolderFormData {
  printFiles: PrintFile[];
  printColors: PrintColors;
  printPaperSize: PrintPaperSize;
  printType: PrintType;
  paperCount: number;
  description: string | null;
  copiesCount: number | null;
}

interface PrintFolderFormProps {
  defaultValues?: PrintFolderFormData;
  onCancel: () => void;
  onFinish: (data: PrintFolderFormData) => void;
}

export default function PrintFolderForm({
  defaultValues,
  onCancel,
  onFinish,
}: PrintFolderFormProps) {
  const [currentStep, setCurrentStep] = useState<"1" | "2">("1");
  const [printFiles, setPrintFiles] = useState(defaultValues?.printFiles || []);
  const [printColors, setPrintColors] = useState(
    defaultValues?.printColors || PrintColors.blackAndWhite
  );
  const [printPaperSize, setPrintPaperSize] = useState(
    defaultValues?.printPaperSize || PrintPaperSize.a4
  );
  const [printType, setPrintType] = useState(
    defaultValues?.printType || PrintType.doubleSided
  );
  const [paperCount, setPaperCount] = useState(
    defaultValues?.paperCount.toString() || ""
  );
  const [needBinding, setNeedBinding] = useState(false);
  const [needSpecialDescription, setNeedSpecialDescription] = useState(
    defaultValues ? defaultValues.description !== null : false
  );
  const [description, setDescription] = useState(
    defaultValues?.description || ""
  );
  const [toBePrintedInSeveralCopies, setToBePrintedInSeveralCopies] = useState(
    defaultValues ? defaultValues.copiesCount !== null : false
  );
  const [copiesCount, setCopiesCount] = useState(
    defaultValues?.copiesCount?.toString() || ""
  );

  return (
    <div className={styles.PrintFolderForm}>
      <Switch
        currentViewId={currentStep}
        views={[
          {
            id: "1",
            content: (
              <>
                <div className={styles.Step1}>
                  <div className={styles.SendFile}>
                    <div className={styles.Title}>ارسال فایل ها</div>
                    <div>
                      <UploadArea
                        onSelectFile={(file) =>
                          setPrintFiles([
                            ...printFiles,
                            {
                              id: uuidv4(),
                              name: file.name,
                            },
                          ])
                        }
                        acceptedTypes={{
                          Word: [
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          ],
                          PDF: ["application/pdf"],
                        }}
                        maxSizeInMB={200}
                        multiple
                      />
                      <div className={styles.UploadedFileList}>
                        {printFiles.map((printFile) => (
                          <div key={printFile.id}>
                            <div>{printFile.name}</div>
                            <div
                              className={styles.DeleteIcon}
                              onClick={() =>
                                setPrintFiles(
                                  printFiles.filter(
                                    (item) => item.id !== printFile.id
                                  )
                                )
                              }
                            >
                              <DeleteIcon />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.Separator} />
                  <div className={styles.PrintProperties}>
                    <div className={styles.Title}>
                      فایل های این پوشه رو چکارش کنم برات؟!
                    </div>
                    <div>
                      <ContentSelect
                        options={Object.values(PrintColors)}
                        value={printColors}
                        onChange={(printColors) =>
                          setPrintColors(printColors as PrintColors)
                        }
                      />
                      <ContentSelect
                        options={Object.values(PrintPaperSize)}
                        value={printPaperSize}
                        onChange={(printPaperSize) =>
                          setPrintPaperSize(printPaperSize as PrintPaperSize)
                        }
                      />
                      <ContentSelect
                        options={Object.values(PrintType)}
                        value={printType}
                        onChange={(printType) =>
                          setPrintType(printType as PrintType)
                        }
                      />
                      <div className={styles.PaperCount}>
                        <div>
                          <TextInput
                            type="number"
                            value={paperCount}
                            onTextChange={setPaperCount}
                            placeholder="تعداد برگ"
                          />
                        </div>
                        <div>
                          قیمت هر برگ: <FormattedNumber value={380} /> تومان
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <BottomActions>
                  {" "}
                  <Button varient="none" onClick={() => onCancel()}>
                    بازگشت
                  </Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStep("2")}
                    disabled={printFiles.length === 0 || !paperCount}
                  >
                    مرحله بعد
                  </Button>
                </BottomActions>
              </>
            ),
          },
          {
            id: "2",
            content: (
              <>
                <div className={styles.Step2}>
                  <div className={styles.CheckBoxWithLabel}>
                    <CheckBox checked={needBinding} onChange={setNeedBinding} />{" "}
                    نیاز به صحافی دارد نیاز به صحافی دارد
                  </div>
                  <div className={styles.Separator} />
                  <div className={styles.CheckBoxWithLabel}>
                    <CheckBox
                      checked={needSpecialDescription}
                      onChange={setNeedSpecialDescription}
                    />{" "}
                    نیاز به توضیحات خاصی دارد
                  </div>
                  {needSpecialDescription && (
                    <TextArea
                      value={description}
                      onTextChange={setDescription}
                      placeholder="توضیحات"
                      rows={3}
                    />
                  )}
                  <div className={styles.Separator} />
                  <div className={styles.CheckBoxWithLabel}>
                    <CheckBox
                      checked={toBePrintedInSeveralCopies}
                      onChange={setToBePrintedInSeveralCopies}
                    />{" "}
                    در چند نسخه چاپ شود
                  </div>
                  {toBePrintedInSeveralCopies && (
                    <div className={styles.CopiesCount}>
                      <TextInput
                        type="number"
                        value={copiesCount}
                        onTextChange={setCopiesCount}
                        placeholder="تعداد کپی ها"
                      />
                    </div>
                  )}
                </div>
                <BottomActions>
                  <Button varient="none" onClick={() => setCurrentStep("1")}>
                    مرحله قبل
                  </Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => {
                      setCurrentStep("1");
                      onFinish({
                        printFiles,
                        printColors,
                        printPaperSize,
                        printType,
                        paperCount: parseInt(paperCount),
                        description: needSpecialDescription
                          ? description
                          : null,
                        copiesCount: toBePrintedInSeveralCopies
                          ? parseInt(copiesCount)
                          : null,
                      });
                    }}
                  >
                    ثبت پوشه
                  </Button>
                </BottomActions>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
