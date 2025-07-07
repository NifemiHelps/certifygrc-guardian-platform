
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BarChart } from "lucide-react";

export const RiskAnalysis = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Analysis</h1>
          <p className="text-gray-600 mt-1">Comprehensive risk assessment and management</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          New Risk Assessment
        </Button>
      </div>

      <Tabs defaultValue="descriptions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="descriptions">Risk Descriptions</TabsTrigger>
          <TabsTrigger value="pre-treatment">Pre-Treatment</TabsTrigger>
          <TabsTrigger value="post-treatment">Post-Treatment</TabsTrigger>
          <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="descriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Risk Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Risk Descriptions Yet</h3>
                <p className="text-gray-500 mb-6">Start by creating your first risk description form</p>
                <Button>Create Risk Description</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pre-treatment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart size={20} />
                Pre-Treatment Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pre-Treatment Assessments</h3>
                <p className="text-gray-500 mb-6">Analyze existing controls and risk levels before treatment</p>
                <Button>Create Pre-Treatment Assessment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="post-treatment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart size={20} />
                Post-Treatment Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Post-Treatment Assessments</h3>
                <p className="text-gray-500 mb-6">Evaluate risk levels after implementing treatment plans</p>
                <Button>Create Post-Treatment Assessment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment-plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Treatment Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Treatment Plans</h3>
                <p className="text-gray-500 mb-6">Create comprehensive treatment plans for identified risks</p>
                <Button>Create Treatment Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
