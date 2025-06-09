import type { AnyFieldApi } from '@tanstack/react-form';

// Props that all basic field components rendered by FormedibleRoot will receive
export interface BaseFieldProps {
  fieldApi: AnyFieldApi;
  label?: string;
  description?: string; // Added description
  placeholder?: string;
  inputClassName?: string;   // For the <Input /> component itself
  labelClassName?: string;   // For the <Label /> component
  wrapperClassName?: string; // For the div wrapping label and input
} 