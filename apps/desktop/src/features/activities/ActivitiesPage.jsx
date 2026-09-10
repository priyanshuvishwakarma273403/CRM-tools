import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { ActivityTimeline } from '../../components/crm/ActivityTimeline';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';

export const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api.activities.getAll().then(setActivities);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Stream"
        subtitle="Real-time log of calls, meetings, emails, status changes, and deal updates."
        breadcrumbs={['CRM', 'Activities']}
      />
      <Card>
        <ActivityTimeline activities={activities} />
      </Card>
    </div>
  );
};
