
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Briefcase, FileText } from "lucide-react";

export const KPICards = () => {
  const kpis = [
    {
      title: "Total Organizations",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: Building
    },
    {
      title: "Total Risk Owners",
      value: "156",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users
    },
    {
      title: "Total Asset Groups",
      value: "89",
      change: "+5%",
      changeType: "positive" as const,
      icon: Briefcase
    },
    {
      title: "Active Assessments",
      value: "342",
      change: "+15%",
      changeType: "positive" as const,
      icon: FileText
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <p className="text-xs text-green-600 mt-1">
              {kpi.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
