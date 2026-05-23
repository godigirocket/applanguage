import { DynamicIcon as CustomDynamicIcon } from "./CustomIcons";

interface DynamicIconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  [key: string]: any;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  return <CustomDynamicIcon name={name} {...props} />;
}
