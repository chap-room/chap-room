import styles from "./style.module.scss";
import { useState } from "react";
import { useValidation, validateInt } from "@/shared/utils/validation";
import TextInput from "@/shared/components/TextInput";
import ErrorList from "@/shared/components/ErrorList";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";

interface BookPriceFormProps {
  bookSize: "rahli" | "raqai" | "vaziri";
  bookPaperType: "writing80Grams";
  bookBindingType: "hotGlue";
  defaultValue: number;
  onSave: (data: number) => Promise<any>;
}

export default function BookPriceForm({
  bookSize,
  bookPaperType,
  bookBindingType,
  defaultValue,
  onSave,
}: BookPriceFormProps) {
  const [price, setPrice] = useState(defaultValue?.toString() || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formValidation = useValidation(
    {
      price: [validateInt({ unsigned: true, min: 1 })],
    },
    {
      price,
    }
  );

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.Label}>قطع کتاب:</div>
        <div className={styles.Input}>
          <TextInput
            value={{ rahli: "رحلی", raqai: "رقعی", vaziri: "وزیری" }[bookSize]}
            readOnly
          />
        </div>
        <div className={styles.Label}>نوع کاغذ:</div>
        <div className={styles.Input}>
          <TextInput
            value={
              {
                writing80Grams: "تحریر 80 گرمی",
              }[bookPaperType]
            }
            readOnly
          />
        </div>
        <div className={styles.Label}>نوع صحافی:</div>
        <div className={styles.Input}>
          <TextInput
            value={
              {
                hotGlue: "چسب گرم",
              }[bookBindingType]
            }
            readOnly
          />
        </div>
        <div className={styles.Label}>قیمت هر صفحه:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ type: "number", placeholder: "قیمت هر صفحه" }}
            value={price}
            onChange={setPrice}
          />
          <ErrorList errors={formValidation.errors.price} />
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() => {
            setIsSubmitting(true);
            onSave(parseInt(price)).finally(() => setIsSubmitting(false));
          }}
          loading={isSubmitting}
          disabled={isSubmitting || !formValidation.isValid}
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
