import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BindingOptions, PrintFile, Tariffs } from "@/shared/types";
import {
  uploadPrintFile,
  getTariffs,
  calculatePrintFolderPrice,
  request,
} from "@/main/api";
import {
  optionalValidate,
  useValidation,
  validateInt,
  validateNotEmpty,
} from "@/shared/utils/validation";
import { formatNumber } from "@/shared/utils/format";
import DeleteIcon from "@/shared/assets/icons/delete.svg";
import CloseIcon from "@/shared/assets/icons/close.svg";
import Button from "@/shared/components/Button";
import CheckBox from "@/shared/components/CheckBox";
import Switch from "@/shared/components/Switch";
import Select from "@/shared/components/Select";
import ErrorList from "@/shared/components/ErrorList";
import TextInput from "@/shared/components/TextInput";
import DataLoader, {
  DataLoaderView,
  useDataLoader,
} from "@/shared/components/DataLoader";
import TextArea from "@/shared/components/TextArea";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import UploadArea from "@/main/components/Dashboard/UploadArea";
import ProgressBar from "@/shared/components/ProgressBar";
import Radio from "@/shared/components/Radio";
import InfoTooltip from "@/shared/components/InfoTooltip";
import IconButton from "@/shared/components/IconButton";
import TelegramIcon from "@/main/assets/icons/telegram.svg";
import EitaaIcon from "@/main/assets/icons/eitaa.svg";
import CopyIcon from "@/shared/assets/icons/copy.svg";
import CopyToClipboard from "react-copy-to-clipboard";

interface PrintFolderFormData {
  printFiles: PrintFile[];
  filesManuallySent: boolean;
  folderCode: string;
  phoneNumberToSendFile: string;
  printColor: "blackAndWhite" | "normalColor" | "fullColor";
  printSize: "a4" | "a5" | "a3";
  printSide: "singleSided" | "doubleSided";
  countOfPages: number;
  bindingOptions: BindingOptions | null;
  description: string | null;
  countOfCopies: number | null;
}

interface PrintFolderFormProps {
  index: number;
  defaultValues?: Partial<PrintFolderFormData>;
  onCancel: () => void;
  onFinish: (data: PrintFolderFormData) => Promise<any>;
}

