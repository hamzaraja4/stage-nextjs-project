"use client";

import { useMemo, useState, type ReactNode } from "react";
import Badge from "./badge";
import Icon from "./icon";
import Input from "./input";

/** Public option shape shared by every selection variant. */
export interface SelectOption {
  value: string;
  label: string;
}

interface BaseSelectProps {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  emptyMessage?: string;
}

interface SelectProps extends BaseSelectProps {
  value: string;
  onChange: (value: string) => void;
}

interface MultiSelectProps extends BaseSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
  /**
   * Nombre maximal de chips d'options sélectionnées affichées dans le champ ;
   * au-delà, un indicateur « +N » signale les autres (info-bulle = liste).
   */
  maxVisibleChips?: number;
}

interface SelectDropdownProps {
  open: boolean;
  options: SelectOption[];
  selected: Set<string>;
  multiple: boolean;
  searchable: boolean;
  searchablePlaceholder?: string;
  onToggle: (value: string) => void;
  emptyMessage?: string;
}

const LABEL_CLASS = "mb-inline block text-label text-muted-foreground";

function SelectTrigger({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={open}
      onClick={() => onOpenChange(!open)}
      className="ds-input flex cursor-pointer items-center justify-between gap-2 text-left [&_svg]:size-[var(--icon-small)] [&_svg]:shrink-0"
    >
      {children}
      <Icon
        name="ChevronDown"
        variant="muted"
        aria-hidden="true"
        className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function SelectDropdown({
  open,
  options,
  selected,
  multiple,
  searchable,
  searchablePlaceholder = "Rechercher...",
  onToggle,
  emptyMessage = "Aucun résultat trouvé.",
}: SelectDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query),
    );
  }, [options, searchQuery]);

  if (!open) return null;

  return (
    <div className="absolute top-full z-50 mt-1 max-h-64 w-full min-w-[10rem] overflow-hidden rounded-medium border border-border bg-surface shadow-lg">
      {searchable && (
        <div className="border-b border-border p-2">
          <Input
            type="text"
            placeholder={searchablePlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Icon name="Search" />}
            aria-label={searchablePlaceholder}
          />
        </div>
      )}
      <div className="overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selected.has(option.value);
            return (
              <div
                key={option.value}
                className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-surface-muted cursor-pointer [&_svg]:size-[var(--icon-small)] [&_svg]:shrink-0"
                onClick={() => onToggle(option.value)}
              >
                <span>{option.label}</span>
                {multiple ? (
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-sm border [&_svg]:size-3 [&_svg]:text-current ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
                  >
                    {isSelected && <Icon name="Check" />}
                  </div>
                ) : isSelected ? (
                  <Icon name="Check" variant="primary" />
                ) : null}
              </div>
            );
                    })
        )}
      </div>
    </div>
  );
}

/**
 * Single-select dropdown component.
 * Follows Design System rules:
 * - Displays selected value with a chevron indicator.
 * - Opens a dropdown directly below the field on click.
 * - Each option is on its own row with consistent alignment.
 * - Selected option is marked with a check icon.
 */
export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  emptyMessage,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      {label && <label className={LABEL_CLASS}>{label}</label>}
      <SelectTrigger open={open} onOpenChange={setOpen}>
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </SelectTrigger>
      <SelectDropdown
        open={open}
        options={options}
        selected={new Set(value ? [value] : [])}
        multiple={false}
        searchable={false}
        onToggle={handleSelect}
                emptyMessage={emptyMessage}
      />
    </div>
  );
}

interface MultiSelectValueProps {
  options: SelectOption[];
  values: string[];
  placeholder?: string;
  maxVisibleChips: number;
}

/**
 * Contenu du champ multi-sélection : chips des options choisies jusqu'à
 * `maxVisibleChips`, puis un indicateur « +N » (info-bulle = liste des
 * autres sélectionnées) lorsqu'il y en a davantage.
 */
