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
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Radio from "@/shared/components/Radio";
import UploadArea from "@/main/components/Dashboard/UploadArea";
import ProgressBar from "@/shared/components/ProgressBar";
import CopyToClipboard from "react-copy-to-clipboard";
import EitaaIcon from "@/main/assets/icons/eitaa.svg";
import TelegramIcon from "@/main/assets/icons/telegram.svg";
import CopyIcon from "@/shared/assets/icons/copy.svg";
import WarningIcon from "@/admin/assets/icons/info.svg";
import TextArea from "@/shared/components/TextArea";
import InfoTooltip from "@/shared/components/InfoTooltip";
import IconButton from "@/shared/components/IconButton";

interface PrintFolderFormData {
  printFiles: PrintFile[];
  filesManuallySent: boolean;
  folderCode: string;
  eitaa: { account: string; url: string };
  telegram: { account: string; url: string };
  printColor: "blackAndWhite" | "normalColor" | "fullColor";
  printSize: "a4" | "a5" | "a3";
  printSide:
    | "singleSided"
    | "doubleSided"
    | "singleSidedGlossy"
    | "doubleSidedGlossy";
  countOfPapers: number;
  bindingOptions: BindingOptions | null;
  description: string | null;
  countOfCopies: number | null;
}

interface PrintFolderFormProps {
  index: number;
  defaultValues?: Partial<PrintFolderFormData>;
  onCancel: () => void;
  onFinish: (
    data: Omit<PrintFolderFormData, "folderCode" | "eitaa" | "telegram">
  ) => Promise<any>;
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
  const [countOfPapers, setCountOfPapers] = useState(
    defaultValues?.countOfPapers?.toString() || ""
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
    eitaa: { account: string; url: string };
    telegram: { account: string; url: string };
  } | null>(
    defaultValues?.folderCode && defaultValues?.eitaa && defaultValues?.telegram
      ? {
          folderCode: defaultValues.folderCode,
          eitaa: defaultValues.eitaa,
          telegram: defaultValues.telegram,
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
      countOfPapers: [validateInt({ unsigned: true, min: 1 })],
    },
    {
      printFiles,
      printColor,
      printSize,
      printSide,
      countOfPapers,
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
    parseInt(countOfPapers) &&
    !isNaN(parseInt(countOfPapers)) &&
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
      if (parseInt(countOfPapers) >= item.at) {
        breakpoint = item;
      }
    }
    pagePrice = breakpoint[printSide!];
  }

  const uploadedPages = printFiles.reduce(
    (result, item) => result + (item.countOfPages || 0),
    0
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const printPrice = usePrintFolderPrice({
    isValid: step1FormValidation.isValid && step2FormValidation.isValid,
    printFiles,
    filesManuallySent,
    printColor: printColor!,
    printSize: printSize!,
    printSide: printSide!,
    countOfPapers: parseInt(countOfPapers),
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
          ????????: {formatNumber(printPrice.data)} ??????????
        </div>
      )}
    </DataLoaderView>
  );

