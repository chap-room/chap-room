import { useMemo } from "react";
import moment, { Moment } from "jalali-moment";

interface FormattedDateProps {
  value: string | Date | Moment;
}

export function FormattedDate({ value }: FormattedDateProps) {
  const momentValue = useMemo(
    () => (moment.isMoment(value) ? value : moment(value)),
    [value]
  );

  return <>{momentValue.format("jYYYY/jMM/jDD")}</>;
}

interface FormattedTimeProps {
  value: string | Date | Moment;
}

export function FormattedTime({ value }: FormattedTimeProps) {
  const momentValue = useMemo(
    () => (moment.isMoment(value) ? value : moment(value)),
    [value]
  );

  return <>{momentValue.format("HH:mm:ss")}</>;
}
