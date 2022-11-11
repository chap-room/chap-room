import styles from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import { FormattedNumber } from "react-intl";
import toast from "react-hot-toast";
import { BindingOptions, PrintFile, Tariffs } from "@/shared/types";
import {
  uploadPrintFile,
  deletePrintFile,
  getTariffs,
  calculatePrintFolderPrice,
} from "@/main/api";
import DeleteIcon from "@/shared/assets/icons/delete.svg";
import CloseIcon from "@/shared/assets/icons/close.svg";
import Button from "@/shared/components/Button";
import CheckBox from "@/shared/components/CheckBox";
import Switch from "@/shared/components/Switch";
import Select from "@/shared/components/Select";
import ErrorList from "@/shared/components/ErrorList";
import TextInput from "@/shared/components/TextInput";
import DataLoader from "@/shared/components/DataLoader";
import TextArea from "@/shared/components/TextArea";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import UploadArea from "@/shared/components/Dashboard/UploadArea";
import Radio from "@/shared/components/Radio";
import ProgressBar from "@/shared/components/ProgressBar";
import IconButton from "@/shared/components/IconButton";
import {
  optionalValidate,
  useValidation,
  validateInt,
  validateNotEmpty,
} from "@/shared/utils/validation";

interface PrintFolderFormData {
  printFiles: PrintFile[];
  printColor: "blackAndWhite" | "normalColor" | "fullColor";
  printSize: "a4" | "a5" | "a3";
  printSide: "singleSided" | "doubleSided";
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
  const [tariffs, setTariffs] = useState<Tariffs | null>(null);
  const [inUploadPrintFiles, setInUploadPrintFiles] = useState<File[]>([]);

