"use client";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export const inputClassName =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light/20 disabled:bg-surface-muted disabled:cursor-not-allowed";
