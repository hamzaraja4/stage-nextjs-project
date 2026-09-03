"use client";

import React from "react";
import { useToast, ToastType } from "@/context/ToastContext";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <i className="fa-solid fa-circle-check text-emerald-500 text-lg"></i>;
      case "error":
        return <i className="fa-solid fa-circle-xmark text-rose-500 text-lg"></i>;
      case "warning":
        return <i className="fa-solid fa-triangle-exclamation text-amber-500 text-lg"></i>;
      case "info":
      default:
        return <i className="fa-solid fa-circle-info text-sky-500 text-lg"></i>;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-emerald-200 bg-white shadow-emerald-100";
      case "error":
        return "border-rose-200 bg-white shadow-rose-100";
      case "warning":
        return "border-amber-200 bg-white shadow-amber-100";
      case "info":
      default:
        return "border-sky-200 bg-white shadow-sky-100";
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start p-3.5 rounded-xl border shadow-lg transition-all transform translate-y-0 duration-200 ${getBorderColor(
            toast.type
          )}`}
        >
          <div className="mr-3 mt-0.5 shrink-0">{getIcon(toast.type)}</div>
          <div className="flex-1 mr-2">
            <div className="font-bold text-xs text-slate-800">{toast.title}</div>
            {toast.message && (
              <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {toast.message}
              </div>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer shrink-0"
            title="Fermer"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      ))}
    </div>
  );
};