  const cancelButton = (
    <Button varient="none" style={{ fontSize: 18 }} onClick={() => onCancel()}>
      ????????????
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
          countOfPapers: parseInt(countOfPapers),
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
        }).finally(() => setIsSubmitting(false));
      }}
      loading={isSubmitting}
      disabled={
        isSubmitting ||
        !step1FormValidation.isValid ||
        !step2FormValidation.isValid
      }
    >
      ?????? ???????? {index}
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
                    <div className={styles.Title}>?????????? ???????? ????</div>
                    <div className={styles.FilesSendMethod}>
                      <div onClick={() => setFilesManuallySent(false)}>
                        <Radio checked={!filesManuallySent} />
                        ???? ???????? ????????
                      </div>
                      <div
                        onClick={() => {
                          if (
                            printFiles.length > 0 ||
                            inUploadPrintFiles.length > 0
                          )
                            toast.error(
                              "?????? ?????? ???????????? ???? ???? ???? ?????? ?????????????? ????????." +
                                " ?????? ???? ???????????? ???? ???????????? ?? ???????? ?????????????? ??????????" +
                                "?????????? ???????? ???????? ?????? ???????? ???? ?????? ????????."
                            );
                          else setFilesManuallySent(true);
                        }}
                      >
                        <Radio checked={filesManuallySent} />
                        ???? ???????? ???????????? ?? ????????
                      </div>
                    </div>
                    {!filesManuallySent && (
                      <div className={styles.ManualUploadFiles}>
                        <UploadArea
                          onSelectFiles={(files) =>
                            setInUploadPrintFiles([...inUploadPrintFiles, ...files])
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
                            <div>???? ???????? {index}:</div>
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
                            ???????????? ???? ???? ?????????? ???? ???????? ???? ?????? ???? ??????????????????? ??????
                            ?????????? ????????.
                          </div>
                          <div className={styles.Accounts}>
                            <a
                              className={styles.TelegramAccount}
                              href={socialMediaFileSendData?.telegram?.url}
                              target="_blank"
                            >
                              <TelegramIcon />
                              <div>
                                {socialMediaFileSendData?.telegram?.account}
                              </div>
                            </a>
                            <a
                              className={styles.EitaaAccount}
                              href={socialMediaFileSendData?.eitaa?.url}
                              target="_blank"
                            >
                              <EitaaIcon />
                              <div>
                                {socialMediaFileSendData?.eitaa?.account}
                              </div>
                            </a>
                          </div>
                        </div>
                      </DataLoader>
                    )}
                  </div>
                  <div className={styles.Separator} />
                  <div className={styles.PrintProperties}>
                    <div className={styles.Title}>
                      ???????? ?????? ?????? ???????? ???? ?????????? ?????? ??????????
                    </div>
                    <div className={styles.FolderProperties}>
                      <div>
                        <Select
                          varient="shadow-without-bg"
                          placeholder="???????? ?? ???????? / ???????? "
                          options={{
                            blackAndWhite: "???????? ?? ????????",
                            normalColor: "???????? ????????????",
                            fullColor: "???????? ????????",
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
                          placeholder="???????????? ????????"
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
                          placeholder="???? ???? / ???? ????"
                          options={{
                            singleSided: "???? ????",
                            doubleSided: "???? ????",
                            singleSidedGlossy: "???? ???? ??????????",
                            doubleSidedGlossy: "???? ???? ??????????",
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
                              placeholder: "??????????",
                            }}
                            varient="shadow-without-bg"
                            suffix="??????"
                            value={countOfPapers}
                            onChange={setCountOfPapers}
                            height={48}
                          />
                          <ErrorList
                            errors={step1FormValidation.errors.countOfPapers}
                          />
                        </div>
                        <div>
                          <DataLoader
                            load={() => getTariffs()}
                            setData={setTariffs}
                            size="small"
                          >
                            {pagePrice &&
                              `???????? ???? ??????: ${formatNumber(pagePrice)} ??????????`}
                          </DataLoader>
                        </div>
                      </div>
                      {((printSide &&
                        parseInt(countOfPapers) &&
                        !isNaN(parseInt(countOfPapers))) ||
                        false) && (
                        <div>
                          <div style={{ color: "#0077b5" }}>
                            {parseInt(countOfPapers)} ??????{" "}
                            {
                              {
                                singleSided: "???? ????",
                                doubleSided: "???? ????",
                                singleSidedGlossy: "???? ????",
                                doubleSidedGlossy: "???? ????",
                              }[printSide]
                            }{" "}
                            ??????????{" "}
                            <u>
                              {parseInt(countOfPapers) *
                                (printSide === "singleSided" ||
                                printSide === "singleSidedGlossy"
                                  ? 1
                                  : 2)}{" "}
                              ????????
                            </u>{" "}
                            ???? ????????
                          </div>
                          {uploadedPages >
                            parseInt(countOfPapers) *
                              (printSide === "singleSided" ||
                              printSide === "singleSidedGlossy"
                                ? 1
                                : 2) && (
                            <div className={styles.PageCountMismatch}>
                              <WarningIcon />
                              ?????????? ?????????? ?????????????? ?????? ?????????? ???? ?????????? ?????? ??????????????
                              ???? ????????!
                            </div>
                          )}
                        </div>
                      )}
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
                      ?????????? ??????
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
                    ?????????? ???????? ????????.
                  </div>
                  {needBinding && (
                    <div className={styles.BindingOtions}>
                      <div>
                        <div className={styles.Label}>?????? ??????????:</div>
                        <div className={styles.RadioList}>
                          {printSize === "a4" && (
                            <div>
                              <Radio
                                checked={bindingType === "springNormal"}
                                onChecked={() => setBindingType("springNormal")}
                              />
                              ?????? ???? ?????? ????????????
                            </div>
                          )}
                          <div>
                            <Radio
                              checked={bindingType === "springPapco"}
                              onChecked={() => setBindingType("springPapco")}
                            />
                            ?????? ???? ?????? ??????????
                          </div>
                          <div>
                            <Radio
                              checked={bindingType === "stapler"}
                              onChecked={() => setBindingType("stapler")}
                            />
                            ??????????
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className={styles.Label}>?????????? ??????????:</div>
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
                                ???? ???????? ??????
                              </div>
                            )}
                            <div>
                              <Radio
                                checked={bindingMethod === "allFilesTogether"}
                                onChecked={() =>
                                  setBindingMethod("allFilesTogether")
                                }
                              />
                              ?????? ???????? ???? ???? ????
                              <InfoTooltip
                                message="???????? ???? ???? ?????????? ?????? ?????????? ???????? ???? ???????? ?????? ?? ???? ???? ?????? ?????????? ??????????"
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
                              ???????????? ???? ???????? ????
                              <div className={styles.Spacer} />
                              <div className={styles.NumberOfFiles}>
                                <TextInput
                                  inputProps={{
                                    type: "number",
                                    placeholder: "??????????",
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
                                (message) => `?????????? ???????? ???? ${message}`
                              ),
                            ]}
                          />
                        </div>
                      </div>
                      <div>
                        <div className={styles.Label}>?????? ??????:</div>
                        <div className={styles.RadioList}>
                          <div>
                            <Radio
                              checked={coverColor === "blackAndWhite"}
                              onChecked={() => setCoverColor("blackAndWhite")}
                            />
                            ???????? ?? ????????
                          </div>
                          <div>
                            <Radio
                              checked={coverColor === "colorful"}
                              onChecked={() => setCoverColor("colorful")}
                            />
                            ????????
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
                    ?????????? ???? ???????? ???? ?????????? ???????? ????????.
                  </div>
                  {needSpecialDescription && (
                    <div className={styles.InputContainer}>
                      <TextArea
                        varient="shadow"
                        value={description}
                        onTextChange={setDescription}
                        placeholder="?????????????? ??????????"
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
                    ???? ?????? ?????? ( ???????? ) ?????? ??????.
                  </div>
                  {toBePrintedInSeveralCopies && (
                    <div className={styles.InputContainer}>
                      <div className={styles.CopiesCount}>
                        <TextInput
                          inputProps={{
                            type: "number",
                            placeholder: "?????????? ?????? ( ???????? )",
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
                      ?????????? ??????
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
            <span>({formatNumber(printFile.countOfPages)} ????????)</span>
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
        {Math.floor(progress * 100)}??
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
  countOfPapers,
  bindingOptions,
  countOfCopies,
}: {
  isValid: boolean;
  printFiles: PrintFile[];
  filesManuallySent: boolean;
  printColor: "blackAndWhite" | "normalColor" | "fullColor";
  printSize: "a4" | "a5" | "a3";
  printSide:
    | "singleSided"
    | "doubleSided"
    | "singleSidedGlossy"
    | "doubleSidedGlossy";
  countOfPapers: number;
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
            countOfPapers,
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
      countOfPapers,
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
