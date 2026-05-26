"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useToastStore, ToastItem } from "@/store/toastStore";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast: ToastItem) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border glass-card shadow-lg ${
              toast.type === "success"
                ? "border-emerald-500/30 shadow-emerald-500/5 bg-emerald-950/20 text-emerald-900 dark:text-emerald-100"
                : toast.type === "error"
                ? "border-rose-500/30 shadow-rose-500/5 bg-rose-950/20 text-rose-900 dark:text-rose-100"
                : "border-indigo-500/30 shadow-indigo-500/5 bg-indigo-950/20 text-indigo-900 dark:text-indigo-100"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : toast.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              ) : (
                <Info className="w-5 h-5 text-indigo-500" />
              )}
            </div>

            <div className="flex-1 text-sm font-medium leading-5">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
