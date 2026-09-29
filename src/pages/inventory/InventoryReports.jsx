import { FileBarChart, Boxes, AlertTriangle, TrendingUp, Printer } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { DashboardCard } from '../../components/common/DashboardCard';
import { Button } from '../../components/common/Button';

export const InventoryReports = () => {
  const partsUsageData = [
    { part: 'Synthetic Oil', requested: 24, issued: 24 },
    { part: 'Brake Pads', requested: 18, issued: 16 },
    { part: 'Oil Filter', requested: 22, issued: 22 },
    { part: 'Cabin Filter', requested: 14, issued: 12 },
    { part: 'Spark Plugs', requested: 12, issued: 12 },
    { part: 'AGM Battery', requested: 6, issued: 5 }
  ];

  return (
    <div>
      <PageHeader
        title="Inventory Analytics & Stock Consumption Reports"
        subtitle="Stock movement velocity, highest consumed spare parts, and valuation breakdown"
        breadcrumbs={[{ label: 'Inventory Reports' }]}
        actions={
          <Button variant="secondary" icon={Printer} onClick={() => window.print()}>
            Print Summary Report
          </Button>
        }
      />

      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <DashboardCard
          title="Total Store Valuation"
          value="₹4,25,800"
          subtitle="Total available store value"
          icon={Boxes}
          color="success"
        />
        <DashboardCard
          title="Stock Turnover Rate"
          value="4.8x"
          subtitle="Annualized velocity"
          icon={TrendingUp}
          color="primary"
        />
        <DashboardCard
          title="Fulfillment Rate"
          value="96.4%"
          subtitle="Parts requests fulfilled on time"
          icon={Boxes}
          color="info"
        />
      </div>

      <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          Top Consumed Spare Parts (Requested vs Issued to Bay)
        </h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={partsUsageData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="part" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Legend />
              <Bar dataKey="requested" fill="#2563eb" name="Units Requested" radius={[4, 4, 0, 0]} />
              <Bar dataKey="issued" fill="#10b981" name="Units Issued" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
