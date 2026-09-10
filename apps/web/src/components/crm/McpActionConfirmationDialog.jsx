import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Mail,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode2,
} from 'lucide-react';

/**
 * High-Security MCP Action Confirmation Checkpoint
 * Implements Section 21 of the UI Master Prompt
 */
export const McpActionConfirmationDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  actionData = {
    toolName: 'mcp.gmail.send_email',
    provider: 'Google Workspace MCP Server',
    recipient: 'rachel.green@acme.com',
    subject: 'Executive Summary: Q4 Enterprise CRM Pilot Terms & SLA',
    contentPreview: 'Hi Rachel,\nFollowing up on our architecture review, attached are the customized SLA guarantees for Acme Global Technologies.\nBest regards,\nAlex Vance',
    dataSourcesUsed: ['CRM Deal #4812', 'Customer 360 Contact Rachel', 'SLA Master Contract'],
    permissionRequired: 'EXTERNAL_MAIL_SEND',
    riskLevel: 'HIGH',
    externalService: 'Google Gmail API v1 (via MCP Gateway)',
  },
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      if (onConfirm) await onConfirm();
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up text-left">
        {/* Security Checkpoint Header Banner */}
        <div className="p-5 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border-b border-amber-200/60 dark:border-amber-900/40 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                SECURITY CHECKPOINT
              </span>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                {actionData.riskLevel} RISK ACTION
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
              Confirm External Mutation via MCP Gateway
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              An autonomous agent requested permission to dispatch an action outside the CRM boundary.
            </p>
          </div>
        </div>

        {/* Checkpoint Inspection Body */}
        <div className="p-6 space-y-4">
          {/* External Gateway Target Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">MCP Tool Name</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 break-all">
                {actionData.toolName}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">External Service</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {actionData.externalService}
              </span>
            </div>
          </div>

          {/* Action Payload Preview */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-slate-500 font-semibold">Recipient:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {actionData.recipient}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-slate-500 font-semibold">Subject:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[320px]">
                {actionData.subject}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Proposed Content Preview
              </span>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-28 overflow-y-auto">
                {actionData.contentPreview}
              </div>
            </div>
          </div>

          {/* Audited Data & Required Permissions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
                Required Permission Scope
              </span>
              <span className="font-mono font-bold text-indigo-900 dark:text-indigo-200">
                {actionData.permissionRequired}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Audited Sources
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                {actionData.dataSourcesUsed.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Checkpoint Action Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel & Block
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying & Executing...' : 'Approve & Execute'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default McpActionConfirmationDialog;
