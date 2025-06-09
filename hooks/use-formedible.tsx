"use client";
import React, { useState, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TextField } from "@/components/fields/text-field";
import { TextareaField } from "@/components/fields/textarea-field";
import { SelectField } from "@/components/fields/select-field";
import { CheckboxField } from "@/components/fields/checkbox-field";
import { SwitchField } from "@/components/fields/switch-field";
import { NumberField } from "@/components/fields/number-field";
import { DateField } from "@/components/fields/date-field";
import { SliderField } from "@/components/fields/slider-field";
import { FileUploadField } from "@/components/fields/file-upload-field";

interface FormProps {
  className?: string;
  children?: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

interface FieldConfig {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
  component?: React.ComponentType<any>;
  wrapper?: React.ComponentType<{ children: React.ReactNode; field: FieldConfig }>;
  page?: number;
  validation?: z.ZodSchema<any>;
  dependencies?: string[];
  conditional?: (values: any) => boolean;
}

interface PageConfig {
  page: number;
  title?: string;
  description?: string;
  component?: React.ComponentType<{ 
    children: React.ReactNode; 
    title?: string; 
    description?: string; 
    page: number;
    totalPages: number;
  }>;
}

interface ProgressConfig {
  component?: React.ComponentType<{ 
    value: number; 
    currentPage: number; 
    totalPages: number; 
    className?: string;
  }>;
  showSteps?: boolean;
  showPercentage?: boolean;
  className?: string;
}

interface UseFormedibleOptions<TFormValues> {
  fields?: FieldConfig[];
  schema?: z.ZodSchema<TFormValues>;
  submitLabel?: string;
  nextLabel?: string;
  previousLabel?: string;
  formClassName?: string;
  fieldClassName?: string;
  pages?: PageConfig[];
  progress?: ProgressConfig;
  defaultComponents?: {
    [key: string]: React.ComponentType<any>;
  };
  globalWrapper?: React.ComponentType<{ children: React.ReactNode; field: FieldConfig }>;
  formOptions?: Partial<{
    defaultValues: TFormValues;
    onSubmit: (props: { value: TFormValues; formApi: any }) => any | Promise<any>;
    onSubmitInvalid: (props: { value: TFormValues; formApi: any }) => void;
    asyncDebounceMs: number;
    canSubmitWhenInvalid: boolean;
    validators: {
      onChange?: z.ZodSchema<any>;
      onBlur?: z.ZodSchema<any>;
      onSubmit?: z.ZodSchema<any>;
    };
  }>;
  onPageChange?: (page: number, direction: 'next' | 'previous') => void;
}

const defaultFieldComponents: Record<string, React.ComponentType<any>> = {
  text: TextField,
  email: TextField,
  password: TextField,
  url: TextField,
  textarea: TextareaField,
  select: SelectField,
  checkbox: CheckboxField,
  switch: SwitchField,
  number: NumberField,
  date: DateField,
  slider: SliderField,
  file: FileUploadField,
};

const DefaultProgressComponent: React.FC<{
  value: number;
  currentPage: number;
  totalPages: number;
  className?: string;
}> = ({ value, currentPage, totalPages, className }) => (
  <div className={cn("space-y-2", className)}>
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>Step {currentPage} of {totalPages}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <Progress value={value} className="h-2" />
  </div>
);

const DefaultPageComponent: React.FC<{
  children: React.ReactNode;
  title?: string;
  description?: string;
  page: number;
  totalPages: number;
}> = ({ children, title, description }) => (
  <div className="space-y-6">
    {(title || description) && (
      <div className="space-y-2">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export function useFormedible<TFormValues extends Record<string, any>>(
  options: UseFormedibleOptions<TFormValues>
) {
  const {
    fields = [],
    schema,
    submitLabel = "Submit",
    nextLabel = "Next",
    previousLabel = "Previous",
    formClassName,
    fieldClassName,
    pages = [],
    progress,
    defaultComponents = {},
    globalWrapper,
    formOptions,
    onPageChange,
  } = options;

  const [currentPage, setCurrentPage] = useState(1);

  // Combine default components with user overrides
  const fieldComponents = { ...defaultFieldComponents, ...defaultComponents };

  // Group fields by pages
  const fieldsByPage = useMemo(() => {
    const grouped: { [page: number]: FieldConfig[] } = {};
    
    fields.forEach(field => {
      const page = field.page || 1;
      if (!grouped[page]) grouped[page] = [];
      grouped[page].push(field);
    });

    return grouped;
  }, [fields]);

  const totalPages = Math.max(...Object.keys(fieldsByPage).map(Number), 1);
  const hasPages = totalPages > 1;

  // Calculate progress
  const progressValue = hasPages ? ((currentPage - 1) / (totalPages - 1)) * 100 : 100;

  // Setup form with schema validation if provided
  const formConfig = {
    ...formOptions,
    ...(schema && {
      validators: {
        onChange: schema,
        ...formOptions?.validators,
      }
    })
  };

  const form = useForm(formConfig as any);

  const getCurrentPageFields = () => fieldsByPage[currentPage] || [];

  const getCurrentPageConfig = () => pages.find(p => p.page === currentPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage, 'next');
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage, 'previous');
    }
  };

  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;

  const Form: React.FC<FormProps> = ({ className, children, onSubmit }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (onSubmit) {
        onSubmit(e);
      } else if (isLastPage) {
        form.handleSubmit();
      } else {
        goToNextPage();
      }
    };

    const formClass = cn("space-y-6", formClassName, className);

    const renderField = (fieldConfig: FieldConfig, formValues?: any) => {
      const { 
        name, 
        type, 
        label, 
        placeholder, 
        description, 
        options,
        min,
        max,
        step,
        accept,
        multiple,
        component: CustomComponent,
        wrapper: CustomWrapper,
        conditional,
        validation
      } = fieldConfig;

      return (
        <form.Field 
          key={name} 
          name={name as keyof TFormValues & string}
          validators={validation ? { onChange: validation } : undefined}
        >
          {(field) => {
            // Get current form values directly from the field
            const currentValues = field.form.state.values;
            
            // Check conditional rendering with current form values
            if (conditional && !conditional(currentValues)) {
              return null;
            }

            const baseProps = {
              fieldApi: field,
              label,
              placeholder,
              description,
              wrapperClassName: fieldClassName,
              min,
              max,
              step,
              accept,
              multiple,
            };

            // Select the component to use
            const FieldComponent = CustomComponent || fieldComponents[type] || TextField;

            // Add type-specific props
            const props = type === 'select' 
              ? { ...baseProps, options: options || [] }
              : { ...baseProps, type: ['text', 'email', 'password', 'url'].includes(type) ? type : undefined };

            // Render the field component
            const fieldElement = <FieldComponent {...props} />;

            // Apply custom wrapper or global wrapper
            const Wrapper = CustomWrapper || globalWrapper;
            
            return Wrapper 
              ? <Wrapper field={fieldConfig}>{fieldElement}</Wrapper>
              : fieldElement;
          }}
        </form.Field>
      );
    };

    const renderPageContent = () => {
      const currentFields = getCurrentPageFields();
      const pageConfig = getCurrentPageConfig();
      
      return (
        <form.Subscribe selector={(state) => state.values}>
          {(state) => {
            const values = (state as any).values;
            const fieldsToRender = currentFields.map(field => 
              renderField(field, values)
            ).filter(Boolean);

            const PageComponent = pageConfig?.component || DefaultPageComponent;

            return (
              <PageComponent
                title={pageConfig?.title}
                description={pageConfig?.description}
                page={currentPage}
                totalPages={totalPages}
              >
                {fieldsToRender}
              </PageComponent>
            );
          }}
        </form.Subscribe>
      );
    };

    const renderProgress = () => {
      if (!hasPages || !progress) return null;

      const ProgressComponent = progress.component || DefaultProgressComponent;
      
      return (
        <ProgressComponent
          value={progressValue}
          currentPage={currentPage}
          totalPages={totalPages}
          className={progress.className}
        />
      );
    };

    const renderNavigation = () => {
      if (!hasPages) {
        return (
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {(state) => {
              const { canSubmit, isSubmitting } = state as any;
              return (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Submitting..." : submitLabel}
                </Button>
              );
            }}
          </form.Subscribe>
        );
      }

      return (
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {(state) => {
            const { canSubmit, isSubmitting } = state as any;
            return (
              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousPage}
                  disabled={isFirstPage}
                  className={isFirstPage ? "invisible" : ""}
                >
                  {previousLabel}
                </Button>
                
                <Button
                  type="submit"
                  disabled={(!canSubmit || isSubmitting) && isLastPage}
                  className="flex-1 max-w-xs"
                >
                  {isSubmitting && isLastPage
                    ? "Submitting..."
                    : isLastPage
                    ? submitLabel
                    : nextLabel}
                </Button>
              </div>
            );
          }}
        </form.Subscribe>
      );
    };

    return (
      <form onSubmit={handleSubmit} className={formClass}>
        {children || (
          <>
            {renderProgress()}
            {renderPageContent()}
            {renderNavigation()}
          </>
        )}
      </form>
    );
  };

  return {
    form,
    Form,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setCurrentPage,
    isFirstPage,
    isLastPage,
    progressValue,
  };
}
