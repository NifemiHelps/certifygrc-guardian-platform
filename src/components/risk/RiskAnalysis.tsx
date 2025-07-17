
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BarChart } from "lucide-react";
import { RiskDescriptionForm } from "./RiskDescriptionForm";
import { RiskDescriptionReports } from "./RiskDescriptionReports";
import { PreTreatmentForm } from "./PreTreatmentForm";
import { PreTreatmentReports } from "./PreTreatmentReports";
import { PostTreatmentForm } from "./PostTreatmentForm";
import { PostTreatmentReports } from "./PostTreatmentReports";
import { TreatmentPlanForm } from "../treatment/TreatmentPlanForm";
import { TreatmentPlanReports } from "../treatment/TreatmentPlanReports";

type RiskDescriptionView = 'form' | 'reports';
type PreTreatmentView = 'form' | 'reports';
type PostTreatmentView = 'form' | 'reports';
type TreatmentPlanView = 'form' | 'reports';

export const RiskAnalysis = () => {
  const [riskDescriptionView, setRiskDescriptionView] = useState<RiskDescriptionView>('form');
  const [preTreatmentView, setPreTreatmentView] = useState<PreTreatmentView>('form');
  const [postTreatmentView, setPostTreatmentView] = useState<PostTreatmentView>('form');
  const [treatmentPlanView, setTreatmentPlanView] = useState<TreatmentPlanView>('form');

  const renderRiskDescriptions = () => {
    if (riskDescriptionView === 'form') {
      return (
        <RiskDescriptionForm
          onViewReports={() => setRiskDescriptionView('reports')}
        />
      );
    } else {
      return (
        <RiskDescriptionReports
          onBackToForm={() => setRiskDescriptionView('form')}
        />
      );
    }
  };

  const renderPreTreatment = () => {
    if (preTreatmentView === 'form') {
      return (
        <PreTreatmentForm
          onViewReports={() => setPreTreatmentView('reports')}
        />
      );
    } else {
      return (
        <PreTreatmentReports
          onBackToForm={() => setPreTreatmentView('form')}
        />
      );
    }
  };

  const renderPostTreatment = () => {
    if (postTreatmentView === 'form') {
      return (
        <PostTreatmentForm
          onViewReports={() => setPostTreatmentView('reports')}
        />
      );
    } else {
      return (
        <PostTreatmentReports
          onBackToForm={() => setPostTreatmentView('form')}
        />
      );
    }
  };

  const renderTreatmentPlans = () => {
    if (treatmentPlanView === 'form') {
      return (
        <TreatmentPlanForm
          onViewReports={() => setTreatmentPlanView('reports')}
        />
      );
    } else {
      return (
        <TreatmentPlanReports
          onBackToForm={() => setTreatmentPlanView('form')}
        />
      );
    }
  };

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
          {renderRiskDescriptions()}
        </TabsContent>

        <TabsContent value="pre-treatment" className="space-y-6">
          {renderPreTreatment()}
        </TabsContent>

        <TabsContent value="post-treatment" className="space-y-6">
          {renderPostTreatment()}
        </TabsContent>

        <TabsContent value="treatment-plans" className="space-y-6">
          {renderTreatmentPlans()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
