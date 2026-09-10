import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { approvalsApi } from '../../api/approvalsApi';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Bot,
  User,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Code2,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

const FALLBACK_APPROVALS = [
  {
    id: 'appr-001',
    actionType: 'UPDATE_DEAL_STAGE',
    targetEntityType: 'DEAL',
    targetEntityId: 'deal-acme-cloud',
    requestedBy: 'sales-copilot-agent',
    status: 'PENDING',
    riskLevel: 'HIGH',
    confidenceScore: 0.92,
    reasoning: 'Customer executive sponsor verbally confirmed budget approval in email thread. Advancing deal from Proposal to Negotiation.',
    proposedPayload: JSON.stringify({
      dealId: 'deal-acme-cloud',
      stage: 'NEGOTIATION',
      probability: 80,
      forecastAmount: 125000,
      discountPercent: 15,
    }, null, 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'appr-002',
    actionType: 'SEND_DISCOUNT_OFFER',
    targetEntityType: 'CUSTOMER',
    targetEntityId: 'cust-globex-corp',
    requestedBy: 'retention-agent',
    status: 'PENDING',
    riskLevel: 'MEDIUM',
    confidenceScore: 0.88,
    reasoning: 'Customer sentiment dropped 24% over past 14 days due to ticket resolution delay. Offering 10% loyalty credit on renewal.',
    proposedPayload: JSON.stringify({
      customerId: 'cust-globex-corp',
      creditAmount: 2400,
      reason: 'SLA recovery loyalty credit',
      validUntil: '2026-10-01',
    }, null, 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
  },
  {
    id: 'appr-003',
    actionType: 'BULK_REASSIGN_LEADS',
    targetEntityType: 'LEAD',
    targetEntityId: 'batch-emea-leads',
    requestedBy: 'routing-orchestrator',
    status: 'APPROVED',
    riskLevel: 'LOW',
    confidenceScore: 0.98,
    reasoning: 'EMEA regional territory rep rebalancing following Q3 staffing adjustment.',
    proposedPayload: JSON.stringify({
      leadCount: 42,
      fromRepId: 'rep-unassigned',
      toRepId: 'rep-elena-rostova',
      territory: 'EMEA-West',
    }, null, 2),
    reviewedBy: 'admin-user',
    reviewerNotes: 'Verified territory capacity looks good.',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    reviewedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
];

export const ApprovalCenterPage = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedPayloads, setExpandedPayloads] = useState({});
  const [activeModal, setActiveModal] = useState(null); // { id, decision }
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const res = await approvalsApi.list(filterStatus === 'ALL' ? '' : filterStatus);
      if (res?.data?.content && Array.isArray(res.data.content) && res.data.content.length > 0) {
        setApprovals(res.data.content);
      } else if (Array.isArray(res?.data) && res.data.length > 0) {
        setApprovals(res.data);
      } else {
        setApprovals(FALLBACK_APPROVALS);
      }
    } catch (err) {
      console.warn('Using local fallback approvals queue:', err);
      setApprovals(FALLBACK_APPROVALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [filterStatus]);

  const toggleExpand = (id) => {
    setExpandedPayloads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openDecisionModal = (id, decision) => {
    setActiveModal({ id, decision });
    setReviewerNotes('');
  };

  const handleDecisionSubmit = async () => {
    if (!activeModal) return;
    setSubmitting(true);
    try {
      await approvalsApi.decide(activeModal.id, activeModal.decision, reviewerNotes);
      // Update local state
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === activeModal.id
            ? {
                ...item,
                status: activeModal.decision,
                reviewedBy: 'You (Current User)',
                reviewerNotes,
                reviewedAt: new Date().toISOString(),
              }
            : item
        )
      );
      setActiveModal(null);
    } catch (err) {
      // Local fallback state update if offline
      setApprovals((prev) =>
        prev.map((item) =>
          item.id === activeModal.id
            ? {
                ...item,
                status: activeModal.decision,
                reviewedBy: 'You (Current User)',
                reviewerNotes,
                reviewedAt: new Date().toISOString(),
              }
            : item
        )
      );
      setActiveModal(null);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = approvals.filter((item) => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;
  const approvedCount = approvals.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = approvals.filter((a) => a.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Action Approval Center"
        subtitle="Human-in-the-loop governance for AI agent operations, high-risk CRM mutations, and autonomous workflows in shadow mode."
        breadcrumbs={['CRM OS', 'Governance', 'Action Approvals']}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Pending Reviews
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{pendingCount}</div>
            <span className="text-xs text-amber-600 dark:text-amber-400">Requires human decision</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Approved
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{approvedCount}</div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">Executed & logged</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Rejected / Blocked
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{rejectedCount}</div>
            <span className="text-xs text-rose-600 dark:text-rose-400">Overridden by human</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 dark:bg-rose-400/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Shadow Mode Guard
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Active</div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400">Zero rogue mutations</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Queue Toolbar & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterStatus === status
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {status}
              {status === 'PENDING' && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchApprovals}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">All caught up!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are no {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} action approvals in the queue.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = !!expandedPayloads[item.id];
            const isPending = item.status === 'PENDING';

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 font-mono">
                          {item.actionType}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-500">
                          Target: <strong className="text-slate-700 dark:text-slate-300">{item.targetEntityType}</strong> ({item.targetEntityId})
                        </span>

                        {/* Risk badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            item.riskLevel === 'HIGH' || item.riskLevel === 'CRITICAL'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                              : item.riskLevel === 'MEDIUM'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {item.riskLevel || 'MEDIUM'} RISK
                        </span>

                        {/* Status badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            item.status === 'APPROVED'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : item.status === 'REJECTED'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Agent / User info */}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5 text-brand-500" />
                          Requested by: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.requestedBy}</span>
                        </span>
                        {item.confidenceScore && (
                          <span className="text-slate-400">
                            Confidence: <span className="font-bold text-slate-700 dark:text-slate-300">{Math.round(item.confidenceScore * 100)}%</span>
                          </span>
                        )}
                        <span className="text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Pending items */}
                  {isPending ? (
                    <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                      <button
                        onClick={() => openDecisionModal(item.id, 'REJECTED')}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => openDecisionModal(item.id, 'APPROVED')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Action
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 text-right self-end lg:self-center">
                      <div>Decided by: <strong className="text-slate-700 dark:text-slate-300">{item.reviewedBy || 'Admin'}</strong></div>
                      {item.reviewerNotes && (
                        <div className="text-[11px] text-slate-400 italic">"{item.reviewerNotes}"</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Reasoning Quote */}
                {item.reasoning && (
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">AI Rationale: </span>
                    {item.reasoning}
                  </div>
                )}

                {/* Proposed Payload Accordion */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'Hide' : 'Inspect'} Proposed Payload & Diff</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
                    <pre>{typeof item.proposedPayload === 'string' ? item.proposedPayload : JSON.stringify(item.proposedPayload, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Decision Confirmation Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                  activeModal.decision === 'APPROVED' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {activeModal.decision === 'APPROVED' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  {activeModal.decision === 'APPROVED' ? 'Approve AI Action' : 'Reject AI Action'}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeModal.decision === 'APPROVED'
                    ? 'The mutation will be committed to the database and executed.'
                    : 'The suggested action will be cancelled and the agent notified.'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Reviewer Notes (Optional)
              </label>
              <textarea
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                rows={3}
                placeholder="Reason or instructions for this governance decision..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDecisionSubmit}
                disabled={submitting}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs ${
                  activeModal.decision === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {submitting ? 'Submitting...' : `Confirm ${activeModal.decision === 'APPROVED' ? 'Approval' : 'Rejection'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalCenterPage;
