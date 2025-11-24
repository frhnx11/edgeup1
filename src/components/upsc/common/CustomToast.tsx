import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  const iconClass = "w-5 h-5";

  switch (type) {
    case 'success':
      return <CheckCircle className={iconClass} />;
    case 'error':
      return <XCircle className={iconClass} />;
    case 'warning':
      return <AlertCircle className={iconClass} />;
    case 'info':
      return <Info className={iconClass} />;
  }
};

const toastStyles = {
  success: {
    bg: 'from-green-500 to-emerald-600',
    text: 'text-white',
    icon: 'text-white'
  },
  error: {
    bg: 'from-red-500 to-rose-600',
    text: 'text-white',
    icon: 'text-white'
  },
  warning: {
    bg: 'from-amber-500 to-orange-600',
    text: 'text-white',
    icon: 'text-white'
  },
  info: {
    bg: 'from-blue-500 to-indigo-600',
    text: 'text-white',
    icon: 'text-white'
  }
};

export const CustomToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 5000;
  const style = toastStyles[toast.type];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onClose(toast.id);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [toast.id, duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 400, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative w-full max-w-sm"
    >
      <div className={`relative bg-gradient-to-r ${style.bg} rounded-xl shadow-2xl overflow-hidden`}>
        {/* Content */}
        <div className="p-4 flex items-start gap-3">
          <div className={style.icon}>
            <ToastIcon type={toast.type} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold ${style.text} text-sm`}>
              {toast.title}
            </h4>
            {toast.message && (
              <p className={`${style.text} opacity-90 text-xs mt-1`}>
                {toast.message}
              </p>
            )}
          </div>

          <button
            onClick={() => onClose(toast.id)}
            className={`${style.icon} opacity-70 hover:opacity-100 transition-opacity flex-shrink-0`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-black/20">
          <motion.div
            className="h-full bg-white/30"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.016, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right'
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 max-w-full px-4`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <CustomToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Manager Class
class ToastManager {
  private listeners: ((toasts: Toast[]) => void)[] = [];
  private toasts: Toast[] = [];

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
    listener(this.toasts);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  private addToast(type: ToastType, title: string, message?: string, duration?: number) {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, type, title, message, duration };
    this.toasts = [...this.toasts, toast];
    this.notify();
    return id;
  }

  success(title: string, message?: string, duration?: number) {
    return this.addToast('success', title, message, duration);
  }

  error(title: string, message?: string, duration?: number) {
    return this.addToast('error', title, message, duration);
  }

  warning(title: string, message?: string, duration?: number) {
    return this.addToast('warning', title, message, duration);
  }

  info(title: string, message?: string, duration?: number) {
    return this.addToast('info', title, message, duration);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastManager = new ToastManager();

// Hook for using custom toasts
export const useCustomToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return {
    toasts,
    showToast: {
      success: (title: string, message?: string, duration?: number) =>
        toastManager.success(title, message, duration),
      error: (title: string, message?: string, duration?: number) =>
        toastManager.error(title, message, duration),
      warning: (title: string, message?: string, duration?: number) =>
        toastManager.warning(title, message, duration),
      info: (title: string, message?: string, duration?: number) =>
        toastManager.info(title, message, duration)
    },
    dismissToast: (id: string) => toastManager.remove(id),
    clearToasts: () => toastManager.clear()
  };
};
