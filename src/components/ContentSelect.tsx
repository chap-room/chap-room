import Select from "./Select";

type ContentSelectProps = {
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

export default function ContentSelect({
  placeholder,
  options,
  onChange,
  value,
  readOnly,
}: ContentSelectProps) {
  const optionsObject: Record<string, string> = {}
  if (placeholder) optionsObject[placeholder] = placeholder;
  options.forEach((option) => (optionsObject[option] = option));

  return (
    <Select
      options={optionsObject}
      onChange={onChange}
      value={value}
      readOnly={readOnly}
    />
  );
}
