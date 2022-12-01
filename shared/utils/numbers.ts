const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function convertNumbers(
  numbers: string | number,
  preserveOtherChars: boolean = true,
  from: string[],
  to: string[]
) {
  return (typeof numbers === "number" ? numbers.toString() : numbers)
    .split("")
    .map((char) => {
      if (from.includes(char)) return to[from.indexOf(char)];
      if (preserveOtherChars || to.includes(char)) return char;
      return "";
    })
    .join("");
}

export function englishToPersianNumbers(
  numbers: string | number,
  preserveOtherChars?: boolean
) {
  return convertNumbers(
    numbers,
    preserveOtherChars,
    englishNumbers,
    persianNumbers
  );
}

export function persianToEnglishNumbers(
  numbers: string | number,
  preserveOtherChars?: boolean
) {
  return convertNumbers(
    numbers,
    preserveOtherChars,
    persianNumbers,
    englishNumbers
  );
}
