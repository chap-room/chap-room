const numberSeparator = "،";
const minus = "‎−";
export function formatNumber(value: string | number) {
  let string = typeof value === "number" ? value.toString() : value;
  const isNegative = string.startsWith("-");
  if (isNegative) string = string.substring(1);

  const formatted = string
    .split("")
    .map((char, index) =>
      index + 1 !== string.length && (string.length - index - 1) % 3 === 0
        ? char + numberSeparator
        : char
    )
    .join("");

  return isNegative ? minus + formatted : string;
}

const listSeparator = "، ";
const listLastSeparator = " و ";
export function formatList(value: string[]) {
  return value
    .map((item, index) =>
      index === 0
        ? item
        : index + 1 !== value.length
        ? listSeparator + item
        : listLastSeparator + item
    )
    .join("");
}
