import React from 'react';
import { Badge } from '../ui/Badge';

export const StatusBadge = ({ status }) => {
  const statusMap = {
    NEW: { label: 'New', variant: 'primary' },
    CONTACTED: { label: 'Contacted', variant: 'purple' },
    QUALIFIED: { label: 'Qualified', variant: 'success' },
    UNQUALIFIED: { label: 'Unqualified', variant: 'danger' },
    PROPOSAL: { label: 'Proposal', variant: 'warning' },
    CONVERTED: { label: 'Converted', variant: 'success' },
    LOST: { label: 'Lost', variant: 'danger' },
    WON: { label: 'Closed Won', variant: 'success' },
    DEMO: { label: 'Demo', variant: 'primary' },
    NEGOTIATION: { label: 'Negotiation', variant: 'warning' },
    TODO: { label: 'To Do', variant: 'default' },
    IN_PROGRESS: { label: 'In Progress', variant: 'warning' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'danger' },
    SENT: { label: 'Sent', variant: 'primary' },
    PAID: { label: 'Paid', variant: 'success' },
    OVERDUE: { label: 'Overdue', variant: 'danger' },
    ACTIVE: { label: 'Active', variant: 'success' },
  };

  const config = statusMap[status] || { label: status, variant: 'default' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
