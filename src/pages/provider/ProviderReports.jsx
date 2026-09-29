import React from 'react';
import { FileBarChart, TrendingUp, DollarSign, Wrench, CheckCircle2, Download, Printer } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardCard } from '../../components/common/DashboardCard';
import { Button } from '../../components/common/Button';

export const ProviderReports = () => {
  const monthlyRevenue = [
    { month: 'Apr', revenue: 42000, jobs: 28 },
    { month: 'May', revenue: 58000, jobs: 36 },
    { month: 'Jun', revenue: 51000, jobs: 32 },
    { month: 'Jul', revenue: 64000, jobs: 41 },
    { month: 'Aug', revenue: 72000, jobs: 45 },
    { month: 'Sep', revenue: 86000, jobs: 52 }
  ];

  const techEfficiency = [
    { name: 'Vignesh K.', jobs: 18, rating: 4.9 },
    { name: 'Santhosh M.', jobs: 15, rating: 4.8 },
    { name: 'Dinesh K.', jobs: 12, rating: 4.8 },
    { name: 'Gokul R.', jobs: 16, rating: 4.9 }
  ];

  return (
    <div>
      <PageHeader
        title="Workshop Analytics & Performance Reports"
        subtitle="Revenue analytics, job turnaround metrics, and bay technician productivity"
        breadcrumbs={[{ label: 'Reports' }]}
        actions={
          <Button
            variant="secondary"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print Report Summary
          </Button>
        }
      />

      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <DashboardCard
          title="Monthly Service Revenue"
          value="₹86,000"
          subtitle="September gross billings"
          icon={TrendingUp}
          color="success"
          trend="+19.4%"
          trendLabel="vs last month"
        />
        <DashboardCard
          title="Total Vehicles Cleared"
          value="52"
          subtitle="Across 4 workshop bays"
          icon={CheckCircle2}
          color="primary"
          trend="+7 Jobs"
          trendLabel="monthly growth"
        />
        <DashboardCard
          title="Average Turnaround Time"
          value="3.4 hrs"
          subtitle="From check-in to ready"
          icon={Wrench}
          color="info"
        />
      </div>

      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Revenue Growth Chart */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Monthly Revenue Trend (₹)
          </h3>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Gross Revenue']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Technician Productivity Bar Chart */}
        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Technician Completed Jobs Load
          </h3>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techEfficiency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="jobs" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
