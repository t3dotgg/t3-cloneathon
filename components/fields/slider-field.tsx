import React from 'react';
import type { AnyFieldApi } from '@tanstack/react-form';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { BaseFieldProps } from '../../lib/formedible/types';

export interface SliderFieldSpecificProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
  valueLabelPrefix?: string; // E.g., "Temperature"
  valueLabelSuffix?: string; // E.g., "FPS" 
  valueDisplayPrecision?: number; // For toFixed()
  showRawValue?: boolean; // Optionally show raw value next to formatted one
}

export const SliderField: React.FC<SliderFieldSpecificProps> = ({
  fieldApi,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  valueLabelPrefix = '',
  valueLabelSuffix = '',
  valueDisplayPrecision = 0,
  showRawValue = false,
  wrapperClassName,
  inputClassName,
  labelClassName,
}) => {
  const { name, state, handleChange, handleBlur } = fieldApi;
  const fieldValue = typeof state.value === 'number' ? state.value : min;
  const displayValue = fieldValue.toFixed(valueDisplayPrecision);

  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <Label htmlFor={name} className={cn("text-sm font-medium", labelClassName)}>
          {label} ({valueLabelPrefix}{displayValue}{valueLabelSuffix})
          {showRawValue && <span className="text-xs text-muted-foreground ml-2">(Raw: {state.value})</span>}
        </Label>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Slider
        id={name}
        name={name}
        value={[fieldValue]} // Slider expects an array
        onValueChange={(valueArray) => handleChange(valueArray[0])} // Send single number to form state
        onBlur={handleBlur}
        disabled={fieldApi.form.state.isSubmitting}
        min={min}
        max={max}
        step={step}
        className={cn(inputClassName, state.meta.errors.length ? "border-destructive" : "")}
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