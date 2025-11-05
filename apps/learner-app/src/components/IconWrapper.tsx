import { LucideIcon } from 'lucide-react';
import { ComponentType } from 'react';

// Workaround for React 19 compatibility with Lucide icons
export const IconWrapper = ({ Icon, className, ...props }: { 
  Icon: LucideIcon; 
  className?: string; 
  [key: string]: any; 
}) => {
  const IconComponent = Icon as ComponentType<any>;
  return <IconComponent className={className} {...props} />;
};