function MultiSelectValue({
  options,
  values,
  placeholder,
  maxVisibleChips,
}: MultiSelectValueProps) {
  if (values.length === 0) {
    return <span className="text-muted-foreground">{placeholder}</span>;
  }

  const selectedOptions = values
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is SelectOption => Boolean(option));
  const visibleOptions = selectedOptions.slice(0, Math.max(1, maxVisibleChips));
  const hiddenOptions = selectedOptions.slice(visibleOptions.length);

  return (
    <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
      {visibleOptions.map((option) => (
        <Badge key={option.value} variant="primary">
          {option.label}
        </Badge>
      ))}
      {hiddenOptions.length > 0 && (
        <span
          title={`Aussi sélectionné : ${hiddenOptions
            .map((option) => option.label)
            .join(", ")}`}
          className="inline-flex"
        >
          <Badge variant="default">+{hiddenOptions.length}</Badge>
        </span>
      )}
    </span>
  );
}

/**
 * Multi-select dropdown component.
 * Follows Design System rules:
 * - Same visual language as single select.
 * - Each option has a checkbox-style selector on the left.
 * - Empty when unselected, checked when selected.
 * - Multiple options can be selected simultaneously.
 */
export function MultiSelect({
  label,
  options,
  values,
  onChange,
  placeholder = "Sélectionner...",
  emptyMessage,
  maxVisibleChips = 2,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (optionValue: string) => {
    const newValues = values.includes(optionValue)
      ? values.filter((v) => v !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
  };

  return (
    <div className="relative w-full">
      {label && <label className={LABEL_CLASS}>{label}</label>}
      <SelectTrigger open={open} onOpenChange={setOpen}>
        <MultiSelectValue
          options={options}
          values={values}
          placeholder={placeholder}
          maxVisibleChips={maxVisibleChips}
        />
      </SelectTrigger>
      <SelectDropdown
        open={open}
        options={options}
        selected={new Set(values)}
        multiple={true}
        searchable={false}
        onToggle={handleToggle}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

/**
 * Single-select dropdown with search.
 * For long lists where searching is helpful.
 */
export function SelectWithSearch({
  label,
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  emptyMessage,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      {label && <label className={LABEL_CLASS}>{label}</label>}
      <SelectTrigger open={open} onOpenChange={setOpen}>
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </SelectTrigger>
      <SelectDropdown
        open={open}
        options={options}
        selected={new Set(value ? [value] : [])}
        multiple={false}
        searchable={true}
        onToggle={handleSelect}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

/**
 * Multi-select dropdown with search.
 * For long lists where searching and multiple selection is needed.
 */
export function MultiSelectWithSearch({
  label,
  options,
  values,
  onChange,
  placeholder = "Sélectionner...",
  emptyMessage,
  maxVisibleChips = 2,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (optionValue: string) => {
    const newValues = values.includes(optionValue)
      ? values.filter((v) => v !== optionValue)
      : [...values, optionValue];
    onChange(newValues);
  };

  return (
    <div className="relative w-full">
      {label && <label className={LABEL_CLASS}>{label}</label>}
      <SelectTrigger open={open} onOpenChange={setOpen}>
        <MultiSelectValue
          options={options}
          values={values}
          placeholder={placeholder}
          maxVisibleChips={maxVisibleChips}
        />
      </SelectTrigger>
      <SelectDropdown
        open={open}
        options={options}
        selected={new Set(values)}
        multiple={true}
        searchable={true}
        onToggle={handleToggle}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

/**
 * Filter-style multi-select dropdown.
 * Alias for MultiSelectWithSearch optimized for table column filtering.
 */
export function SelectFilter({
  label,
  options,
  values,
  onChange,
  placeholder = "Filtrer...",
  emptyMessage,
  maxVisibleChips,
}: MultiSelectProps) {
  return (
    <MultiSelectWithSearch
      label={label}
      options={options}
      values={values}
      onChange={onChange}
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      maxVisibleChips={maxVisibleChips}
    />
  );
}
