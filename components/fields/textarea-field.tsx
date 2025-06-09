import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { BaseFieldProps } from '../../lib/formedible/types';

export interface TextareaFieldSpecificProps extends BaseFieldProps {
  rows?: number;
}

export const TextareaField: React.FC<TextareaFieldSpecificProps> = ({
  fieldApi,
  label,
  placeholder,
  description,
  rows = 3,
  inputClassName,
  labelClassName,
  wrapperClassName,
}) => {
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <Label htmlFor={fieldApi.name} className={cn("text-sm font-medium", labelClassName)}>
          {label}
        </Label>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Textarea
        id={fieldApi.name}
        name={fieldApi.name}
        value={(fieldApi.state.value as string) || ''}
        onBlur={fieldApi.handleBlur}
        onChange={(e) => fieldApi.handleChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(inputClassName, fieldApi.state.meta.errors.length ? "border-destructive" : "")}
        disabled={fieldApi.form.state.isSubmitting}
      />
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
