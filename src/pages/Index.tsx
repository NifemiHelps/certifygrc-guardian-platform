
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Support } from "@/components/assessment/Support";
import { SupportReports } from "@/components/assessment/SupportReports";
import Operation from "@/components/assessment/Operation";
import OperationReports from "@/components/assessment/OperationReports";
import { PerformanceEvaluation } from "@/components/assessment/PerformanceEvaluation";
import { PerformanceEvaluationReports } from "@/components/assessment/PerformanceEvaluationReports";
import { TreatmentDashboard } from "@/components/treatment/TreatmentDashboard";
import { CompanyDetails } from "@/components/company/CompanyDetails";

type PageType = 'dashboard' | 'risk-analysis' | 'assessment-gap' | 'assessment-evidence' | 'treatment-dashboard' | 'company-details' | 'context-org' | 'context-organization-reports' | 'leadership' | 'leadership-reports' | 'planning' | 'planning-reports' | 'support' | 'support-reports' | 'operation' | 'operation-reports' | 'performance-evaluation' | 'performance-evaluation-reports';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Map URL paths to page types
  const pathToPageMap: Record<string, PageType> = {
    '/': 'dashboard',
    '/dashboard': 'dashboard',
    '/risk-analysis': 'risk-analysis',
    '/assessment-gap': 'assessment-gap',
    '/assessment-evidence': 'assessment-evidence',
    '/treatment-dashboard': 'treatment-dashboard',
    '/company-details': 'company-details',
    '/context-org': 'context-org',
    '/context-organization-reports': 'context-organization-reports',
    '/leadership': 'leadership',
    '/leadership-reports': 'leadership-reports',
    '/planning': 'planning',
    '/planning-reports': 'planning-reports',
    '/support': 'support',
    '/support-reports': 'support-reports',
    '/operation': 'operation',
    '/operation-reports': 'operation-reports',
    '/performance-evaluation': 'performance-evaluation',
    '/performance-evaluation-reports': 'performance-evaluation-reports'
  };

  const pageToPathMap: Record<PageType, string> = {
    'dashboard': '/dashboard',
    'risk-analysis': '/risk-analysis',
    'assessment-gap': '/assessment-gap',
    'assessment-evidence': '/assessment-evidence',
    'treatment-dashboard': '/treatment-dashboard',
    'company-details': '/company-details',
    'context-org': '/context-org',
    'context-organization-reports': '/context-organization-reports',
    'leadership': '/leadership',
    'leadership-reports': '/leadership-reports',
    'planning': '/planning',
    'planning-reports': '/planning-reports',
    'support': '/support',
    'support-reports': '/support-reports',
    'operation': '/operation',
    'operation-reports': '/operation-reports',
    'performance-evaluation': '/performance-evaluation',
    'performance-evaluation-reports': '/performance-evaluation-reports'
  };

  // Update activePage based on URL
  useEffect(() => {
    const currentPage = pathToPageMap[location.pathname];
    if (currentPage) {
      setActivePage(currentPage);
    } else {
      // If no match found, default to dashboard
      console.log('No route match found for:', location.pathname);
      setActivePage('dashboard');
    }
  }, [location.pathname]);

  const handleSetActivePage = (page: string) => {
    const pageType = page as PageType;
    setActivePage(pageType);
    // Update URL when page changes
    const path = pageToPathMap[pageType];
    if (path && location.pathname !== path) {
      navigate(path);
    }
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
      case 'support':
        return <Support setActivePage={handleSetActivePage} />;
      case 'support-reports':
        return <SupportReports setActivePage={handleSetActivePage} />;
      case 'operation':
        return <Operation onNavigate={handleSetActivePage} />;
      case 'operation-reports':
        return <OperationReports onNavigate={handleSetActivePage} />;
      case 'performance-evaluation':
        return <PerformanceEvaluation setActivePage={handleSetActivePage} />;
      case 'performance-evaluation-reports':
        return <PerformanceEvaluationReports setActivePage={handleSetActivePage} />;
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
