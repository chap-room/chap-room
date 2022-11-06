import styles from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import { FormattedNumber } from "react-intl";
import toast from "react-hot-toast";
import {
  BindingMethod,
  BindingOptions,
  BindingType,
  CoverColors,
  PrintColor,
  PrintFile,
  PrintSize,
  PrintSide,
} from "@/shared/types";
import { uploadPrintFile, deletePrintFile } from "@/main/api";
import DeleteIcon from "@/shared/assets/icons/delete.svg";
import CloseIcon from "@/shared/assets/icons/close.svg";
import Button from "@/shared/components/Button";
import CheckBox from "@/shared/components/CheckBox";
import ContentSelect from "@/shared/components/ContentSelect";
import Switch from "@/shared/components/Switch";
import TextArea from "@/shared/components/TextArea";
import TextInput from "@/shared/components/TextInput";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import UploadArea from "@/shared/components/Dashboard/UploadArea";
import Radio from "@/shared/components/Radio";
import ProgressBar from "@/shared/components/ProgressBar";
import IconButton from "@/shared/components/IconButton";

interface PrintFolderFormData {
  printFiles: PrintFile[];
  printColor: PrintColor;
  printSize: PrintSize;
  printSide: PrintSide;
  countOfPages: number;
  bindingOptions: BindingOptions | null;
  description: string | null;
  countOfCopies: number | null;
}

interface PrintFolderFormProps {
  defaultValues?: Partial<PrintFolderFormData>;
  onCancel: () => void;
  onFinish: (data: PrintFolderFormData) => Promise<any>;
}

