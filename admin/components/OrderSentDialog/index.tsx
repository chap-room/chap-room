import styles from "./style.module.scss";
import { useState } from "react";
import {
  optionalValidate,
  useValidation,
  validateInt,
} from "@/shared/utils/validation";
import Dialog from "@/shared/components/Dialog";
import TextInput from "@/shared/components/TextInput";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";
import ErrorList from "@/shared/components/ErrorList";
import Radio from "@/shared/components/Radio";

interface OrderSentDialogProps {
  onClose: () => void;
  onMarkOrderSent: (markOrderSentData: {
    postageMethod: string;
    trackingCode?: string;
  }) => Promise<any>;
  orderId: number;
}

export default function OrderSentDialog({
  onClose,
  onMarkOrderSent,
  orderId,
}: OrderSentDialogProps) {
  const [postageMethod, setPostageMethod] = useState<
    "expressMail" | "specialMail" | "bikeDelivery"
  >("expressMail");
  const [expressMailTrackingCode, setExpressMailTrackingCode] = useState("");
  const [specialMailTrackingCode, setSpecialMailTrackingCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formValidation = useValidation(
    {
      expressMailTrackingCode: [
        optionalValidate({
          enabled: postageMethod === "expressMail",
          validator: validateInt({ unsigned: true }),
        }),
      ],
      specialMailTrackingCode: [
        optionalValidate({
          enabled: postageMethod === "specialMail",
          validator: validateInt({ unsigned: true }),
        }),
      ],
    },
    {
      expressMailTrackingCode,
      specialMailTrackingCode,
    }
  );

  return (
    <Dialog
      title="ارسال سفارش"
      subTitle={`شماره سفارش ${orderId}`}
      open={true}
      onClose={() => onClose()}
      varient="wide"
    >
      <div className={styles.DialogContent}>
        <div>
          <div>
            <Radio
              checked={postageMethod === "expressMail"}
              onChecked={() => setPostageMethod("expressMail")}
            />
            <div>
              <div>پست پیشتاز</div>
              <div>
                <TextInput
                  inputProps={{
                    type: "number",
                    placeholder: "کد پیگیری",
                  }}
                  boxProps={{
                    style: {
                      maxWidth: 470,
                    },
                  }}
                  value={expressMailTrackingCode}
                  onChange={setExpressMailTrackingCode}
                />
              </div>
            </div>
          </div>
          <ErrorList
            errors={formValidation.errors.expressMailTrackingCode.map(
              (item) => `کد پیگیری ${item}`
            )}
          />
        </div>
        <div>
          <div>
            <Radio
              checked={postageMethod === "specialMail"}
              onChecked={() => setPostageMethod("specialMail")}
            />
            <div>
              <div>پست ویژه</div>
              <div>
                <TextInput
                  inputProps={{
                    type: "number",
                    placeholder: "کد پیگیری",
                  }}
                  boxProps={{
                    style: {
                      maxWidth: 470,
                    },
                  }}
                  value={specialMailTrackingCode}
                  onChange={setSpecialMailTrackingCode}
                />
              </div>
            </div>
          </div>
          <ErrorList
            errors={formValidation.errors.specialMailTrackingCode.map(
              (item) => `کد پیگیری ${item}`
            )}
          />
        </div>
        <div>
          <div>
            <Radio
              checked={postageMethod === "bikeDelivery"}
              onChecked={() => setPostageMethod("bikeDelivery")}
            />
            ارسال با پیک
          </div>
        </div>
      </div>
      <BottomActions>
        <Button
          varient="filled"
          onClick={() => {
            setIsSubmitting(true);
            onMarkOrderSent({
              postageMethod: {
                expressMail: "پست پیشتاز",
                specialMail: "پست ویژه",
                bikeDelivery: "ارسال با پیک",
              }[postageMethod],
              trackingCode:
                postageMethod === "expressMail"
                  ? expressMailTrackingCode
                  : postageMethod === "specialMail"
                  ? specialMailTrackingCode
                  : undefined,
            }).finally(() => setIsSubmitting(false));
          }}
          style={{ minWidth: 100, backgroundColor: "#14cc9c", fontSize: 13 }}
          loading={isSubmitting}
          disabled={isSubmitting || !formValidation.isValid}
        >
          {!isSubmitting && "ثبت"}
        </Button>
      </BottomActions>
    </Dialog>
  );
}
