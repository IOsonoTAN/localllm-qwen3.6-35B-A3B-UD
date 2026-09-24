'use client';

import { useState, createContext, useContext, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'loading';

interface ToastData {
  id: number;
  type: ToastType;
  message: string;
  exiting?: boolean;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => number;
  dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

// Toast component
function Toast({ toast, onDismiss, onRemove }: { toast: ToastData; onDismiss: (id: number) => void; onRemove: (id: number) => void }) {
  useEffect(() => {
    if (toast.type === 'loading' || toast.exiting) return;
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.type, toast.exiting, onDismiss]);

  useEffect(() => {
    if (!toast.exiting) return;
    const timer = setTimeout(() => onRemove(toast.id), 280);
    return () => clearTimeout(timer);
  }, [toast.exiting, toast.id, onRemove]);

  const isSuccess = toast.type === 'success';
  const isLoading = toast.type === 'loading';
  const tone = isLoading
    ? 'bg-blue-50 border-blue-200'
    : isSuccess
      ? 'bg-green-50 border-green-200'
      : 'bg-red-50 border-red-200';
  const iconTone = isLoading
    ? 'bg-blue-100 text-blue-600'
    : isSuccess
      ? 'bg-green-100 text-green-600'
      : 'bg-red-100 text-red-600';
  const textTone = isLoading ? 'text-blue-700' : isSuccess ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border ${tone} ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${iconTone}`}>
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isSuccess ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <p className={`text-sm font-medium flex-1 ${textTone}`}>
        {toast.message}
      </p>
    </div>
  );
}

// Toast container that displays all toasts
function ToastContainer({ toasts, onDismiss, onRemove }: { toasts: ToastData[]; onDismiss: (id: number) => void; onRemove: (id: number) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Toast provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    return id;
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)));
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}