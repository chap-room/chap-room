import styles from "./style.module.scss";
import { useState } from "react";
import {
  BindingPrices,
  BindingType,
  PrintSize,
} from "@/shared/types";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";

interface BindingPricesFormProps {
  defaultValues?: Partial<BindingPrices>;
  onSave: (data: BindingPrices) => void;
}

export default function BindingPricesForm({
  defaultValues,
  onSave,
}: BindingPricesFormProps) {
  const [springNormalA4Price, setSpringNormalA4Price] = useState(
    defaultValues?.[BindingType.springNormal]?.[PrintSize.a4].toString() ||
      ""
  );
  const [springNormalA3Price, setSpringNormalA3Price] = useState(
    defaultValues?.[BindingType.springNormal]?.[PrintSize.a3].toString() ||
      ""
  );
  const [springNormalA5Price, setSpringNormalA5Price] = useState(
    defaultValues?.[BindingType.springNormal]?.[PrintSize.a5].toString() ||
      ""
  );
  const [springPapcoA4Price, setSpringPapcoA4Price] = useState(
    defaultValues?.[BindingType.springPapco]?.[PrintSize.a4].toString() ||
      ""
  );
  const [springPapcoA3Price, setSpringPapcoA3Price] = useState(
    defaultValues?.[BindingType.springPapco]?.[PrintSize.a3].toString() ||
      ""
  );
  const [springPapcoA5Price, setSpringPapcoA5Price] = useState(
    defaultValues?.[BindingType.springPapco]?.[PrintSize.a5].toString() ||
      ""
  );
  const [staplerPrice, setStaplerPrice] = useState(
    defaultValues?.[BindingType.stapler]?.toString() || ""
  );

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.Label}>فنر با طلق معمولی A4:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number" }}
            suffix="تومان"
            value={springNormalA4Price}
            onChange={setSpringNormalA4Price}
          />
        </div>
        <div className={styles.Label}>فنر با طلق معمولی A3:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number" }}
            suffix="تومان"
            value={springNormalA3Price}
            onChange={setSpringNormalA3Price}
          />
        </div>
        <div className={styles.Label}>فنر با طلق معمولی A5:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number" }}
            suffix="تومان"
            value={springNormalA5Price}
            onChange={setSpringNormalA5Price}
          />
        </div>
        <div className={styles.Label}>فنر با طلق پاپکو A4:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number" }}
            suffix="تومان"
            value={springPapcoA4Price}
            onChange={setSpringPapcoA4Price}
          />
        </div>
        <div className={styles.Label}>فنر با طلق پاپکو A3:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number" }}
            suffix="تومان"
            value={springPapcoA3Price}
            onChange={setSpringPapcoA3Price}
          />
        </div>
        <div className={styles.Label}>فنر با طلق پاپکو A5:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number" }}
            suffix="تومان"
            value={springPapcoA5Price}
            onChange={setSpringPapcoA5Price}
          />
        </div>
        <div className={styles.Label}>منگنه:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number" }}
            suffix="تومان"
            value={staplerPrice}
            onChange={setStaplerPrice}
          />
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() =>
            onSave({
              [BindingType.springNormal]: {
                [PrintSize.a4]: parseInt(springNormalA4Price),
                [PrintSize.a3]: parseInt(springNormalA3Price),
                [PrintSize.a5]: parseInt(springNormalA5Price),
              },
              [BindingType.springPapco]: {
                [PrintSize.a4]: parseInt(springPapcoA4Price),
                [PrintSize.a3]: parseInt(springPapcoA3Price),
                [PrintSize.a5]: parseInt(springPapcoA5Price),
              },
              [BindingType.stapler]: parseInt(staplerPrice),
            })
          }
          disabled={
            isNaN(parseInt(springNormalA4Price)) ||
            parseInt(springNormalA4Price) < 0 ||
            isNaN(parseInt(springNormalA3Price)) ||
            parseInt(springNormalA3Price) < 0 ||
            isNaN(parseInt(springNormalA5Price)) ||
            parseInt(springNormalA5Price) < 0 ||
            isNaN(parseInt(springPapcoA4Price)) ||
            parseInt(springPapcoA4Price) < 0 ||
            isNaN(parseInt(springPapcoA3Price)) ||
            parseInt(springPapcoA3Price) < 0 ||
            isNaN(parseInt(springPapcoA5Price)) ||
            parseInt(springPapcoA5Price) < 0 ||
            isNaN(parseInt(staplerPrice)) ||
            parseInt(staplerPrice) < 0
          }
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
