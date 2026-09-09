import { createContext, useContext, useState, useCallback, useMemo } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = "info", duration = 2500) => {
        const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        const newToast = { id, message, type, duration };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    const success = useCallback((msg, duration) => showToast(msg, "success", duration), [showToast]);
    const error = useCallback((msg, duration) => showToast(msg, "error", duration), [showToast]);
    const warning = useCallback((msg, duration) => showToast(msg, "warning", duration), [showToast]);
    const info = useCallback((msg, duration) => showToast(msg, "info", duration), [showToast]);

    const contextValue = useMemo(() => ({
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info
    }), [toasts, showToast, removeToast, success, error, warning, info]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
