import React from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/crm/StatsCard';
import { DollarSign, Target, TrendingUp, Award, Calendar } from 'lucide-react';

export const ForecastPage = () => {
  const deals = [
    { title: 'Apex Global Enterprise CRM Rollout', value: 185000, prob: 75, close: '2026-09-30' },
    { title: 'CloudScale Multi-Tenant Integration', value: 92000, prob: 85, close: '2026-09-20' },
    { title: 'BioGenix Compliance Module', value: 240000, prob: 50, close: '2026-10-15' },
    { title: 'SolarGrid Engine', value: 45000, prob: 30, close: '2026-11-01' },
  ];

  const totalUnweighted = deals.reduce((sum, d) => sum + d.value, 0); // $562,000
  const weightedForecast = deals.reduce((sum, d) => sum + (d.value * d.prob) / 100, 0); // $350,450
  const q3Target = 500000;
  const achievementPct = ((weightedForecast / q3Target) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue & Pipeline Forecast"
        subtitle="Probability-weighted revenue forecasting and quota achievement tracking."
        breadcrumbs={['CRM', 'Forecast']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Unweighted Pipeline" value={`$${totalUnweighted.toLocaleString()}`} change="+12.4%" icon={DollarSign} />
        <StatsCard title="Weighted Forecast (Value × Prob)" value={`$${weightedForecast.toLocaleString()}`} change="+18.5%" icon={TrendingUp} />
        <StatsCard title="Quarterly Sales Target" value={`$${q3Target.toLocaleString()}`} change="Target" icon={Target} />
        <StatsCard title="Quota Achievement Pct" value={`${achievementPct}%`} change="+4.2%" icon={Award} />
      </div>

      <Card className="p-5">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
          Deals Expected Close Schedule (Weighted Projection)
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
          {deals.map((d, i) => {
            const weightedVal = (d.value * d.prob) / 100;
            return (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{d.title}</h4>
                  <p className="text-xs text-slate-400">Close Date: {d.close} • Probability: {d.prob}%</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900 dark:text-slate-100">${d.value.toLocaleString()}</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Weighted: ${weightedVal.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
