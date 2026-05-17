import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback icon if the name is not found
    return <Icons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
}
