import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { BaseFieldProps } from '@/lib/formedible/types';

export const CheckboxField: React.FC<BaseFieldProps> = ({
  fieldApi,
  label,
  description,
  labelClassName,
  wrapperClassName,
}) => {
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={fieldApi.name}
          checked={!!fieldApi.state.value}
          onCheckedChange={(checked) => fieldApi.handleChange(Boolean(checked))}
          onBlur={fieldApi.handleBlur}
          disabled={fieldApi.form.state.isSubmitting}
          aria-describedby={description ? `${fieldApi.name}-description` : undefined}
        />
        {label && (
          <Label htmlFor={fieldApi.name} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", labelClassName)}>
            {label}
          </Label>
        )}
      </div>
      {description && <p id={`${fieldApi.name}-description`} className="text-xs text-muted-foreground">{description}</p>}
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
