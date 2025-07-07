
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Upload, FileText } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      title: "Add New Risk Owner",
      description: "Register a new risk owner to the system",
      icon: UserPlus,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Add New Treatment Plan",
      description: "Create a comprehensive treatment plan",
      icon: Plus,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Upload New Evidence",
      description: "Upload supporting documentation",
      icon: Upload,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Generate Report",
      description: "Create compliance and risk reports",
      icon: FileText,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:border-gray-300"
            >
              <div className={`p-3 rounded-full text-white ${action.color}`}>
                <action.icon size={24} />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">{action.title}</div>
                <div className="text-xs text-gray-500 mt-1">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