export default function PrintFolderForm({
  index,
  defaultValues,
  onCancel,
  onFinish,
}: PrintFolderFormProps) {
  const [tariffs, setTariffs] = useState<Tariffs | null>(null);
  const [printFiles, setPrintFiles] = useState(defaultValues?.printFiles || []);
  const [inUploadPrintFiles, setInUploadPrintFiles] = useState<File[]>([]);
  const [filesManuallySent, setFilesManuallySent] = useState(
    defaultValues?.filesManuallySent || false
  );

  const [currentStep, setCurrentStep] = useState<"1" | "2">("1");
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
      : "blackAndWhite"
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

  const [socialMediaFileSendData, setSocialMediaFileSendData] = useState<{
    folderCode: string;
    phoneNumberToSendFile: string;
  } | null>(
    defaultValues?.folderCode && defaultValues?.phoneNumberToSendFile
      ? {
          folderCode: defaultValues.folderCode,
          phoneNumberToSendFile: defaultValues.phoneNumberToSendFile,
        }
      : null
  );

  const step1FormValidation = useValidation(
    {
      printFiles: [
        optionalValidate({
          enabled: !filesManuallySent,
          validator: validateNotEmpty(),
        }),
      ],
      printColor: [validateNotEmpty()],
      printSize: [validateNotEmpty()],
      printSide: [validateNotEmpty()],
      countOfPages: [validateInt({ unsigned: true, min: 1 })],
    },
    {
      printFiles,
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
  if (
    printColor &&
    printSize &&
    printSide &&
    parseInt(countOfPages) &&
    !isNaN(parseInt(countOfPages)) &&
    parseInt(countOfPages) > 0 &&
    tariffs
  ) {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const printPrice = usePrintFolderPrice({
    isValid: step1FormValidation.isValid && step2FormValidation.isValid,
    printFiles,
    filesManuallySent,
    printColor: printColor!,
    printSize: printSize!,
    printSide: printSide!,
    countOfPages: parseInt(countOfPages),
    bindingOptions:
      currentStep === "1"
        ? null
        : needBinding
        ? {
            bindingType,
            bindingMethod,
            countOfFiles:
              bindingMethod === "countOfFiles" ? parseInt(countOfFiles) : null,
            coverColor,
          }
        : null,
    countOfCopies:
      currentStep === "1"
        ? 1
        : toBePrintedInSeveralCopies
        ? parseInt(countOfCopies)
        : 1,
  });

  const printPriceView = (
    <DataLoaderView state={printPrice.dataLoaderState} size="small">
      {printPrice.data && (
        <div className={styles.PrintPriceView}>
          مبلغ: {formatNumber(printPrice.data)} تومان
        </div>
      )}
    </DataLoaderView>
  );

  const cancelButton = (
    <Button varient="none" style={{ fontSize: 18 }} onClick={() => onCancel()}>
      بازگشت
    </Button>
  );

  const submitButton = (
    <Button
      varient="gradient"
      style={{ minWidth: 150 }}
      onClick={() => {
        setIsSubmitting(true);
        onFinish({
          printFiles,
          filesManuallySent,
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
          description: needSpecialDescription ? description : null,
          countOfCopies: toBePrintedInSeveralCopies
            ? parseInt(countOfCopies)
            : null,
          folderCode: "",
          phoneNumberToSendFile: "",
        }).finally(() => setIsSubmitting(false));
      }}
      loading={isSubmitting}
      disabled={
        isSubmitting ||
        !step1FormValidation.isValid ||
        !step2FormValidation.isValid
      }
    >
      ثبت پوشه {index}
    </Button>
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
                    <div className={styles.FilesSendMethod}>
                      <div onClick={() => setFilesManuallySent(false)}>
                        <Radio checked={!filesManuallySent} />
                        از طریق سایت
                      </div>
                      <div
                        onClick={() => {
                          if (
                            printFiles.length > 0 ||
                            inUploadPrintFiles.length > 0
                          )
                            toast.error(
                              "شما نمی توانید از هر دو روش استفاده کنید." +
                                " اگر می خواهید از تلگرام و ایتا استفاده کنید،" +
                                "ابتدا تمام فایل های لیست را حذف کنید."
                            );
                          else setFilesManuallySent(true);
                        }}
                      >
                        <Radio checked={filesManuallySent} />
                        از طریق تلگرام و ایتا
                      </div>
                    </div>
                    {!filesManuallySent && (
                      <div className={styles.ManualUploadFiles}>
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
                    )}
                    {filesManuallySent && (
                      <DataLoader
                        load={() =>
                          request({
                            method: "GET",
                            url: "/users/folders/code",
                            needAuth: true,
                          }).then(({ data }) => data)
                        }
                        setData={setSocialMediaFileSendData}
                        initialFetch={socialMediaFileSendData === null}
                      >
                        <div className={styles.SocialMediaUploadFiles}>
                          <div className={styles.FolderCode}>
                            <div>کد پوشه {index}:</div>
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="210"
                                height="55"
                              >
                                <rect
                                  x="0.5"
                                  y="0.5"
                                  width="209"
                                  height="54"
                                  stroke="#707070"
                                  stroke-width="1"
                                  stroke-dasharray="10 10"
                                  fill="none"
                                />
                              </svg>
                              <div>
                                <CopyToClipboard
                                  text={
                                    socialMediaFileSendData?.folderCode || ""
                                  }
                                >
                                  <IconButton varient="none" size={20}>
                                    <CopyIcon width={20} height={20} />
                                  </IconButton>
                                </CopyToClipboard>
                                <div>{socialMediaFileSendData?.folderCode}</div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.Note}>
                            فایلها را به همراه کد پوشه به یکی از اکانت‌های زیر
                            ارسال کنید.
                          </div>
                          <div className={styles.Accounts}>
                            <div className={styles.TelegramAccount}>
                              <TelegramIcon />
                              <div>chaproom_admin</div>
                            </div>
                            <div className={styles.EitaaAccount}>
                              <EitaaIcon />
                              <div>
                                {socialMediaFileSendData?.phoneNumberToSendFile}
                              </div>
                            </div>
                          </div>
                        </div>
                      </DataLoader>
                    )}
                  </div>
                  <div className={styles.Separator} />
                  <div className={styles.PrintProperties}>
                    <div className={styles.Title}>
                      فایل های این پوشه رو چکارش کنم برات؟
                    </div>
                    <div className={styles.FolderProperties}>
                      <div>
                        <Select
                          varient="shadow-without-bg"
                          placeholder="سیاه و سفید / رنگی "
                          options={{
                            blackAndWhite: "سیاه و سفید",
                            normalColor: "رنگی معمولی",
                            fullColor: "تمام رنگی",
                          }}
                          value={printColor}
                          onChange={setPrintColor}
                          height={48}
                        />
                        <ErrorList
                          errors={step1FormValidation.errors.printColor}
                        />
                      </div>
                      <div>
                        <Select
                          varient="shadow-without-bg"
                          placeholder="اندازه کاغذ"
                          options={{
                            a4: "A4",
                            a5: "A5",
                            a3: "A3",
                          }}
                          value={printSize}
                          onChange={setPrintSize}
                          height={48}
                        />
                        <ErrorList
                          errors={step1FormValidation.errors.printSize}
                        />
                      </div>
                      <div>
                        <Select
                          varient="shadow-without-bg"
                          placeholder="یک رو / دو رو"
                          options={{
                            singleSided: "یک رو",
                            doubleSided: "دو رو",
                          }}
                          value={printSide}
                          onChange={setPrintSide}
                          height={48}
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
                            varient="shadow-without-bg"
                            value={countOfPages}
                            onChange={setCountOfPages}
                            height={48}
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
                            {pagePrice &&
                              `قیمت هر برگ: ${formatNumber(pagePrice)} تومان`}
                          </DataLoader>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.StepBottomActionsContainer}>
                  <BottomActions>
                    {cancelButton}
                    <Button
                      varient="gradient"
                      style={{ minWidth: 150 }}
                      onClick={() => {
                        if (
                          filesManuallySent &&
                          bindingMethod === "eachFileSeparated"
                        )
                          setBindingMethod("allFilesTogether");
                        if (
                          printSize !== "a4" &&
                          bindingType === "springNormal"
                        )
                          setBindingType("springPapco");
                        setCurrentStep("2");
                      }}
                      disabled={!step1FormValidation.isValid}
                    >
                      مرحله بعد
                    </Button>
                  </BottomActions>
                </div>
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
                    صحافی نیاز دارم.
                  </div>
                  {needBinding && (
                    <div className={styles.BindingOtions}>
                      <div>
                        <div className={styles.Label}>نوع صحافی:</div>
                        <div className={styles.RadioList}>
                          {printSize === "a4" && (
                            <div>
                              <Radio
                                checked={bindingType === "springNormal"}
                                onChecked={() => setBindingType("springNormal")}
                              />
                              فنر با طلق معمولی
                            </div>
                          )}
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
                        <div className={styles.Label}>طریقه صحافی:</div>
                        <div>
                          <div className={styles.RadioList}>
                            {!filesManuallySent && (
                              <div>
                                <Radio
                                  checked={
                                    bindingMethod === "eachFileSeparated"
                                  }
                                  onChecked={() =>
                                    setBindingMethod("eachFileSeparated")
                                  }
                                />
                                هر فایل جدا
                              </div>
                            )}
                            <div>
                              <Radio
                                checked={bindingMethod === "allFilesTogether"}
                                onChecked={() =>
                                  setBindingMethod("allFilesTogether")
                                }
                              />
                              همه فایل ها با هم
                              <InfoTooltip
                                message="برگه ها به ترتیب نام گذاری فایل ها مرتب شده و در یک جلد صحافی میشود"
                                iconSize={20}
                              />
                            </div>
                            <div>
                              <Radio
                                checked={bindingMethod === "countOfFiles"}
                                onChecked={() => {
                                  setBindingMethod("countOfFiles");
                                  setNeedSpecialDescription(true);
                                }}
                              />
                              تعدادی از فایل ها
                              <div className={styles.Spacer} />
                              <div className={styles.NumberOfFiles}>
                                <TextInput
                                  inputProps={{
                                    type: "number",
                                    placeholder: "تعداد",
                                  }}
                                  varient="shadow-without-bg"
                                  value={countOfFiles}
                                  onChange={setCountOfFiles}
                                  readOnly={bindingMethod !== "countOfFiles"}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={styles.MobileSpacer} />
                          <ErrorList
                            errors={[
                              ...step2FormValidation.errors.countOfFiles.map(
                                (message) => `تعداد فایل ها ${message}`
                              ),
                            ]}
                          />
                        </div>
                      </div>
                      <div>
                        <div className={styles.Label}>رنگ جلد:</div>
                        <div className={styles.RadioList}>
                          <div>
                            <Radio
                              checked={coverColor === "blackAndWhite"}
                              onChecked={() => setCoverColor("blackAndWhite")}
                            />
                            سیاه و سفید
                          </div>
                          <div>
                            <Radio
                              checked={coverColor === "colorful"}
                              onChecked={() => setCoverColor("colorful")}
                            />
                            رنگی
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={styles.Separator} />
                  <div className={styles.CheckBoxWithLabel}>
                    <CheckBox
                      checked={needSpecialDescription}
                      readonly={bindingMethod === "countOfFiles"}
                      onChange={setNeedSpecialDescription}
                    />
                    سفارش من نیاز به توضیح خاصی دارد.
                  </div>
                  {needSpecialDescription && (
                    <div className={styles.InputContainer}>
                      <TextArea
                        varient="shadow"
                        value={description}
                        onTextChange={setDescription}
                        placeholder="توضیحات سفارش"
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
                    در چند سری ( نسخه ) چاپ شود.
                  </div>
                  {toBePrintedInSeveralCopies && (
                    <div className={styles.InputContainer}>
                      <div className={styles.CopiesCount}>
                        <TextInput
                          inputProps={{
                            type: "number",
                            placeholder: "تعداد سری ( نسخه )",
                          }}
                          varient="shadow-without-bg"
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
                <div className={styles.StepBottomActionsContainer}>
                  <BottomActions start={printPriceView}>
                    <Button
                      varient="none"
                      style={{ fontSize: 18 }}
                      onClick={() => setCurrentStep("1")}
                    >
                      مرحله قبل
                    </Button>
                    {submitButton}
                  </BottomActions>
                </div>
              </>
            ),
          },
        ]}
      />
      <div className={styles.MobileBottomActions}>
        {printPriceView}
        {submitButton}
      </div>
    </div>
  );
}

interface UploadedPrintFileProps {
  printFile: PrintFile;
  onDelete: () => void;
}

function UploadedPrintFile({ printFile, onDelete }: UploadedPrintFileProps) {
  return (
    <div className={styles.UploadedPrintFile}>
      <div>
        <div>
          <span>{printFile.name}</span>
          {printFile.countOfPages && (
            <span>({formatNumber(printFile.countOfPages)} صفحه)</span>
          )}
        </div>
      </div>
      <div className={styles.DeleteIcon}>
        <IconButton size={36} onClick={() => onDelete()}>
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
  const [progress, setProgress] = useState(0);
  const uploadState = useDataLoader({
    load: () => uploadPrintFile(file, setProgress),
    setData: ({ message, fileId, countOfPages }) => {
      toast.success(message);
      onComplete({
        id: fileId,
        name: file.name,
        countOfPages,
      });
    },
  });

  useEffect(() => {
    if (uploadState.isError) onError();
  }, [uploadState.isError]);

  return (
    <div className={styles.InUploadPrintFile}>
      <div>
        <div>{file.name}</div>
        <div className={styles.CencelIcon}>
          <IconButton size={36} onClick={() => onCancel}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <div>
        {progress * 100}٪
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
}

function usePrintFolderPrice({
  isValid,
  printFiles,
  filesManuallySent,
  printColor,
  printSize,
  printSide,
  countOfPages,
  bindingOptions,
  countOfCopies,
}: {
  isValid: boolean;
  printFiles: PrintFile[];
  filesManuallySent: boolean;
  printColor: "blackAndWhite" | "normalColor" | "fullColor";
  printSize: "a4" | "a5" | "a3";
  printSide: "singleSided" | "doubleSided";
  countOfPages: number;
  bindingOptions: BindingOptions | null;
  countOfCopies: number;
}) {
  const [data, setData] = useState<number | null>(null);
  const dataLoaderState = useDataLoader({
    load: () =>
      isValid
        ? calculatePrintFolderPrice({
            printFiles,
            filesManuallySent,
            printColor,
            printSize,
            printSide,
            countOfPages,
            bindingOptions,
            countOfCopies,
          })
        : Promise.resolve(null),
    setData,
    deps: [
      isValid,
      printFiles,
      filesManuallySent,
      printColor,
      printSize,
      printSide,
      countOfPages,
      bindingOptions
        ? [
            bindingOptions.bindingMethod,
            bindingOptions.bindingType,
            bindingOptions.countOfFiles,
            bindingOptions.coverColor,
          ].join("-")
        : null,
      countOfCopies,
    ],
  });

  return {
    data,
    dataLoaderState,
  };
}
