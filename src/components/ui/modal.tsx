"use client";

import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Icon from "./icon";
import ClickableButton from "./button";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

/** Selector matching every focusable element the dialog can own. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/** Returns the focusable elements owned by a given dialog panel. */
function getFocusables(panel: HTMLElement | null): HTMLElement[] {
  return panel
    ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    : [];
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  primaryAction,
  secondaryAction,
}: ModalProps) {
  // Unique, stable id used to bind the dialog label to its title.
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // Element that had focus before the modal opened, restored on close.
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Move focus into the dialog on open and restore it on close.
  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const focusables = getFocusables(panelRef.current);
    (focusables[0] ?? panelRef.current)?.focus();
    return () => {
      previouslyFocusedRef.current?.focus?.();
      previouslyFocusedRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  // Keep Tab / Shift+Tab cycling within the dialog panel.
  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusables = getFocusables(panelRef.current);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (
      !(event.shiftKey) &&
      (!panelRef.current?.contains(active) || active === last)
    ) {
      event.preventDefault();
      first.focus();
    } else if (
      event.shiftKey &&
      (!panelRef.current?.contains(active) || active === first)
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="max-h-[90vh] w-full max-w-[560px] rounded-large border border-border bg-surface shadow-lg"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handlePanelKeyDown}
      >
        <div className="flex items-center justify-between border-b border-border px-component py-control">
          <h2 id={titleId} className="text-component-title text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-small text-muted-foreground outline-none hover:bg-surface-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary [&_svg]:size-[var(--icon-small)] [&_svg]:shrink-0 [&_svg]:text-current"
            aria-label="Fermer"
          >
            <Icon name="X" aria-hidden="true" />
          </button>
        </div>
        <div className="px-component py-control">
          {children}
        </div>
        {(footer || primaryAction || secondaryAction) && (
        <div className="flex items-center justify-end gap-inline border-t border-border px-component py-control">
          {secondaryAction && (
            <ClickableButton
              type="button"
              onClick={secondaryAction.onClick}
              variant="ghost"
            >
              {secondaryAction.label}
            </ClickableButton>
          )}
          {footer && footer}
          {primaryAction && (
            <ClickableButton onClick={primaryAction.onClick}>
              {primaryAction.label}
            </ClickableButton>
          )}
        </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
