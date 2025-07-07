
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { RiskAnalysis } from "@/components/risk/RiskAnalysis";
import { AssessmentGap } from "@/components/assessment/AssessmentGap";
import { AssessmentEvidence } from "@/components/assessment/AssessmentEvidence";
import { TreatmentDashboard } from "@/components/treatment/TreatmentDashboard";
import { CompanyDetails } from "@/components/company/CompanyDetails";

type PageType = 'dashboard' | 'risk-analysis' | 'assessment-gap' | 'assessment-evidence' | 'treatment-dashboard' | 'company-details';

const Index = () => {
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'risk-analysis':
        return <RiskAnalysis />;
      case 'assessment-gap':
        return <AssessmentGap />;
      case 'assessment-evidence':
        return <AssessmentEvidence />;
      case 'treatment-dashboard':
        return <TreatmentDashboard />;
      case 'company-details':
        return <CompanyDetails />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
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
