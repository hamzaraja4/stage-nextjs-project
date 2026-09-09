"use client";

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";
import Icon from "./icon";

/** Visual validation state of the field. */
export type InputState = "valid" | "invalid";

const LABEL_CLASS =
  "mb-inline flex items-center gap-micro text-label text-muted-foreground";

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-danger">
      *
    </span>
  );
}

function FieldFeedback({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p
      id={id}
      className="flex items-start gap-micro text-small text-danger-foreground [&_svg]:size-[var(--icon-small)] [&_svg]:shrink-0"
    >
      <Icon name="CircleAlert" variant="danger" aria-hidden="true" />
      <span>{error}</span>
    </p>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Text label shown above the field. */
  label?: string;
  /** Optional leading icon/control inside the field. */
  icon?: ReactNode;
  /** Optional static adornment shown at the right of the field. */
  trailingIcon?: ReactNode;
  /** Visual validation state: tints the border and shows a feedback icon. */
  state?: InputState;
  /** Error message shown below the field (overrides `helper`). */
  error?: string;
  /** Unstyled helper text shown below the field. */
  helper?: string;
  /** Marks the field as required (renders `*` and sets `aria-required`). */
  required?: boolean;
  /** When set, shows a "clear" action as soon as the field has a value. */
  clearable?: boolean;
  /** Shorthand for a password field with a visibility toggle (same as `type="password"`). */
  password?: boolean;
  /** Shows a live character counter (uses `maxLength` when provided). */
  counter?: boolean;
  /** Extra callback fired after the field value is cleared. */
  onClear?: () => void;
  /** React 19 forwarded ref. */
  ref?: Ref<HTMLInputElement>;
}

export default function Input({
  label,
  icon,
  trailingIcon,
  state,
  error,
  helper,
  required = false,
  clearable = false,
  password = false,
  counter = false,
  onClear,
  id,
  type,
  disabled,
  maxLength,
  value,
  defaultValue,
  onChange,
  className = "",
  ref,
  ...props
}: InputProps) {
  const generatedId = useId();
  const helperId = useId();
  const errorId = useId();
  const inputId = id ?? generatedId;

  const inputRef = useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = useState<string>(() => {
    if (typeof value === "string") return value;
    if (defaultValue != null) return String(defaultValue);
    return "";
  });
  const [showPassword, setShowPassword] = useState(false);

  const effectiveValue = typeof value === "string" ? value : currentValue;

  const isPassword = password || type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const hasClear = clearable && effectiveValue.length > 0 && !disabled;

  /** A semantic feedback icon is shown unless a `trailingIcon` occupies the slot. */
  const feedbackShown = (state !== undefined || Boolean(error)) && !trailingIcon;

  const rightCount =
    (feedbackShown ? 1 : 0) +
    (trailingIcon ? 1 : 0) +
    (hasClear ? 1 : 0) +
    (isPassword ? 1 : 0);

  const rightPad =
    rightCount === 0
      ? ""
      : rightCount === 1
        ? "pr-9"
        : rightCount === 2
          ? "pr-[3.75rem]"
          : "pr-[5.25rem]";

  const describedBy =
    [error ? errorId : helper ? helperId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);
    onChange?.(event);
  };

  const handleClear = () => {
    setCurrentValue("");
    if (inputRef.current) {
      const inputEl = inputRef.current;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(inputEl, "");
      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
      inputEl.focus();
    }
    onClear?.();
  };

  const setRefs = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const toneClass =
    state === "valid"
      ? "border-success hover:border-success focus:border-success"
      : state === "invalid" || error
        ? "border-danger hover:border-danger focus:border-danger"
        : "";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={LABEL_CLASS}>
          <span className="truncate">{label}</span>
          {required && <RequiredMark />}
        </label>
      )}

      <div className="relative w-full">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground [&_svg]:size-[var(--icon-small)] [&_svg]:shrink-0 [&_svg]:text-current">
            {icon}
          </span>
        )}

        <input
          ref={setRefs}
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          required={required}
          aria-invalid={state === "invalid" || Boolean(error) || undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={`ds-input ${icon ? "pl-9" : ""} ${rightPad} ${toneClass} ${className}`}
          {...props}
        />

        {rightCount > 0 && (
          <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-inline">
            {state === "valid" && !trailingIcon && (
              <Icon name="Check" variant="success" aria-hidden="true" />
            )}
            {!trailingIcon && (state === "invalid" || error) && (
              <Icon name="CircleAlert" variant="danger" aria-hidden="true" />
            )}

            {trailingIcon && (
              <span className="pointer-events-none text-muted-foreground [&_svg]:size-[var(--icon-small)] [&_svg]:shrink-0 [&_svg]:text-current">
                {trailingIcon}
              </span>
            )}

            {hasClear && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Effacer la valeur"
                className="flex items-center rounded-small text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-[var(--icon-small)] [&_svg]:shrink-0 [&_svg]:text-current"
              >
                <Icon name="X" aria-hidden="true" />
              </button>
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                className="flex items-center rounded-small text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-[var(--icon-small)] [&_svg]:shrink-0 [&_svg]:text-current"
              >
                {showPassword ? (
                  <Icon name="EyeOff" aria-hidden="true" />
                ) : (
                  <Icon name="Eye" aria-hidden="true" />
                )}
              </button>
            )}
          </span>
        )}
      </div>

      {(error || helper || counter) && (
        <div className="mt-inline flex items-start justify-between gap-inline">
          <div className="min-w-0">
            {error ? (
              <FieldFeedback id={errorId} error={error} />
            ) : helper ? (
              <p id={helperId} className="text-small text-muted-foreground">
                {helper}
              </p>
            ) : null}
          </div>
          {counter && (
            <span className="shrink-0 text-small text-muted-foreground">
              {effectiveValue.length}
              {typeof maxLength === "number" ? ` / ${maxLength}` : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  state?: InputState;
  error?: string;
  helper?: string;
  required?: boolean;
  counter?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  label,
  state,
  error,
  helper,
  required = false,
  counter = false,
  id,
  disabled,
  maxLength,
  value,
  defaultValue,
  onChange,
  className = "",
  ref,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const helperId = useId();
  const errorId = useId();
  const textareaId = id ?? generatedId;

  const [currentValue, setCurrentValue] = useState<string>(() => {
    if (typeof value === "string") return value;
    if (defaultValue != null) return String(defaultValue);
    return "";
  });

  const effectiveValue = typeof value === "string" ? value : currentValue;

  const describedBy =
    [error ? errorId : helper ? helperId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(event.target.value);
    onChange?.(event);
  };

  const toneClass =
    state === "valid"
      ? "border-success hover:border-success focus:border-success"
      : state === "invalid" || error
        ? "border-danger hover:border-danger focus:border-danger"
        : "";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className={LABEL_CLASS}>
          <span className="truncate">{label}</span>
          {required && <RequiredMark />}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={4}
        disabled={disabled}
        required={required}
        aria-invalid={state === "invalid" || Boolean(error) || undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={`ds-input resize-y ${toneClass} ${className}`}
        {...props}
      />

      {(error || helper || counter) && (
        <div className="mt-inline flex items-start justify-between gap-inline">
          <div className="min-w-0">
            {error ? (
              <FieldFeedback id={errorId} error={error} />
            ) : helper ? (
              <p id={helperId} className="text-small text-muted-foreground">
                {helper}
              </p>
            ) : null}
          </div>
          {counter && (
            <span className="shrink-0 text-small text-muted-foreground">
              {effectiveValue.length}
              {typeof maxLength === "number" ? ` / ${maxLength}` : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}