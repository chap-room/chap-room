import styles from "./style.module.scss";
import { useRef, useState } from "react";
import {
  PrintSize,
  PrintColor,
  PrintPrices,
  PrintSide,
} from "@/shared/types";
import EditIcon from "@/shared/assets/icons/edit.svg";
import CheckIcon from "@/shared/assets/icons/check.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import AddIcon from "@/shared/assets/icons/add.svg";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import IconButton from "@/shared/components/IconButton";

interface PrintPricesFormProps {
  printSize: PrintSize;
  printColor: PrintColor;
  defaultValues?: Partial<PrintPrices>;
  onSave: (data: PrintPrices) => void;
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
      [PrintSide.singleSided]:
        defaultValues?.[PrintSide.singleSided]?.toString() || "",
      [PrintSide.doubleSided]:
        defaultValues?.[PrintSide.doubleSided]?.toString() || "",
      [PrintSide.singleSidedGlossy]:
        defaultValues?.[PrintSide.singleSidedGlossy]?.toString() || "",
      [PrintSide.doubleSidedGlossy]:
        defaultValues?.[PrintSide.doubleSidedGlossy]?.toString() || "",
    },
    ...(defaultValues?.breakpoints?.map((breakpoint) => ({
      id: nextId.current++,
      at: breakpoint.at.toString(),
      [PrintSide.singleSided]: breakpoint[PrintSide.singleSided].toString(),
      [PrintSide.doubleSided]: breakpoint[PrintSide.doubleSided].toString(),
      [PrintSide.singleSidedGlossy]:
        breakpoint[PrintSide.singleSidedGlossy].toString(),
      [PrintSide.doubleSidedGlossy]:
        breakpoint[PrintSide.doubleSidedGlossy].toString(),
    })) || []),
  ]);
  const existingBreakpointsAt = useRef(
    breakpoints.map((breakpoint) => breakpoint.at)
  );
  const [editingAtProperty, setEditingAtProperty] = useState<number[]>([]);

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.Label}>سایز کاغذ:</div>
        <div className={styles.Input}>
          <TextInput value={printSize} readOnly />
        </div>
        <div className={styles.Label}>نوع:</div>
        <div className={styles.Input}>
          <TextInput value={printColor} readOnly />
        </div>
        <div className={styles.Label}>نقاط شکست:</div>
        <div className={styles.BreakpointsInput}>
          {breakpoints.map((breakpoint) => (
            <>
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
                          breakpoints.filter(
                            (item) => item.id !== breakpoint.id
                          )
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
                  value={breakpoint[PrintSide.singleSided]}
                  onChange={(newValue) => {
                    setBreakpoints(
                      breakpoints.map((item) =>
                        item.id === breakpoint.id
                          ? {
                              ...breakpoint,
                              [PrintSide.singleSided]: newValue,
                            }
                          : item
                      )
                    );
                  }}
                  prefix={
                    <div className={styles.Label}>
                      {PrintSide.singleSided + ":"}
                    </div>
                  }
                  suffix={<div className={styles.Label}>تومان</div>}
                />
                <TextInput
                  inputProps={{
                    type: "number",
                  }}
                  value={breakpoint[PrintSide.doubleSided]}
                  onChange={(newValue) => {
                    setBreakpoints(
                      breakpoints.map((item) =>
                        item.id === breakpoint.id
                          ? {
                              ...breakpoint,
                              [PrintSide.doubleSided]: newValue,
                            }
                          : item
                      )
                    );
                  }}
                  prefix={
                    <div className={styles.Label}>
                      {PrintSide.doubleSided + ":"}
                    </div>
                  }
                  suffix={<div className={styles.Label}>تومان</div>}
                />
                <TextInput
                  inputProps={{
                    type: "number",
                  }}
                  value={breakpoint[PrintSide.singleSidedGlossy]}
                  onChange={(newValue) => {
                    setBreakpoints(
                      breakpoints.map((item) =>
                        item.id === breakpoint.id
                          ? {
                              ...breakpoint,
                              [PrintSide.singleSidedGlossy]: newValue,
                            }
                          : item
                      )
                    );
                  }}
                  prefix={
                    <div className={styles.Label}>
                      {PrintSide.singleSidedGlossy + ":"}
                    </div>
                  }
                  suffix={<div className={styles.Label}>تومان</div>}
                />
                <TextInput
                  inputProps={{
                    type: "number",
                  }}
                  value={breakpoint[PrintSide.doubleSidedGlossy]}
                  onChange={(newValue) => {
                    setBreakpoints(
                      breakpoints.map((item) =>
                        item.id === breakpoint.id
                          ? {
                              ...breakpoint,
                              [PrintSide.doubleSidedGlossy]: newValue,
                            }
                          : item
                      )
                    );
                  }}
                  prefix={
                    <div className={styles.Label}>
                      {PrintSide.doubleSidedGlossy + ":"}
                    </div>
                  }
                  suffix={<div className={styles.Label}>تومان</div>}
                />
              </div>
              <div className={styles.Separator} />
            </>
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
                    [PrintSide.singleSided]: "",
                    [PrintSide.doubleSided]: "",
                    [PrintSide.singleSidedGlossy]: "",
                    [PrintSide.doubleSidedGlossy]: "",
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
          onClick={() =>
            onSave({
              [PrintSide.singleSided]: parseInt(
                breakpoints[0][PrintSide.singleSided]
              ),
              [PrintSide.doubleSided]: parseInt(
                breakpoints[0][PrintSide.doubleSided]
              ),
              [PrintSide.singleSidedGlossy]: parseInt(
                breakpoints[0][PrintSide.singleSidedGlossy]
              ),
              [PrintSide.doubleSidedGlossy]: parseInt(
                breakpoints[0][PrintSide.doubleSidedGlossy]
              ),
              breakpoints: breakpoints.splice(1).map((breakpoint) => ({
                at: parseInt(breakpoint.at),
                [PrintSide.singleSided]: parseInt(
                  breakpoint[PrintSide.singleSided]
                ),
                [PrintSide.doubleSided]: parseInt(
                  breakpoint[PrintSide.doubleSided]
                ),
                [PrintSide.singleSidedGlossy]: parseInt(
                  breakpoint[PrintSide.singleSidedGlossy]
                ),
                [PrintSide.doubleSidedGlossy]: parseInt(
                  breakpoint[PrintSide.doubleSidedGlossy]
                ),
              })),
            })
          }
          disabled={
            editingAtProperty.length > 0 ||
            breakpoints.filter(
              (breakpoint) =>
                isNaN(parseInt(breakpoint.at)) ||
                parseInt(breakpoint.at) < 0 ||
                isNaN(parseInt(breakpoint[PrintSide.singleSided])) ||
                parseInt(breakpoint[PrintSide.singleSided]) < 0 ||
                isNaN(parseInt(breakpoint[PrintSide.doubleSided])) ||
                parseInt(breakpoint[PrintSide.doubleSided]) < 0 ||
                isNaN(parseInt(breakpoint[PrintSide.singleSidedGlossy])) ||
                parseInt(breakpoint[PrintSide.singleSidedGlossy]) < 0 ||
                isNaN(parseInt(breakpoint[PrintSide.doubleSidedGlossy])) ||
                parseInt(breakpoint[PrintSide.doubleSidedGlossy]) < 0
            ).length > 0
          }
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
