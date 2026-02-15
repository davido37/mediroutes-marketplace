"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
}: ToggleSwitchProps) {
  return (
    <label
      className={`flex items-center gap-3 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-brand" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
            checked ? "translate-x-5.5 ml-0.5" : "translate-x-0.5"
          }`}
        />
      </button>
      {(label || description) && (
        <div>
          {label && (
            <span className="text-sm font-medium text-text-primary">
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-text-muted">{description}</p>
          )}
        </div>
      )}
    </label>
  );
}
