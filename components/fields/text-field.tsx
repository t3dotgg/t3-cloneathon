'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { BaseFieldProps } from '../../lib/formedible/types';

export interface TextFieldSpecificProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'datetime-local';
}

export const TextField: React.FC<TextFieldSpecificProps> = ({
  fieldApi,
  label,
  description,
  placeholder,
  inputClassName,
  labelClassName,
  wrapperClassName,
  type = 'text',
}) => {
  const { name, state, handleChange, handleBlur } = fieldApi;
  const value = state.value as string | number | undefined;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
  };

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
        type={type}
        value={value === undefined || value === null ? '' : String(value)}
        onBlur={handleBlur}
        onChange={onChange}
        placeholder={placeholder}
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
