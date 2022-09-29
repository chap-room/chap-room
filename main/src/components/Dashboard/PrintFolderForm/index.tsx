import styles from "./style.module.scss";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormattedNumber } from "react-intl";
import {
  BindingMethod,
  BindingOptions,
  BindingType,
  CoverColor,
  PrintColors,
  PrintFile,
  PrintPaperSize,
  PrintType,
} from "@chap-room/shared/types";
import { ReactComponent as DeleteIcon } from "@chap-room/shared/assets/icons/delete.svg";
import Button from "@chap-room/shared/components/Button";
import CheckBox from "@chap-room/shared/components/CheckBox";
import ContentSelect from "@chap-room/shared/components/ContentSelect";
import Switch from "@chap-room/shared/components/Switch";
import TextArea from "@chap-room/shared/components/TextArea";
import TextInput from "@chap-room/shared/components/TextInput";
import BottomActions from "@chap-room/shared/components/Dashboard/BottomActions";
import UploadArea from "@chap-room/shared/components/Dashboard/UploadArea";
import Radio from "@chap-room/shared/components/Radio";

interface PrintFolderFormData {
  printFiles: PrintFile[];
  printColors: PrintColors;
  printPaperSize: PrintPaperSize;
  printType: PrintType;
  paperCount: number;
  bindingOptions: BindingOptions | null;
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
  const [needBinding, setNeedBinding] = useState(
    defaultValues ? defaultValues.bindingOptions !== null : false
  );
  const [bindingType, setBindingType] = useState(
    defaultValues && defaultValues.bindingOptions
      ? defaultValues.bindingOptions.bindingType
      : BindingType.springNormal
  );
  const [bindingMethod, setBindingMethod] = useState(
    defaultValues && defaultValues.bindingOptions
      ? defaultValues.bindingOptions.bindingMethod
      : BindingMethod.eachFileSeparated
  );
  const [numberOfFiles, setNumberOfFiles] = useState(
    defaultValues &&
      defaultValues.bindingOptions &&
      defaultValues.bindingOptions.numberOfFiles
      ? defaultValues.bindingOptions.numberOfFiles.toString()
      : ""
  );
  const [coverColor, setCoverColor] = useState(
    defaultValues && defaultValues.bindingOptions
      ? defaultValues.bindingOptions.coverColor
      : CoverColor.colorful
  );
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
                            inputProps={{
                              type: "number",
                              placeholder: "تعداد برگ",
                            }}
                            value={paperCount}
                            onChange={setPaperCount}
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
                  {needBinding && (
                    <div className={styles.BindingOtions}>
                      <div>
                        <div>نوع صحافی:</div>
                        <div>
                          <div>
                            <Radio
                              checked={bindingType === BindingType.springNormal}
                              onChecked={() =>
                                setBindingType(BindingType.springNormal)
                              }
                            />
                            {BindingType.springNormal}
                          </div>
                          <div>
                            <Radio
                              checked={bindingType === BindingType.springPapco}
                              onChecked={() =>
                                setBindingType(BindingType.springPapco)
                              }
                            />
                            {BindingType.springPapco}
                          </div>
                          <div>
                            <Radio
                              checked={bindingType === BindingType.stapler}
                              onChecked={() =>
                                setBindingType(BindingType.stapler)
                              }
                            />
                            {BindingType.stapler}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div>طریقه صحافی:</div>
                        <div>
                          <div>
                            <Radio
                              checked={
                                bindingMethod ===
                                BindingMethod.eachFileSeparated
                              }
                              onChecked={() =>
                                setBindingMethod(
                                  BindingMethod.eachFileSeparated
                                )
                              }
                            />
                            {BindingMethod.eachFileSeparated}
                          </div>
                          <div>
                            <Radio
                              checked={
                                bindingMethod === BindingMethod.allFilesTogether
                              }
                              onChecked={() =>
                                setBindingMethod(BindingMethod.allFilesTogether)
                              }
                            />
                            {BindingMethod.allFilesTogether}
                          </div>
                          <div>
                            <Radio
                              checked={
                                bindingMethod === BindingMethod.numberOfFiles
                              }
                              onChecked={() =>
                                setBindingMethod(BindingMethod.numberOfFiles)
                              }
                            />
                            {BindingMethod.numberOfFiles}
                            <div className={styles.Spacer} />
                            <div className={styles.NumberOfFiles}>
                              <TextInput
                                inputProps={{
                                  type: "number",
                                  placeholder: "تعداد",
                                }}
                                value={numberOfFiles}
                                onChange={setNumberOfFiles}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div>رنگ جلد:</div>
                        <div>
                          <div>
                            <Radio
                              checked={coverColor === CoverColor.colorful}
                              onChecked={() =>
                                setCoverColor(CoverColor.colorful)
                              }
                            />
                            {CoverColor.colorful}
                          </div>
                          <div>
                            <Radio
                              checked={coverColor === CoverColor.blackAndWhite}
                              onChecked={() =>
                                setCoverColor(CoverColor.blackAndWhite)
                              }
                            />
                            {CoverColor.blackAndWhite}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                        inputProps={{
                          type: "number",
                          placeholder: "تعداد کپی ها",
                        }}
                        value={copiesCount}
                        onChange={setCopiesCount}
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
                        bindingOptions: needBinding
                          ? {
                              bindingType,
                              bindingMethod,
                              numberOfFiles:
                                bindingMethod === BindingMethod.numberOfFiles
                                  ? parseInt(numberOfFiles)
                                  : null,
                              coverColor,
                            }
                          : null,
                        description: needSpecialDescription
                          ? description
                          : null,
                        copiesCount: toBePrintedInSeveralCopies
                          ? parseInt(copiesCount)
                          : null,
                      });
                    }}
                    disabled={
                      (needBinding &&
                        bindingMethod === BindingMethod.numberOfFiles &&
                        isNaN(parseInt(numberOfFiles))) ||
                      (needSpecialDescription && !description) ||
                      (toBePrintedInSeveralCopies &&
                        isNaN(parseInt(copiesCount)))
                    }
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
