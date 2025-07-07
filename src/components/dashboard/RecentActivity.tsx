
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, AlertTriangle } from "lucide-react";

export const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "risk_assessment",
      title: "High-risk vulnerability identified in Payment Processing",
      user: "John Smith",
      time: "2 hours ago",
      status: "high",
      icon: AlertTriangle
    },
    {
      id: 2,
      type: "evidence_upload",
      title: "ISO 27001 Certification uploaded for Infrastructure",
      user: "Sarah Johnson",
      time: "4 hours ago",
      status: "completed",
      icon: FileText
    },
    {
      id: 3,
      type: "treatment_plan",
      title: "Treatment plan approved for Data Encryption Controls",
      user: "Mike Davis",
      time: "6 hours ago",
      status: "approved",
      icon: User
    },
    {
      id: 4,
      type: "gap_assessment",
      title: "Gap assessment completed for A.8 Technological Controls",
      user: "Emily Wilson",
      time: "1 day ago",
      status: "completed",
      icon: FileText
    },
    {
      id: 5,
      type: "risk_assessment",
      title: "Medium-risk finding in Access Control Management",
      user: "David Brown",
      time: "1 day ago",
      status: "medium",
      icon: AlertTriangle
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Medium Risk</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Approved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={20} />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <activity.icon size={16} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 mb-1">{activity.title}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
