
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AssessmentGap = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assessment Gap</h1>
        <p className="text-gray-600 mt-1">ISO/IEC 27001 compliance gap analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gap Assessment Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gap Assessment Module</h3>
            <p className="text-gray-500">Comprehensive ISO 27001 compliance gap analysis coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
