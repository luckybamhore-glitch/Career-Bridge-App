import { useState } from "react";
import { AlertTriangle, XCircle, X } from "lucide-react";

/**
 * AlertModal — neo-brutalist error/warning modal
 * matches the CareerBridge style: thick black borders, hard offset shadows,
 * mono uppercase labels, pill buttons, navy ink on off-white.
 *
 * Props:
 *  - open: boolean
 *  - type: "error" | "warning"
 *  - title: string
 *  - message: string
 *  - confirmLabel / cancelLabel: string
 *  - onConfirm / onClose: functions
 */
function AlertModal({
    open,
    type = "error",
    title,
    message,
    confirmLabel = "Try Again",
    cancelLabel = "Dismiss",
    onConfirm,
    onClose,
}) {
    if (!open) return null;

    const isError = type === "error";

    const theme = isError
        ? {
            badgeBg: "bg-rose-500",
            badgeText: "ERROR",
            iconBg: "bg-rose-100",
            iconRing: "ring-rose-500",
            iconColor: "text-rose-600",
            Icon: XCircle,
            accentText: "text-rose-600",
            confirmBg: "bg-rose-500 hover:bg-rose-400",
            stripe: "bg-rose-500",
        }
        : {
            badgeBg: "bg-yellow-400",
            badgeText: "WARNING",
            iconBg: "bg-yellow-100",
            iconRing: "ring-yellow-400",
            iconColor: "text-yellow-600",
            Icon: AlertTriangle,
            accentText: "text-yellow-600",
            confirmBg: "bg-yellow-400 hover:bg-yellow-300",
            stripe: "bg-yellow-400",
        };

    const Icon = theme.Icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* modal card */}
            <div
                className="relative w-full max-w-sm bg-[#F5F4FB] border-[3px] border-slate-950
                   rounded-2xl shadow-[8px_8px_0_0_rgba(2,6,23,1)]
                   overflow-hidden"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="alert-modal-title"
            >
                {/* top accent stripe */}
                <div className={`h-2 w-full ${theme.stripe} border-b-[3px] border-slate-950`} />

                {/* close button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-5 right-4 w-8 h-8 flex items-center justify-center
                     rounded-full border-2 border-slate-950 bg-white
                     shadow-[2px_2px_0_0_rgba(2,6,23,1)]
                     hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none
                     transition-all"
                >
                    <X className="w-4 h-4 text-slate-950" strokeWidth={2.5} />
                </button>

                <div className="p-6 pt-7">
                    {/* badge */}
                    <span
                        className={`inline-block font-mono text-xs font-bold tracking-wider
                        px-3 py-1 rounded-full border-2 border-slate-950
                        text-slate-950 ${theme.badgeBg}`}
                    >
                        {theme.badgeText}
                    </span>

                    {/* icon + title */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4">
                        <div
                            className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center
                          border-2 border-slate-950 ring-4 ${theme.iconRing}/30 ${theme.iconBg}`}
                        >
                            <Icon className={`w-7 h-7 ${theme.iconColor}`} strokeWidth={2.2} />
                        </div>
                        <h2
                            id="alert-modal-title"
                            className="text-xl font-extrabold text-slate-950 leading-tight"
                        >
                            {title}
                        </h2>
                    </div>

                    {/* message */}
                    <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                        {message}
                    </p>

                    {/* divider */}
                    <div className="mt-6 border-t-2 border-dashed border-slate-300" />

                    {/* actions */}
                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 mt-5">
                        <button
                            onClick={onClose}
                            className="font-semibold text-sm text-slate-950 px-4 py-2.5 rounded-full
                         border-2 border-slate-950 bg-white
                         shadow-[3px_3px_0_0_rgba(2,6,23,1)]
                         hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none
                         transition-all"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`font-bold text-sm text-slate-950 px-5 py-2.5 rounded-full
                         border-2 border-slate-950 ${theme.confirmBg}
                         shadow-[3px_3px_0_0_rgba(2,6,23,1)]
                         hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none
                         transition-all`}
                        >
                            {confirmLabel} →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default AlertModal