import { useRef } from "react";
import { englishToPersianNumbers } from "@/shared/utils/numbers";

type Validator = (value: any) => string | void;

export function useValidation<VT extends Record<string, any>>(
  validators: {
    [K in keyof VT]: Validator[];
  },
  value: VT
) {
  const editedValues = useRef<string[]>([]);
  const lastValue = useRef<VT>({} as VT);

  for (let item in lastValue.current) {
    if (
      !editedValues.current.includes(item) &&
      lastValue.current[item] !== value[item]
    ) {
      editedValues.current.push(item);
    }
  }

  let isValid = true;
  const errors = {} as { [K in keyof VT]: string[] };

  for (let item in value) {
    const itemErrors: string[] = [];

    for (let validator of validators[item]) {
      const result = validator(value[item]);
      if (result) {
        if (editedValues.current.includes(item)) {
          itemErrors.push(result);
        }
        isValid = false;
      }
    }

    errors[item] = itemErrors;
  }

  lastValue.current = value;
  return { isValid, errors };
}

export function validateLength(options: {
  length?: number;
  min?: number;
  max?: number;
}): Validator {
  return (value: string) => {
    if (options.length !== undefined && value.length !== options.length)
      return `باید ${englishToPersianNumbers(
        options.length
      )} کاراکتر داشته باشد`;
    if (options.min !== undefined && value.length < options.min)
      return `باید حداقل ${englishToPersianNumbers(
        options.min
      )} کاراکتر داشته باشد`;
    if (options.max !== undefined && value.length > options.max)
      return `باید حداکثر ${englishToPersianNumbers(
        options.max
      )} کاراکتر داشته باشد`;
  };
}

export function optionalValidate(options: {
  enabled: boolean;
  validator: Validator;
}): Validator {
  return (value) => {
    if (options.enabled) return options.validator(value);
  };
}

export function validateInt(options?: {
  length?: number;
  unsigned?: boolean;
  min?: number;
  max?: number;
}): Validator {
  return (value: string) => {
    if (
      isNaN(parseInt(value)) ||
      (options?.unsigned && !(parseInt(value) >= 0))
    )
      return "باید عدد باشد";
    if (
      options?.length !== undefined &&
      parseInt(value).toString().length !== options?.length // Remove '+' or '--' Character
    )
      return `باید ${englishToPersianNumbers(options.length)} رقم داشته باشد`;
    if (options?.min !== undefined && parseInt(value) < options.min)
      return `باید حداقل ${englishToPersianNumbers(options.min)} باشد`;
    if (options?.max !== undefined && parseInt(value) > options.max)
      return `باید حداکثر ${englishToPersianNumbers(options.max)} باشد`;
  };
}

export function validatePhoneNumber(): Validator {
  return (value: string) => {
    if (
      validateLength({ length: 11 })(value) ||
      validateInt({ length: 10, unsigned: true })(value) || // the 0 in start will be remove in int
      !value.startsWith("09")
    )
      return "شماره موبایل نامعتبر است";
  };
}

export function validateNotEmpty(options?: { message?: string }): Validator {
  return (value: any) => {
    if (Array.isArray(value) ? !value.length : !value)
      return options?.message || "نباید خالی باشد";
  };
}

export function validatePasswordRepeat(password: string): Validator {
  return (value: string) => {
    if (value !== password) return "رمزهای عبور باید مطابقت داشته باشند";
  };
}
