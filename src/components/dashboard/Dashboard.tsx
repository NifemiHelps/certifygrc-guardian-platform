
import { KPICards } from "./KPICards";
import { QuickActions } from "./QuickActions";
import { RiskCharts } from "./RiskCharts";
import { RecentActivity } from "./RecentActivity";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to CertifyGRC</h1>
          <p className="text-gray-600 mt-1">Your comprehensive ISO/IEC 27001 compliance platform</p>
        </div>
      </div>

      <KPICards />
      <QuickActions />
      <RiskCharts />
      <RecentActivity />
    </div>
  );
};
