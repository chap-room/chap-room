const numberSeparator = "،";
export function formatNumber(value: string | number) {
  const string = typeof value === "number" ? value.toString() : value;
  return string
    .split("")
    .map((char, index) =>
      index + 1 !== string.length && (string.length - index - 1) % 3 === 0
        ? char + numberSeparator
        : char
    )
    .join("");
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
