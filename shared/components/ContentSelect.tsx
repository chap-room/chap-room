import Select from "@/shared/components/Select";

interface ContentSelectProps {
  placeholder?: string;
  options: string[];
  value: string | null;
  onChange: (newValue: any) => void;
  varient?: "outlined" | "shadow";
  readOnly?: boolean;
}

export default function ContentSelect({
  placeholder,
  options,
  value,
  onChange,
  varient,
  readOnly,
}: ContentSelectProps) {
  const optionsObject: Record<string, string> = {};
  options.forEach((option) => (optionsObject[option] = option));

  return (
    <Select
      placeholder={placeholder}
      options={optionsObject}
      value={value}
      onChange={onChange}
      varient={varient}
      readOnly={readOnly}
    />
  );
}