  const [currentStep, setCurrentStep] = useState<"1" | "2">("1");
  const [printFiles, setPrintFiles] = useState(defaultValues?.printFiles || []);
  const [printColor, setPrintColor] = useState(
    defaultValues?.printColor || null
  );
  const [printSize, setPrintSize] = useState(defaultValues?.printSize || null);
  const [printSide, setPrintSide] = useState(defaultValues?.printSide || null);
  const [countOfPages, setCountOfPages] = useState(
    defaultValues?.countOfPages?.toString() || ""
  );
  const [needBinding, setNeedBinding] = useState(
    defaultValues ? defaultValues.bindingOptions !== null : false
  );
  const [bindingType, setBindingType] = useState(
    defaultValues && defaultValues.bindingOptions
      ? defaultValues.bindingOptions.bindingType
      : "springNormal"
  );
  const [bindingMethod, setBindingMethod] = useState(
    defaultValues && defaultValues.bindingOptions
      ? defaultValues.bindingOptions.bindingMethod
      : "eachFileSeparated"
  );
  const [countOfFiles, setCountOfFiles] = useState(
    defaultValues &&
      defaultValues.bindingOptions &&
      defaultValues.bindingOptions.countOfFiles
      ? defaultValues.bindingOptions.countOfFiles.toString()
      : ""
  );
  const [coverColor, setCoverColor] = useState(
    defaultValues && defaultValues.bindingOptions
      ? defaultValues.bindingOptions.coverColor
      : "colorful"
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

  const step1FormValidation = useValidation(
    {
      printColor: [validateNotEmpty()],
      printSize: [validateNotEmpty()],
      printSide: [validateNotEmpty()],
      countOfPages: [validateInt({ unsigned: true, min: 1 })],
    },
    {
      printColor,
      printSize,
      printSide,
      countOfPages,
    }
  );

  const step2FormValidation = useValidation(
    {
      countOfFiles: [
        optionalValidate({
          enabled: needBinding && bindingMethod === "countOfFiles",
          validator: validateInt({ unsigned: true, min: 1 }),
        }),
      ],
      description: [
        optionalValidate({
          enabled: needSpecialDescription,
          validator: validateNotEmpty(),
        }),
      ],
      countOfCopies: [
        optionalValidate({
          enabled: toBePrintedInSeveralCopies,
          validator: validateInt({ unsigned: true, min: 1 }),
        }),
      ],
    },
    {
      countOfFiles,
      description,
      countOfCopies,
    }
  );

  let pagePrice = null;
  if (step1FormValidation.isValid && tariffs) {
    const printPrice = tariffs!.print[printSize!][printColor!];
    const breakpoints = [
      {
        at: 1,
        singleSided: printPrice.singleSided,
        doubleSided: printPrice.doubleSided,
        singleSidedGlossy: printPrice.singleSidedGlossy,
        doubleSidedGlossy: printPrice.doubleSidedGlossy,
      },
      ...printPrice.breakpoints,
    ];
    let breakpoint = breakpoints[0];
    for (let item of breakpoints) {
      if (parseInt(countOfPages) >= item.at) {
        breakpoint = item;
      }
    }
    pagePrice = breakpoint[printSide!];
  }

  const [printFolderPrice, setPrintFolderPrice] = useState<number | null>(null);

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
                      <div>
                        <Select
                          varient="shadow"
                          placeholder="سیاه و سفید / رنگی "
                          options={{
                            blackAndWhite: "سیاه و سفید",
                            normalColor: "رنگی معمولی",
                            fullColor: "تمام رنگی",
                          }}
                          value={printColor}
                          onChange={setPrintColor}
                        />
                        <ErrorList
                          errors={step1FormValidation.errors.printColor}
                        />
                      </div>
                      <div>
                        <Select
                          varient="shadow"
                          placeholder="اندازه کاغذ"
                          options={{
                            a4: "A4",
                            a5: "A5",
                            a3: "A3",
                          }}
                          value={printSize}
                          onChange={setPrintSize}
                        />
                        <ErrorList
                          errors={step1FormValidation.errors.printSize}
                        />
                      </div>
                      <div>
                        <Select
                          varient="shadow"
                          placeholder="یک رو / دو رو"
                          options={{
                            singleSided: "یک رو",
                            doubleSided: "دو رو",
                          }}
                          value={printSide}
                          onChange={setPrintSide}
                        />
                        <ErrorList
                          errors={step1FormValidation.errors.printSide}
                        />
                      </div>
                      <div className={styles.PaperCount}>
                        <div className={styles.InputContainer}>
                          <TextInput
                            inputProps={{
                              type: "number",
                              placeholder: "تعداد برگ",
                            }}
                            varient="shadow"
                            value={countOfPages}
                            onChange={setCountOfPages}
                          />
                          <ErrorList
                            errors={step1FormValidation.errors.countOfPages}
                          />
                        </div>
                        <div>
                          <DataLoader
                            load={() => getTariffs()}
                            setData={setTariffs}
                            size="small"
                          >
                            {pagePrice && (
                              <>
                                قیمت هر برگ:{" "}
                                <FormattedNumber value={pagePrice} /> تومان
                              </>
                            )}
                          </DataLoader>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <BottomActions>
                  <Button varient="none" onClick={() => onCancel()}>
                    بازگشت
                  </Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStep("2")}
                    disabled={!step1FormValidation.isValid}
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
                    <CheckBox checked={needBinding} onChange={setNeedBinding} />
                    نیاز به صحافی دارد نیاز به صحافی دارد
                  </div>
                  {needBinding && (
                    <div className={styles.BindingOtions}>
                      <div>
                        <div>نوع صحافی:</div>
                        <div>
                          <div>
                            <Radio
                              checked={bindingType === "springNormal"}
                              onChecked={() => setBindingType("springNormal")}
                            />
                            فنر با طلق معمولی
                          </div>
                          <div>
                            <Radio
                              checked={bindingType === "springPapco"}
                              onChecked={() => setBindingType("springPapco")}
                            />
                            فنر با طلق پاپکو
                          </div>
                          <div>
                            <Radio
                              checked={bindingType === "stapler"}
                              onChecked={() => setBindingType("stapler")}
                            />
                            منگنه
                          </div>
                        </div>
                      </div>
                      <div>
                        <div>طریقه صحافی:</div>
                        <div>
                          <div>
                            <Radio
                              checked={bindingMethod === "eachFileSeparated"}
                              onChecked={() =>
                                setBindingMethod("eachFileSeparated")
                              }
                            />
                            هر فایل جدا
                          </div>
                          <div>
                            <Radio
                              checked={bindingMethod === "allFilesTogether"}
                              onChecked={() =>
                                setBindingMethod("allFilesTogether")
                              }
                            />
                            همه فایل ها با هم
                          </div>
                          <div>
                            <Radio
                              checked={bindingMethod === "countOfFiles"}
                              onChecked={() => setBindingMethod("countOfFiles")}
                            />
                            تعدادی از فایل ها
                            <div className={styles.Spacer} />
                            <div className={styles.InputContainer}>
                              <div className={styles.NumberOfFiles}>
                                <TextInput
                                  inputProps={{
                                    type: "number",
                                    placeholder: "تعداد",
                                  }}
                                  varient="shadow"
                                  value={countOfFiles}
                                  onChange={setCountOfFiles}
                                  readOnly={bindingMethod !== "countOfFiles"}
                                />
                              </div>
                              <ErrorList
                                errors={step2FormValidation.errors.countOfFiles}
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
                              checked={coverColor === "colorful"}
                              onChecked={() => setCoverColor("colorful")}
                            />
                            رنگی
                          </div>
                          <div>
                            <Radio
                              checked={coverColor === "blackAndWhite"}
                              onChecked={() => setCoverColor("blackAndWhite")}
                            />
                            سیاه و سفید
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
                    />
                    نیاز به توضیحات خاصی دارد
                  </div>
                  {needSpecialDescription && (
                    <div className={styles.InputContainer}>
                      <TextArea
                        varient="shadow"
                        value={description}
                        onTextChange={setDescription}
                        placeholder="توضیحات"
                        rows={3}
                      />
                      <ErrorList
                        errors={step2FormValidation.errors.description}
                      />
                    </div>
                  )}
                  <div className={styles.Separator} />
                  <div className={styles.CheckBoxWithLabel}>
                    <CheckBox
                      checked={toBePrintedInSeveralCopies}
                      onChange={setToBePrintedInSeveralCopies}
                    />
                    در چند نسخه چاپ شود
                  </div>
                  {toBePrintedInSeveralCopies && (
                    <div className={styles.InputContainer}>
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
                      <ErrorList
                        errors={step2FormValidation.errors.countOfCopies}
                      />
                    </div>
                  )}
                </div>
                <BottomActions
                  start={
                    <DataLoader
                      load={() => {
                        if (step2FormValidation.isValid) {
                          const abortController = new AbortController();
                          return [
                            calculatePrintFolderPrice(
                              {
                                printFiles,
                                printColor: printColor!,
                                printSize: printSize!,
                                printSide: printSide!,
                                countOfPages: parseInt(countOfPages),
                                bindingOptions: needBinding
                                  ? {
                                      bindingType,
                                      bindingMethod,
                                      countOfFiles:
                                        bindingMethod === "countOfFiles"
                                          ? parseInt(countOfFiles)
                                          : null,
                                      coverColor,
                                    }
                                  : null,
                                countOfCopies: toBePrintedInSeveralCopies
                                  ? parseInt(countOfCopies)
                                  : null,
                              },
                              abortController
                            ),
                            abortController,
                          ];
                        }
                      }}
                      setData={setPrintFolderPrice}
                      deps={[
                        printFiles,
                        printColor,
                        printSize,
                        printSide,
                        countOfPages,
                        needBinding && bindingType,
                        needBinding && bindingMethod,
                        needBinding &&
                          bindingMethod === "countOfFiles" &&
                          parseInt(countOfFiles),
                        needBinding && coverColor,
                        toBePrintedInSeveralCopies && parseInt(countOfCopies),
                      ]}
                      size="small"
                    >
                      {step2FormValidation.isValid && (
                        <div className={styles.PrintPriceView}>
                          مبلغ:{" "}
                          <FormattedNumber value={printFolderPrice || 0} />{" "}
                          تومان
                        </div>
                      )}
                    </DataLoader>
                  }
                >
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
                        printColor: printColor!,
                        printSize: printSize!,
                        printSide: printSide!,
                        countOfPages: parseInt(countOfPages),
                        bindingOptions: needBinding
                          ? {
                              bindingType,
                              bindingMethod,
                              countOfFiles:
                                bindingMethod === "countOfFiles"
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
                    disabled={isSubmitting || !step2FormValidation.isValid}
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
