import styles from "./style.module.scss";
import { useRef, useState } from "react";
import { PrintSize, PrintColor, PrintPrice, PrintSide } from "@/shared/types";
import EditIcon from "@/shared/assets/icons/edit.svg";
import CheckIcon from "@/shared/assets/icons/check.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import AddIcon from "@/shared/assets/icons/add.svg";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import IconButton from "@/shared/components/IconButton";

interface PrintPricesFormProps {
  printSize: "a4" | "a5" | "a3";
  printColor: "blackAndWhite" | "normalColor" | "fullColor";
  defaultValues?: Partial<PrintPrice>;
  onSave: (data: PrintPrice) => Promise<any>;
}

export default function PrintPricesForm({
  printSize,
  printColor,
  defaultValues,
  onSave,
}: PrintPricesFormProps) {
  const nextId = useRef(0);
  const [breakpoints, setBreakpoints] = useState([
    {
      id: nextId.current++,
      at: "1",
      singleSided: defaultValues?.singleSided?.toString() || "",
      doubleSided: defaultValues?.doubleSided?.toString() || "",
      singleSidedGlossy: defaultValues?.singleSidedGlossy?.toString() || "",
      doubleSidedGlossy: defaultValues?.doubleSidedGlossy?.toString() || "",
    },
    ...(defaultValues?.breakpoints?.map((breakpoint) => ({
      id: nextId.current++,
      at: breakpoint.at.toString(),
      singleSided: breakpoint.singleSided.toString(),
      doubleSided: breakpoint.doubleSided.toString(),
      singleSidedGlossy: breakpoint.singleSidedGlossy.toString(),
      doubleSidedGlossy: breakpoint.doubleSidedGlossy.toString(),
    })) || []),
  ]);
  const existingBreakpointsAt = useRef(
    breakpoints.map((breakpoint) => breakpoint.at)
  );
  const [editingAtProperty, setEditingAtProperty] = useState<number[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.Label}>سایز:</div>
        <div className={styles.Input}>
          <TextInput
            value={
              {
                a4: "A4",
                a5: "A5",
                a3: "A3",
              }[printSize]
            }
            readOnly
          />
        </div>
        <div className={styles.Label}>رنگ:</div>
        <div className={styles.Input}>
          <TextInput
            value={
              {
                blackAndWhite: "سیاه و سفید",
                normalColor: "رنگی معمولی",
                fullColor: "تمام رنگی",
              }[printColor]
            }
            readOnly
          />
        </div>
        <div className={styles.Label}>نقاط شکست:</div>
        <div className={styles.BreakpointsInput}>
          {breakpoints.map((breakpoint) => (
            <div className={styles.Item} key={breakpoint.id}>
              <div>
                <TextInput
                  inputProps={{
                    type: "number",
                  }}
                  value={breakpoint.at}
                  onChange={(newValue) => {
                    setBreakpoints(
                      breakpoints.map((item) =>
                        item.id === breakpoint.id
                          ? {
                              ...breakpoint,
                              at: newValue,
                            }
                          : item
                      )
                    );
                  }}
                  readOnly={!editingAtProperty.includes(breakpoint.id)}
                  prefix={<div className={styles.Label}>از صفحه:</div>}
                  suffix={
                    breakpoint.at !== "1" &&
                    (!editingAtProperty.includes(breakpoint.id) ? (
                      <div className={styles.EditAtButton}>
                        <IconButton
                          size={32}
                          onClick={() => {
                            existingBreakpointsAt.current =
                              existingBreakpointsAt.current.filter(
                                (item) => item !== breakpoint.at
                              );
                            setEditingAtProperty([
                              ...editingAtProperty,
                              breakpoint.id,
                            ]);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <div className={styles.DoneEditAtButton}>
                        <IconButton
                          size={32}
                          disabled={
                            isNaN(parseInt(breakpoint.at)) ||
                            parseInt(breakpoint.at) <= 0 ||
                            existingBreakpointsAt.current.includes(
                              breakpoint.at
                            )
                          }
                          onClick={() => {
                            existingBreakpointsAt.current.push(breakpoint.at);
                            setEditingAtProperty(
                              editingAtProperty.filter(
                                (item) => item !== breakpoint.id
                              )
                            );
                            setBreakpoints(
                              breakpoints.sort(
                                (a, b) => parseInt(a.at) - parseInt(b.at)
                              )
                            );
                          }}
                        >
                          <CheckIcon />
                        </IconButton>
                      </div>
                    ))
                  }
                />
                {breakpoint.at !== "1" && (
                  <button
                    className={styles.DeleteButton}
                    onClick={() => {
                      setBreakpoints(
                        breakpoints.filter((item) => item.id !== breakpoint.id)
                      );
                    }}
                  >
                    حذف کردن <DeletetIcon />
                  </button>
                )}
              </div>
              <TextInput
                inputProps={{
                  type: "number",
                }}
                value={breakpoint.singleSided}
                onChange={(newValue) => {
                  setBreakpoints(
                    breakpoints.map((item) =>
                      item.id === breakpoint.id
                        ? {
                            ...breakpoint,
                            singleSided: newValue,
                          }
                        : item
                    )
                  );
                }}
                prefix={<div className={styles.Label}>دو رو:</div>}
                suffix={<div className={styles.Label}>تومان</div>}
              />
              <TextInput
                inputProps={{
                  type: "number",
                }}
                value={breakpoint.doubleSided}
                onChange={(newValue) => {
                  setBreakpoints(
                    breakpoints.map((item) =>
                      item.id === breakpoint.id
                        ? {
                            ...breakpoint,
                            doubleSided: newValue,
                          }
                        : item
                    )
                  );
                }}
                prefix={<div className={styles.Label}>دو رو:</div>}
                suffix={<div className={styles.Label}>تومان</div>}
              />
              <TextInput
                inputProps={{
                  type: "number",
                }}
                value={breakpoint.singleSidedGlossy}
                onChange={(newValue) => {
                  setBreakpoints(
                    breakpoints.map((item) =>
                      item.id === breakpoint.id
                        ? {
                            ...breakpoint,
                            singleSidedGlossy: newValue,
                          }
                        : item
                    )
                  );
                }}
                prefix={<div className={styles.Label}>یک رو گلاسه:</div>}
                suffix={<div className={styles.Label}>تومان</div>}
              />
              <TextInput
                inputProps={{
                  type: "number",
                }}
                value={breakpoint.doubleSidedGlossy}
                onChange={(newValue) => {
                  setBreakpoints(
                    breakpoints.map((item) =>
                      item.id === breakpoint.id
                        ? {
                            ...breakpoint,
                            doubleSidedGlossy: newValue,
                          }
                        : item
                    )
                  );
                }}
                prefix={<div className={styles.Label}>دو رو گلاسه:</div>}
                suffix={<div className={styles.Label}>تومان</div>}
              />
            </div>
          ))}
          <div className={styles.Footer}>
            <button
              className={styles.AddButton}
              onClick={() => {
                setBreakpoints([
                  ...breakpoints,
                  {
                    id: nextId.current++,
                    at: "",
                    singleSided: "",
                    doubleSided: "",
                    singleSidedGlossy: "",
                    doubleSidedGlossy: "",
                  },
                ]);
              }}
            >
              اضافه کردن <AddIcon />
            </button>
          </div>
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() => {
            setIsSubmitting(true);
            onSave({
              singleSided: parseInt(breakpoints[0].singleSided),
              doubleSided: parseInt(breakpoints[0].doubleSided),
              singleSidedGlossy: parseInt(breakpoints[0].singleSidedGlossy),
              doubleSidedGlossy: parseInt(breakpoints[0].doubleSidedGlossy),
              breakpoints: breakpoints.slice(1).map((breakpoint) => ({
                at: parseInt(breakpoint.at),
                singleSided: parseInt(breakpoint.singleSided),
                doubleSided: parseInt(breakpoint.doubleSided),
                singleSidedGlossy: parseInt(breakpoint.singleSidedGlossy),
                doubleSidedGlossy: parseInt(breakpoint.doubleSidedGlossy),
              })),
            }).finally(() => setIsSubmitting(false));
          }}
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            editingAtProperty.length > 0 ||
            breakpoints.filter(
              (breakpoint) =>
                isNaN(parseInt(breakpoint.at)) ||
                parseInt(breakpoint.at) < 0 ||
                isNaN(parseInt(breakpoint.singleSided)) ||
                parseInt(breakpoint.singleSided) < 0 ||
                isNaN(parseInt(breakpoint.doubleSided)) ||
                parseInt(breakpoint.doubleSided) < 0 ||
                isNaN(parseInt(breakpoint.singleSidedGlossy)) ||
                parseInt(breakpoint.singleSidedGlossy) < 0 ||
                isNaN(parseInt(breakpoint.doubleSidedGlossy)) ||
                parseInt(breakpoint.doubleSidedGlossy) < 0
            ).length > 0
          }
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
