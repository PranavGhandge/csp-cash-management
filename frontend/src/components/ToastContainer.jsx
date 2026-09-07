import { useToast } from "../context/ToastContext";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import "./Toast.css";

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (!toasts || toasts.length === 0) return null;

    const renderIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle2 size={18} strokeWidth={2.5} />;
            case "error":
                return <AlertCircle size={18} strokeWidth={2.5} />;
            case "warning":
                return <AlertTriangle size={18} strokeWidth={2.5} />;
            case "info":
            default:
                return <Info size={18} strokeWidth={2.5} />;
        }
    };

    const getTitle = (type) => {
        switch (type) {
            case "success":
                return "Success";
            case "error":
                return "Error Alert";
            case "warning":
                return "Attention";
            case "info":
            default:
                return "Notification";
        }
    };

    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast-item toast-${toast.type || "info"}`}
                    role="alert"
                >
                    <div className="toast-icon-wrap">
                        {renderIcon(toast.type)}
                    </div>
                    <div className="toast-content">
                        <div className="toast-title">{getTitle(toast.type)}</div>
                        <div className="toast-message">{toast.message}</div>
                    </div>
                    <button
                        className="toast-close-btn"
                        onClick={() => removeToast(toast.id)}
                        aria-label="Close notification"
                    >
                        <X size={16} />
                    </button>
                    {toast.duration > 0 && (
                        <div
                            className="toast-progress"
                            style={{ animationDuration: `${toast.duration}ms` }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
