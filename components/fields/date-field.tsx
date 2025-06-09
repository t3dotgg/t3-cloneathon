import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import type { BaseFieldProps } from '@/lib/formedible/types';

export const DateField: React.FC<BaseFieldProps> = ({
  fieldApi,
  label,
  placeholder = "Pick a date",
  description,
  inputClassName,
  labelClassName,
  wrapperClassName,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedDate = fieldApi.state.value
    ? fieldApi.state.value instanceof Date
      ? fieldApi.state.value
      : typeof fieldApi.state.value === 'string'
        ? parseISO(fieldApi.state.value)
        : undefined
    : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    fieldApi.handleChange(date);
    fieldApi.handleBlur();
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      {label && (
        <Label htmlFor={fieldApi.name + "-trigger"} className={cn("text-sm font-medium", labelClassName)}>
          {label}
        </Label>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id={fieldApi.name + "-trigger"}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              inputClassName,
              fieldApi.state.meta.errors.length ? "border-destructive" : ""
            )}
            disabled={fieldApi.form.state.isSubmitting}
            onBlur={fieldApi.handleBlur}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={fieldApi.form.state.isSubmitting}
          />
        </PopoverContent>
      </Popover>
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
