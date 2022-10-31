import styles from "./style.module.scss";
import { useState } from "react";
import { User, DiscountType } from "@/shared/types";
import TextInput from "@/shared/components/TextInput";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import ContentSelect from "@/shared/components/ContentSelect";
import CheckBox from "@/shared/components/CheckBox";
import Select from "@/shared/components/Select";

interface DiscountCodeFormData {
  active: boolean;
  code: string;
  description: string;
  customer: User | null;
  discountType: DiscountType;
  discountValue: number;
  percentageDiscountCeiling: number | null;
  minOrderAmount: number | null;
  maxOrderAmount: number | null;
  minPageCount: number | null;
  maxPageCount: number | null;
  usageLimit: number | null;
  timesUsed: number | null;
  expirationDate: Date | null;
}

interface DiscountCodeFormProps {
  defaultValues?: Partial<DiscountCodeFormData>;
  onSave: (data: DiscountCodeFormData) => void;
}

export default function DiscountCodeForm({
  defaultValues,
  onSave,
}: DiscountCodeFormProps) {
  const [active, setActive] = useState(
    defaultValues && defaultValues.active !== undefined
      ? defaultValues.active
      : true
  );
  const [code, setCode] = useState(defaultValues?.code || "");
  const [description, setDescription] = useState(
    defaultValues?.description || ""
  );
  const [forOneCustomer, setForOneCustomer] = useState(
    defaultValues ? defaultValues.customer !== null : false
  );
  const [customer, setCustomer] = useState<User | null>(null);
  const [discountType, setDiscountType] = useState(
    defaultValues?.discountType || DiscountType.numberOfPages
  );
  const [discountValue, setDiscountValue] = useState(
    defaultValues?.discountValue?.toString() || ""
  );
  const [hasPercentageDiscountCeiling, setHasPercentageDiscountCeiling] =
    useState(
      defaultValues ? defaultValues.percentageDiscountCeiling !== null : false
    );
  const [percentageDiscountCeiling, setPercentageDiscountCeiling] = useState(
    defaultValues?.percentageDiscountCeiling?.toString() || ""
  );
  const [hasMinOrderAmount, setHasMinOrderAmount] = useState(
    defaultValues ? defaultValues.minOrderAmount !== null : false
  );
  const [minOrderAmount, setMinOrderAmount] = useState(
    defaultValues?.minOrderAmount?.toString() || ""
  );
  const [hasMaxOrderAmount, setHasMaxOrderAmount] = useState(
    defaultValues ? defaultValues.maxOrderAmount !== null : false
  );
  const [maxOrderAmount, setMaxOrderAmount] = useState(
    defaultValues?.maxOrderAmount?.toString() || ""
  );
  const [hasMinPageCount, setHasMinPageCount] = useState(
    defaultValues ? defaultValues.minPageCount !== null : false
  );
  const [minPageCount, setMinPageCount] = useState(
    defaultValues?.minPageCount?.toString() || ""
  );
  const [hasMaxPageCount, setHasMaxPageCount] = useState(
    defaultValues ? defaultValues.maxPageCount !== null : false
  );
  const [maxPageCount, setMaxPageCount] = useState(
    defaultValues?.maxPageCount?.toString() || ""
  );
  const [hasUsageLimit, setHasUsageLimit] = useState(
    defaultValues ? defaultValues.usageLimit !== null : false
  );
  const [usageLimit, setUsageLimit] = useState(
    defaultValues?.usageLimit?.toString() || ""
  );
  const [hasExpirationDate, setHasExpirationDate] = useState(
    defaultValues ? defaultValues.expirationDate !== null : false
  );

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
            <CheckBox checked={forOneCustomer} onChange={setForOneCustomer} />{" "}
            مختص یک مشتری است
          </div>
          {forOneCustomer && (
            <div>
              <div className={styles.Input}>
                <Select
                  placeholder="کاربر"
                  options={{}}
                  value={customer?.id || null}
                  onChange={(newValue) => setCustomer(null)} // TODO find user based on newValue(userId)
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
                : discountType === DiscountType.numberOfPages
                ? "صفحه"
                : "درصد"
            }
            value={discountValue}
            onChange={setDiscountValue}
          />
        </div>
        {discountType === DiscountType.percentage && (
          <>
            <div className={styles.Separator} />
            <div className={styles.OptionalInput}>
              <div className={styles.CheckBoxWithLabel}>
                <CheckBox
                  checked={hasPercentageDiscountCeiling}
                  onChange={setHasPercentageDiscountCeiling}
                />{" "}
                دارای سقف تخفیف درصدی است
              </div>
              {hasPercentageDiscountCeiling && (
                <div>
                  <div className={styles.Input}>
                    <TextInput
                      inputProps={{
                        type: "number",
                        placeholder: "سقف تخفیف درصدی",
                      }}
                      suffix="تومان"
                      value={percentageDiscountCeiling}
                      onChange={setPercentageDiscountCeiling}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        <div className={styles.Separator} />
        <div className={styles.OptionalInput}>
          <div className={styles.CheckBoxWithLabel}>
            <CheckBox
              checked={hasMinOrderAmount}
              onChange={setHasMinOrderAmount}
            />{" "}
            دارای حداقل مبلغ سفارش است
          </div>
          {hasMinOrderAmount && (
            <div>
              <div className={styles.Input}>
                <TextInput
                  inputProps={{
                    type: "number",
                    placeholder: "حداقل مبلغ سفارش",
                  }}
                  suffix="تومان"
                  value={minOrderAmount}
                  onChange={setMinOrderAmount}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.Separator} />
        <div className={styles.OptionalInput}>
          <div className={styles.CheckBoxWithLabel}>
            <CheckBox
              checked={hasMaxOrderAmount}
              onChange={setHasMaxOrderAmount}
            />{" "}
            دارای حداکثر مبلغ سفارش است
          </div>
          {hasMaxOrderAmount && (
            <div>
              <div className={styles.Input}>
                <TextInput
                  inputProps={{
                    type: "number",
                    placeholder: "حداکثر مبلغ سفارش",
                  }}
                  suffix="تومان"
                  value={maxOrderAmount}
                  onChange={setMaxOrderAmount}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.Separator} />
        <div className={styles.OptionalInput}>
          <div className={styles.CheckBoxWithLabel}>
            <CheckBox checked={hasMinPageCount} onChange={setHasMinPageCount} />{" "}
            دارای حداقل تعداد صفحات است
          </div>
          {hasMinPageCount && (
            <div>
              <div className={styles.Input}>
                <TextInput
                  inputProps={{
                    type: "number",
                    placeholder: "حداقل تعداد صفحات",
                  }}
                  suffix="صفحه"
                  value={minPageCount}
                  onChange={setMinPageCount}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.Separator} />
        <div className={styles.OptionalInput}>
          <div className={styles.CheckBoxWithLabel}>
            <CheckBox checked={hasMaxPageCount} onChange={setHasMaxPageCount} />{" "}
            دارای حداکثر تعداد صفحات است
          </div>
          {hasMaxPageCount && (
            <div>
              <div className={styles.Input}>
                <TextInput
                  inputProps={{
                    type: "number",
                    placeholder: "حداکثر تعداد صفحات",
                  }}
                  suffix="صفحه"
                  value={maxPageCount}
                  onChange={setMaxPageCount}
                />
              </div>
            </div>
          )}
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
            <CheckBox
              checked={hasExpirationDate}
              onChange={setHasExpirationDate}
            />{" "}
            دارای تاریخ انقضا است
          </div>
          {hasExpirationDate && <div>2022-07-13T07:24:52</div>}
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() =>
            onSave({
              active,
              code,
              description,
              customer: forOneCustomer ? customer : null,
              discountType,
              discountValue: parseInt(discountValue),
              percentageDiscountCeiling: hasPercentageDiscountCeiling
                ? parseInt(percentageDiscountCeiling)
                : null,
              minOrderAmount: hasMinOrderAmount
                ? parseInt(minOrderAmount)
                : null,
              maxOrderAmount: hasMaxOrderAmount
                ? parseInt(maxOrderAmount)
                : null,
              minPageCount: hasMinPageCount ? parseInt(minPageCount) : null,
              maxPageCount: hasMaxPageCount ? parseInt(maxPageCount) : null,
              usageLimit: hasUsageLimit ? parseInt(usageLimit) : null,
              timesUsed: 0,
              expirationDate: hasExpirationDate
                ? new Date("2022-07-13T07:24:52")
                : null, // TODO
            })
          }
          disabled={
            !code ||
            (forOneCustomer && customer === null) ||
            isNaN(parseInt(discountValue)) ||
            parseInt(discountValue) < 0 ||
            (discountType === DiscountType.percentage &&
              parseInt(discountValue) > 100) ||
            (hasPercentageDiscountCeiling &&
              isNaN(parseInt(percentageDiscountCeiling))) ||
            (hasPercentageDiscountCeiling &&
              parseInt(percentageDiscountCeiling) < 0) ||
            (hasMinOrderAmount && isNaN(parseInt(minOrderAmount))) ||
            (hasMinOrderAmount && parseInt(minOrderAmount) < 0) ||
            (hasMaxOrderAmount && isNaN(parseInt(maxOrderAmount))) ||
            (hasMaxOrderAmount && parseInt(maxOrderAmount) < 0) ||
            (hasMinPageCount && isNaN(parseInt(minPageCount))) ||
            (hasMinPageCount && parseInt(minPageCount) < 0) ||
            (hasMaxPageCount && isNaN(parseInt(maxPageCount))) ||
            (hasMaxPageCount && parseInt(maxPageCount) < 0) ||
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
