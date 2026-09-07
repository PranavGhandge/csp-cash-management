import { useToast } from "../context/ToastContext";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import "./Toast.css";

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (!toasts || toasts.length === 0) return null;

    const renderIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle2 size={18} strokeWidth={2} />;
            case "error":
                return <AlertCircle size={18} strokeWidth={2} />;
            case "warning":
                return <AlertTriangle size={18} strokeWidth={2} />;
            case "info":
            default:
                return <Info size={18} strokeWidth={2} />;
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
                    <div className="toast-icon">
                        {renderIcon(toast.type)}
                    </div>
                    <span className="toast-message">{toast.message}</span>
                    <button
                        className="toast-close-btn"
                        onClick={() => removeToast(toast.id)}
                        aria-label="Close notification"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
