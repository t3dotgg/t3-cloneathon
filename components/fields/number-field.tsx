'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { BaseFieldProps } from '../../lib/formedible/types';

export interface NumberFieldSpecificProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
}

export const NumberField: React.FC<NumberFieldSpecificProps> = ({
  fieldApi,
  label,
  description,
  placeholder,
  inputClassName,
  labelClassName,
  wrapperClassName,
  min,
  max,
  step,
}) => {
  const { name, state, handleChange, handleBlur } = fieldApi;
  const value = state.value as number | string | undefined;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      handleChange(undefined);
    } else {
      const num = parseFloat(val);
      handleChange(isNaN(num) ? val : num);
    }
  };

  let displayValue: string | number = '';
  if (typeof value === 'number') {
    displayValue = value;
  } else if (typeof value === 'string') {
    displayValue = value;
  }

  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <Label htmlFor={name} className={cn("text-sm font-medium", labelClassName)}>
          {label}
        </Label>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Input
        id={name}
        name={name}
        type="number"
        value={displayValue}
        onBlur={handleBlur}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={cn(inputClassName, state.meta.errors.length ? "border-destructive" : "")}
        disabled={fieldApi.form.state.isSubmitting}
      />
      {state.meta.isTouched && state.meta.errors.length > 0 && (
        <div className="text-xs text-destructive pt-1">
          {state.meta.errors.map((err: any, index: number) => (
            <p key={index}>{typeof err === 'string' ? err : (err as Error)?.message || 'Invalid'}</p>
          ))}
        </div>
      )}
    </div>
  );
};
