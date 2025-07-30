
import { useState } from "react";
import { ChevronDown, Home, BarChart, Search, FileText, Briefcase, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }: SidebarProps) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['risk-analysis']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      page: 'dashboard'
    },
    {
      id: 'company-details',
      label: 'Company Details',
      icon: Building,
      page: 'company-details'
    },
    {
      id: 'treatment-dashboard',
      label: 'Treatment Dashboard',
      icon: Briefcase,
      page: 'treatment-dashboard'
    },
    {
      id: 'risk-analysis',
      label: 'Risk Analysis',
      icon: BarChart,
      hasSubmenu: true,
      subItems: [
        { id: 'risk-descriptions', label: 'Risk Descriptions', page: 'risk-analysis' },
        { id: 'pre-treatment', label: 'Pre-Treatment Assessment', page: 'risk-analysis' },
        { id: 'post-treatment', label: 'Post-Treatment Assessment', page: 'risk-analysis' },
        { id: 'treatment-plans', label: 'Treatment Plans', page: 'risk-analysis' }
      ]
    },
    {
      id: 'assessment-gap',
      label: 'Assessment Gap',
      icon: Search,
      hasSubmenu: true,
      subItems: [
        { id: 'context-org', label: '4. Context of Organization', page: 'context-org' },
        { id: 'leadership', label: 'Leadership', page: 'leadership' },
        { id: 'planning', label: '6. Planning', page: 'planning' },
        { id: 'support', label: '7. Support', page: 'support' },
        { id: 'operation', label: 'Operation', page: 'assessment-gap' },
        { id: 'performance', label: 'Performance Evaluation', page: 'assessment-gap' },
        { id: 'improvement', label: 'Improvement', page: 'assessment-gap' },
        { id: 'a5-controls', label: 'A.5 Organizational Controls', page: 'assessment-gap' },
        { id: 'a6-controls', label: 'A.6 People Controls', page: 'assessment-gap' },
        { id: 'a7-controls', label: 'A.7 Physical Controls', page: 'assessment-gap' },
        { id: 'a8-controls', label: 'A.8 Technological Controls', page: 'assessment-gap' }
      ]
    },
    {
      id: 'assessment-evidence',
      label: 'Assessment Evidence',
      icon: FileText,
      hasSubmenu: true,
      subItems: [
        { id: 'context-org-evidence', label: '4. Context of Organization', page: 'assessment-evidence' },
        { id: 'leadership-evidence', label: 'Leadership', page: 'assessment-evidence' },
        { id: 'planning-evidence', label: 'Planning', page: 'assessment-evidence' },
        { id: 'support-evidence', label: 'Support', page: 'assessment-evidence' },
        { id: 'operation-evidence', label: 'Operation', page: 'assessment-evidence' },
        { id: 'performance-evidence', label: 'Performance Evaluation', page: 'assessment-evidence' },
        { id: 'improvement-evidence', label: 'Improvement', page: 'assessment-evidence' }
      ]
    }
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          {isOpen && (
            <div>
              <h1 className="font-bold text-lg text-gray-900">CertifyGRC</h1>
              <p className="text-xs text-gray-500">ISO/IEC 27001 Platform</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  toggleMenu(item.id);
                } else {
                  setActivePage(item.page);
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                activePage === item.page && !item.hasSubmenu ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700"
              )}
            >
              <item.icon size={20} />
              {isOpen && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "transition-transform",
                        expandedMenus.includes(item.id) ? "rotate-180" : ""
                      )}
                    />
                  )}
                </>
              )}
            </button>

            {item.hasSubmenu && expandedMenus.includes(item.id) && isOpen && (
              <div className="bg-gray-50">
                {item.subItems?.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActivePage(subItem.page)}
                    className={cn(
                      "w-full flex items-center gap-3 px-12 py-2 text-left hover:bg-gray-100 transition-colors text-sm",
                      activePage === subItem.page ? "bg-blue-50 text-blue-600" : "text-gray-600"
                    )}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};
