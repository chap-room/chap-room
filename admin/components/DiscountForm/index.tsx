import styles from "./style.module.scss";
import { useState } from "react";
import { User, DiscountType } from "@/shared/types";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import ContentSelect from "@/shared/components/ContentSelect";
import CheckBox from "@/shared/components/CheckBox";
import Select from "@/shared/components/Select";

interface DiscountFormData {
  active: boolean;
  code: string;
  description: string;
  user: User | null;
  phoneNumber: string | null;
  discountType: DiscountType;
  discountValue: number;
  usageLimit: number | null;
  expireDate: Date | null;
}

interface DiscountFormProps {
  defaultValues?: Partial<DiscountFormData>;
  onSave: (data: DiscountFormData) => Promise<any>;
}

export default function DiscountForm({
  defaultValues,
  onSave,
}: DiscountFormProps) {
  const [active, setActive] = useState(
    defaultValues && defaultValues.active !== undefined
      ? defaultValues.active
      : true
  );
  const [code, setCode] = useState(defaultValues?.code || "");
  const [description, setDescription] = useState(
    defaultValues?.description || ""
  );
  const [forOneUser, setForOneUser] = useState(
    defaultValues ? defaultValues.user !== null : false
  );
  const [customer, setCustomer] = useState<User | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [discountType, setDiscountType] = useState(
    defaultValues?.discountType || DiscountType.countOfPages
  );
  const [discountValue, setDiscountValue] = useState(
    defaultValues?.discountValue?.toString() || ""
  );
  const [hasUsageLimit, setHasUsageLimit] = useState(
    defaultValues ? defaultValues.usageLimit !== null : false
  );
  const [usageLimit, setUsageLimit] = useState(
    defaultValues?.usageLimit?.toString() || ""
  );
  const [hasExpireDate, setHasExpireDate] = useState(
    defaultValues ? defaultValues.expireDate !== null : false
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <div className={styles.Form}>
        <div className={styles.OptionalInput}>
          <div className={styles.CheckBoxWithLabel}>
            <CheckBox checked={active} onChange={setActive} /> این کد تخفیف فعال
            است
          </div>
        </div>
        <div className={styles.Separator} />
        <div className={styles.Label}>کد:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ placeholder: "کد" }}
            value={code}
            onChange={setCode}
          />
        </div>
        <div className={styles.Label}>توضیحات:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{ placeholder: "توضیحات" }}
            value={description}
            onChange={setDescription}
          />
        </div>
        <div className={styles.Separator} />
        <div className={styles.OptionalInput}>
          <div className={styles.CheckBoxWithLabel}>
            <CheckBox checked={forOneUser} onChange={setForOneUser} />{" "}
            مختص یک مشتری است
          </div>
          {forOneUser && (
            <div>
              <div className={styles.Input}>
                <TextInput
                  inputProps={{ type: "number", placeholder: "کاربر" }}
                  value={customer?.id.toString()}
                  // onChange={}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.Separator} />
        <div className={styles.Label}>نوع تخفیف:</div>
        <div className={styles.Input}>
          <ContentSelect
            options={Object.values(DiscountType)}
            value={discountType}
            onChange={(newValue) => setDiscountType(newValue as DiscountType)}
          />
        </div>
        <div className={styles.Label}>مقدار تخفیف:</div>
        <div className={styles.Input}>
          <TextInput
            inputProps={{
              type: "number",
              placeholder: "مقدار تخفیف",
            }}
            suffix={
              discountType === DiscountType.fixedAmount
                ? "تومان"
                : discountType === DiscountType.countOfPages
                ? "صفحه"
                : "درصد"
            }
            value={discountValue}
            onChange={setDiscountValue}
          />
        </div>
        <div className={styles.Separator} />
        <div className={styles.OptionalInput}>
          <div className={styles.CheckBoxWithLabel}>
            <CheckBox checked={hasUsageLimit} onChange={setHasUsageLimit} />{" "}
            دارای محدودیت استفاده است
          </div>
          {hasUsageLimit && (
            <div>
              <div className={styles.Input}>
                <TextInput
                  inputProps={{
                    type: "number",
                    placeholder: "محدودیت استفاده",
                  }}
                  suffix="بار"
                  value={usageLimit}
                  onChange={setUsageLimit}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.Separator} />
        <div className={styles.OptionalInput}>
          <div className={styles.CheckBoxWithLabel}>
            <CheckBox checked={hasExpireDate} onChange={setHasExpireDate} />{" "}
            دارای تاریخ انقضا است
          </div>
          {hasExpireDate && <div>2022-07-13T07:24:52</div>}
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() => {
            setIsSubmitting(true);
            onSave({
              active,
              code,
              description,
              user: forOneUser ? customer : null,
              phoneNumber,
              discountType,
              discountValue: parseInt(discountValue),
              usageLimit: hasUsageLimit ? parseInt(usageLimit) : null,
              expireDate: hasExpireDate
                ? new Date("2022-07-13T07:24:52")
                : null, // TODO
            }).finally(() => setIsSubmitting(false));
          }}
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            !code ||
            (forOneUser && !customer && !phoneNumber) ||
            isNaN(parseInt(discountValue)) ||
            parseInt(discountValue) < 0 ||
            (discountType === DiscountType.percentage &&
              parseInt(discountValue) > 100) ||
            (hasUsageLimit && isNaN(parseInt(usageLimit))) ||
            (hasUsageLimit && parseInt(usageLimit) < 0)
          }
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
