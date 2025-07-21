
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, Calendar, Headphones, Settings, TrendingUp, ArrowUp, Shield, User, Monitor, Cpu } from "lucide-react";

interface AssessmentGapProps {
  setActivePage?: (page: string) => void;
}

export const AssessmentGap = ({ setActivePage }: AssessmentGapProps) => {
  const assessmentSections = [
    {
      id: 'context-org',
      title: '4. Context of Organization',
      description: 'Understanding the organization and its context',
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      id: 'leadership',
      title: 'Leadership',
      description: 'Leadership and commitment assessment',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 'planning',
      title: 'Planning',
      description: 'Planning for information security management',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Support processes and resources',
      icon: Headphones,
      color: 'bg-orange-500'
    },
    {
      id: 'operation',
      title: 'Operation',
      description: 'Operational planning and control',
      icon: Settings,
      color: 'bg-red-500'
    },
    {
      id: 'performance',
      title: 'Performance Evaluation',
      description: 'Performance evaluation and monitoring',
      icon: TrendingUp,
      color: 'bg-indigo-500'
    },
    {
      id: 'improvement',
      title: 'Improvement',
      description: 'Continual improvement processes',
      icon: ArrowUp,
      color: 'bg-teal-500'
    },
    {
      id: 'a5-controls',
      title: 'A.5 Organizational Controls',
      description: 'Organizational security controls',
      icon: Shield,
      color: 'bg-yellow-500'
    },
    {
      id: 'a6-controls',
      title: 'A.6 People Controls',
      description: 'People-related security controls',
      icon: User,
      color: 'bg-pink-500'
    },
    {
      id: 'a7-controls',
      title: 'A.7 Physical Controls',
      description: 'Physical and environmental security controls',
      icon: Monitor,
      color: 'bg-cyan-500'
    },
    {
      id: 'a8-controls',
      title: 'A.8 Technological Controls',
      description: 'Technology-related security controls',
      icon: Cpu,
      color: 'bg-emerald-500'
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    // For now, all sections navigate to the same assessment-gap page
    // In the future, each could have its own dedicated page
    setActivePage?.('assessment-gap');
    
    // You could also scroll to a specific section or show section-specific content
    console.log(`Navigating to ${sectionId} assessment`);
  };

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
          <p className="text-gray-600 mb-6">
            Select an assessment section to begin your ISO 27001 compliance gap analysis
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessmentSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Card
                  key={section.id}
                  className="hover:shadow-md transition-shadow cursor-pointer border-l-4 hover:border-l-primary"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${section.color} p-2 rounded-lg text-white flex-shrink-0`}>
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {section.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSectionClick(section.id);
                          }}
                        >
                          Start Assessment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