export default function PrintFolderForm({
  defaultValues,
  onCancel,
  onFinish,
}: PrintFolderFormProps) {
  const [inUploadPrintFiles, setInUploadPrintFiles] = useState<File[]>([]);

  const [currentStep, setCurrentStep] = useState<"1" | "2">("1");
  const [printFiles, setPrintFiles] = useState(defaultValues?.printFiles || []);
  const [printColor, setPrintColor] = useState(
    defaultValues?.printColor || PrintColor.blackAndWhite
  );
  const [printSize, setPrintSize] = useState(
    defaultValues?.printSize || PrintSize.a4
  );
  const [printSide, setPrintSide] = useState(
    defaultValues?.printSide || PrintSide.doubleSided
  );
  const [countOfPages, setPaperCount] = useState(
    defaultValues?.countOfPages?.toString() || ""
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
  const [countOfFiles, setNumberOfFiles] = useState(
    defaultValues &&
      defaultValues.bindingOptions &&
      defaultValues.bindingOptions.countOfFiles
      ? defaultValues.bindingOptions.countOfFiles.toString()
      : ""
  );
  const [coverColor, setCoverColor] = useState(
    defaultValues && defaultValues.bindingOptions
      ? defaultValues.bindingOptions.coverColor
      : CoverColors.colorful
  );
  const [needSpecialDescription, setNeedSpecialDescription] = useState(
    defaultValues ? defaultValues.description !== null : false
  );
  const [description, setDescription] = useState(
    defaultValues?.description || ""
  );
  const [toBePrintedInSeveralCopies, setToBePrintedInSeveralCopies] = useState(
    defaultValues ? defaultValues.countOfCopies !== null : false
  );
  const [countOfCopies, setCountOfCopies] = useState(
    defaultValues?.countOfCopies?.toString() || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

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
                          setInUploadPrintFiles([...inUploadPrintFiles, file])
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
                          <UploadedPrintFile
                            key={printFile.id}
                            printFile={printFile}
                            onDelete={() =>
                              setPrintFiles(
                                printFiles.filter(
                                  (item) => item.id !== printFile.id
                                )
                              )
                            }
                          />
                        ))}
                      </div>
                      <div className={styles.InUploadFileList}>
                        {inUploadPrintFiles.map((file, index) => (
                          <UploadPrintFile
                            key={index}
                            file={file}
                            onCancel={() =>
                              setInUploadPrintFiles(
                                inUploadPrintFiles.filter(
                                  (item) => item !== file
                                )
                              )
                            }
                            onComplete={(printFile) => {
                              setInUploadPrintFiles(
                                inUploadPrintFiles.filter(
                                  (item) => item !== file
                                )
                              );
                              setPrintFiles([...printFiles, printFile]);
                            }}
                            onError={() => {
                              setInUploadPrintFiles(
                                inUploadPrintFiles.filter(
                                  (item) => item !== file
                                )
                              );
                            }}
                          />
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
                        varient="shadow"
                        options={Object.values(PrintColor)}
                        value={printColor}
                        onChange={(printColor) =>
                          setPrintColor(printColor as PrintColor)
                        }
                      />
                      <ContentSelect
                        varient="shadow"
                        options={Object.values(PrintSize)}
                        value={printSize}
                        onChange={(printSize) =>
                          setPrintSize(printSize as PrintSize)
                        }
                      />
                      <ContentSelect
                        varient="shadow"
                        options={Object.values(PrintSide)}
                        value={printSide}
                        onChange={(printSide) =>
                          setPrintSide(printSide as PrintSide)
                        }
                      />
                      <div className={styles.PaperCount}>
                        <div>
                          <TextInput
                            inputProps={{
                              type: "number",
                              placeholder: "تعداد برگ",
                            }}
                            varient="shadow"
                            value={countOfPages}
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
                    disabled={printFiles.length === 0 || !countOfPages}
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
                                bindingMethod === BindingMethod.countOfFiles
                              }
                              onChecked={() =>
                                setBindingMethod(BindingMethod.countOfFiles)
                              }
                            />
                            {BindingMethod.countOfFiles}
                            <div className={styles.Spacer} />
                            <div className={styles.NumberOfFiles}>
                              <TextInput
                                inputProps={{
                                  type: "number",
                                  placeholder: "تعداد",
                                }}
                                varient="shadow"
                                value={countOfFiles}
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
                              checked={coverColor === CoverColors.colorful}
                              onChecked={() =>
                                setCoverColor(CoverColors.colorful)
                              }
                            />
                            {CoverColors.colorful}
                          </div>
                          <div>
                            <Radio
                              checked={coverColor === CoverColors.blackAndWhite}
                              onChecked={() =>
                                setCoverColor(CoverColors.blackAndWhite)
                              }
                            />
                            {CoverColors.blackAndWhite}
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
                      varient="shadow"
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
                        varient="shadow"
                        value={countOfCopies}
                        onChange={setCountOfCopies}
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
                      setIsSubmitting(true);
                      onFinish({
                        printFiles,
                        printColor,
                        printSize,
                        printSide,
                        countOfPages: parseInt(countOfPages),
                        bindingOptions: needBinding
                          ? {
                              bindingType,
                              bindingMethod,
                              countOfFiles:
                                bindingMethod === BindingMethod.countOfFiles
                                  ? parseInt(countOfFiles)
                                  : null,
                              coverColor,
                            }
                          : null,
                        description: needSpecialDescription
                          ? description
                          : null,
                        countOfCopies: toBePrintedInSeveralCopies
                          ? parseInt(countOfCopies)
                          : null,
                      }).finally(() => setIsSubmitting(false));
                    }}
                    loading={isSubmitting}
                    disabled={
                      isSubmitting ||
                      (needBinding &&
                        bindingMethod === BindingMethod.countOfFiles &&
                        (isNaN(parseInt(countOfFiles)) ||
                          parseInt(countOfFiles) <= 0)) ||
                      (needSpecialDescription && !description) ||
                      (toBePrintedInSeveralCopies &&
                        (isNaN(parseInt(countOfCopies)) ||
                          parseInt(countOfCopies) <= 0))
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

interface UploadedPrintFileProps {
  printFile: PrintFile;
  onDelete: () => void;
}

function UploadedPrintFile({ printFile, onDelete }: UploadedPrintFileProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className={styles.UploadedPrintFile}>
      <div>
        {printFile.name}
        {" ("}
        <FormattedNumber value={printFile.countOfPages} />
        {" صفحه)"}
      </div>
      <div className={styles.DeleteIcon}>
        <IconButton
          size={36}
          onClick={() => {
            setIsDeleting(true);
            deletePrintFile(printFile.id)
              .then((message) => {
                toast.success(message);
                onDelete();
              })
              .catch(toast.error)
              .finally(() => setIsDeleting(false));
          }}
          disabled={isDeleting}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
}

interface UploadPrintFileProps {
  file: File;
  onCancel: () => void;
  onComplete: (printFile: PrintFile) => void;
  onError: () => void;
}

function UploadPrintFile({
  file,
  onCancel,
  onComplete,
  onError,
}: UploadPrintFileProps) {
  const abortController = useRef(new AbortController());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    uploadPrintFile(file, setProgress, abortController.current)
      .then(({ message, fileId, countOfPages }) => {
        toast.success(message);
        onComplete({
          id: fileId,
          name: file.name,
          countOfPages,
        });
      })
      .catch((message) => {
        toast.error(message);
        onError();
      });

    return () => {
      abortController.current.abort();
    };
  }, [file]);

  return (
    <div className={styles.InUploadPrintFile}>
      <div>
        <div>{file.name}</div>
        <div className={styles.CencelIcon}>
          <IconButton
            size={36}
            onClick={() => {
              abortController.current.abort();
              onCancel();
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <div>
        <FormattedNumber value={progress} style="percent" />
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
}
