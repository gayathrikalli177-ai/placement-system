import { createContext, useContext, useState, useCallback } from "react";
import "./Toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const showSuccess = useCallback((msg, duration) => showToast(msg, "success", duration), [showToast]);
  const showError = useCallback((msg, duration) => showToast(msg, "error", duration), [showToast]);
  const showWarning = useCallback((msg, duration) => showToast(msg, "warning", duration), [showToast]);
  const showInfo = useCallback((msg, duration) => showToast(msg, "info", duration), [showToast]);

  const getIcon = (type) => {
    switch (type) {
      case "success": return "🎉";
      case "error": return "⚠️";
      case "warning": return "🔔";
      default: return "ℹ️";
    }
  };

  const getTitle = (type) => {
    switch (type) {
      case "success": return "Success";
      case "error": return "Attention";
      case "warning": return "Notice";
      default: return "Information";
    }
  };

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, showWarning, showInfo }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div className={`toast-card ${t.type}`} key={t.id}>
            <div className="toast-icon-badge">{getIcon(t.type)}</div>
            <div className="toast-body">
              <div className="toast-title">{getTitle(t.type)}</div>
              <p className="toast-message">{t.message}</p>
            </div>
            <button className="toast-close-btn" onClick={() => removeToast(t.id)}>
              ✕
            </button>
            <div
              className="toast-progress-bar"
              style={{ animationDuration: `${t.duration}ms` }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
