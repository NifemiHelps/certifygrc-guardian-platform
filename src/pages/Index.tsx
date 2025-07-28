
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { RiskAnalysis } from "@/components/risk/RiskAnalysis";
import { AssessmentGap } from "@/components/assessment/AssessmentGap";
import { AssessmentEvidence } from "@/components/assessment/AssessmentEvidence";
import { ContextOfOrganization } from "@/components/assessment/ContextOfOrganization";
import { ContextOfOrganizationReports } from "@/components/assessment/ContextOfOrganizationReports";
import { Leadership } from "@/components/assessment/Leadership";
import { LeadershipReports } from "@/components/assessment/LeadershipReports";
import Planning from "@/components/assessment/Planning";
import PlanningReports from "@/components/assessment/PlanningReports";
import { TreatmentDashboard } from "@/components/treatment/TreatmentDashboard";
import { CompanyDetails } from "@/components/company/CompanyDetails";

type PageType = 'dashboard' | 'risk-analysis' | 'assessment-gap' | 'assessment-evidence' | 'treatment-dashboard' | 'company-details' | 'context-org' | 'context-organization-reports' | 'leadership' | 'leadership-reports' | 'planning' | 'planning-reports';

const Index = () => {
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSetActivePage = (page: string) => {
    setActivePage(page as PageType);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'risk-analysis':
        return <RiskAnalysis />;
      case 'assessment-gap':
        return <AssessmentGap setActivePage={handleSetActivePage} />;
      case 'assessment-evidence':
        return <AssessmentEvidence />;
      case 'treatment-dashboard':
        return <TreatmentDashboard />;
      case 'company-details':
        return <CompanyDetails />;
      case 'context-org':
        return <ContextOfOrganization setActivePage={handleSetActivePage} />;
      case 'context-organization-reports':
        return <ContextOfOrganizationReports setActivePage={handleSetActivePage} />;
      case 'leadership':
        return <Leadership setActivePage={handleSetActivePage} />;
      case 'leadership-reports':
        return <LeadershipReports setActivePage={handleSetActivePage} />;
      case 'planning':
        return <Planning />;
      case 'planning-reports':
        return <PlanningReports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activePage={activePage} 
        setActivePage={handleSetActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
