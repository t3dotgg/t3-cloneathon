import React from "react";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PaperclipIcon, XIcon, UploadCloudIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadFieldProps {
  fieldApi: AnyFieldApi;
  label?: string;
  accept?: string;
  className?: string;
  wrapperClassName?: string;
  description?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  fieldApi,
  label,
  accept,
  className,
  wrapperClassName,
  description,
}) => {
  const { name, state, handleChange, handleBlur } = fieldApi;
  const file = state.value as File | null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    handleChange(selectedFile);
    handleBlur();
  };

  const handleRemoveFile = () => {
    handleChange(null);
    const inputElement = document.getElementById(name) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
    handleBlur();
  };

  const triggerFileInput = () => {
    const inputElement = document.getElementById(name) as HTMLInputElement;
    inputElement?.click();
  };

  return (
    <div
      className={cn("space-y-1.5", wrapperClassName)}
    >
      {label && (
        <Label className="text-sm font-medium cursor-pointer" onClick={triggerFileInput}>
          {label}
        </Label>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <Input
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {file ? (
        <div
          className="flex items-center justify-between p-2.5 border rounded-lg bg-muted/40 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 text-sm overflow-hidden">
            <PaperclipIcon className="h-5 w-5 text-primary shrink-0" />
            <span className="truncate" title={file.name}>{file.name}</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemoveFile}
            className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
            aria-label="Remove file"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerFileInput}
          className={cn(
            "w-full flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors cursor-pointer bg-background hover:bg-muted/50",
            className,
            state.meta.errors.length ? "border-destructive hover:border-destructive" : "border-muted-foreground/50",
          )}
        >
          <UploadCloudIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm font-medium text-muted-foreground">
            Click or drag and drop a file
          </span>
          {accept && <span className="text-xs text-muted-foreground/80 mt-1">Accepted types: {accept}</span>}
        </button>
      )}
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
