import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { BaseFieldProps } from '@/lib/formedible/types';

interface SelectFieldSpecificProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }> | string[];
}

export const SelectField: React.FC<SelectFieldSpecificProps> = ({
  fieldApi,
  label,
  placeholder,
  description,
  options = [],
  inputClassName,
  labelClassName,
  wrapperClassName,
}) => {
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <Label htmlFor={fieldApi.name + "-trigger"} className={cn("text-sm font-medium", labelClassName)}>
          {label}
        </Label>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Select
        value={(fieldApi.state.value as string) || ''}
        onValueChange={(value) => fieldApi.handleChange(value)}
        disabled={fieldApi.form.state.isSubmitting}
      >
        <SelectTrigger
          id={fieldApi.name + "-trigger"}
          onBlur={fieldApi.handleBlur}
          className={cn(inputClassName, fieldApi.state.meta.errors.length ? "border-destructive" : "")}
        >
          <SelectValue placeholder={placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => {
            const value = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            return (
              <SelectItem key={value + index} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {fieldApi.state.meta.isTouched && fieldApi.state.meta.errors.length > 0 && (
        <div className="text-xs text-destructive pt-1">
          {fieldApi.state.meta.errors.map((err: any, index: number) => (
            <p key={index}>{String(err)}</p>
          ))}
        </div>
      )}
    </div>
  );
};
