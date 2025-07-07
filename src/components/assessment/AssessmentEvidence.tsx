
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AssessmentEvidence = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assessment Evidence</h1>
        <p className="text-gray-600 mt-1">Evidence collection and management for ISO compliance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evidence Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Evidence Assessment Module</h3>
            <p className="text-gray-500">Evidence collection and tracking system coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
