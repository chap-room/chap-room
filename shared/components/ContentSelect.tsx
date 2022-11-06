import Select from "@/shared/components/Select";

interface ContentSelectProps {
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  varient?: "outlined" | "shadow";
  readOnly?: boolean;
};

export default function ContentSelect({
  placeholder,
  options,
  value,
  onChange,
  varient,
  readOnly,
}: ContentSelectProps) {
  const optionsObject: Record<string, string> = {}
  if (placeholder) optionsObject[placeholder] = placeholder;
  options.forEach((option) => (optionsObject[option] = option));

  return (
    <Select
      options={optionsObject}
      value={value}
      onChange={onChange}
      varient={varient}
      readOnly={readOnly}
    />
  );
}
