import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Printer, 
  Eye, 
  Edit, 
  Trash2, 
  List, 
  Grid, 
  Kanban,
  FileSpreadsheet,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentData {
  id: string;
  timestamp: string;
  sections: {
    [key: string]: {
      reqsMet: string;
      comments: string;
      actionNeeded: string;
      actionOwner: string;
      evidence: any[];
    };
  };
}

type ViewMode = 'list' | 'spreadsheet' | 'kanban';

const PeopleControlsReports: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [filterReqsMet, setFilterReqsMet] = useState<string>('all');
  const [filterActionOwner, setFilterActionOwner] = useState<string>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const sections = [
    { id: 'a61', title: 'A.6.1 Screening' },
    { id: 'a62', title: 'A.6.2 Terms and conditions of employment' },
    { id: 'a63', title: 'A.6.3 Information security awareness, education and training' },
    { id: 'a64', title: 'A.6.4 Disciplinary process' },
    { id: 'a65', title: 'A.6.5 Responsibilities after termination or change of employment' },
    { id: 'a66', title: 'A.6.6 Confidentiality or non-disclosure agreements' },
    { id: 'a67', title: 'A.6.7 Remote working' },
    { id: 'a68', title: 'A.6.8 Information security event reporting' }
  ];

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [assessments, searchTerm, filterSection, filterReqsMet, filterActionOwner]);

  const loadAssessments = () => {
    try {
      const saved = localStorage.getItem('peopleControlsAssessments');
      if (saved) {
        const parsed = JSON.parse(saved);
        setAssessments(parsed);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assessments.",
        variant: "destructive"
      });
    }
  };

  const applyFilters = () => {
    let filtered = assessments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(assessment => {
        const searchLower = searchTerm.toLowerCase();
        return Object.values(assessment.sections).some(section => 
          section.comments.toLowerCase().includes(searchLower) ||
          section.actionNeeded.toLowerCase().includes(searchLower) ||
          section.actionOwner.toLowerCase().includes(searchLower)
        );
      });
    }

    // Section filter
    if (filterSection !== 'all') {
      filtered = filtered.filter(assessment => 
        assessment.sections[filterSection]
      );
    }

    // Requirements met filter
    if (filterReqsMet !== 'all') {
      filtered = filtered.filter(assessment => 
        Object.values(assessment.sections).some(section => 
          section.reqsMet.toLowerCase() === filterReqsMet
        )
      );
    }

    // Action owner filter
    if (filterActionOwner !== 'all') {
      filtered = filtered.filter(assessment => 
        Object.values(assessment.sections).some(section => 
          section.actionOwner.toLowerCase().includes(filterActionOwner.toLowerCase())
        )
      );
    }

    setFilteredAssessments(filtered);
  };

  const deleteAssessment = (id: string) => {
    const updated = assessments.filter(assessment => assessment.id !== id);
    setAssessments(updated);
    localStorage.setItem('peopleControlsAssessments', JSON.stringify(updated));
    toast({
      title: "Assessment Deleted",
      description: "Assessment has been removed successfully.",
    });
  };

  const exportToCSV = () => {
    const headers = ['Assessment ID', 'Date', 'Section', 'Title', 'REQS MET', 'Comments', 'Action Needed', 'Action Owner'];
    const rows = filteredAssessments.flatMap(assessment => 
      Object.entries(assessment.sections).map(([sectionId, section]) => {
        const sectionTitle = sections.find(s => s.id === sectionId)?.title || sectionId;
        return [
          assessment.id,
          new Date(assessment.timestamp).toLocaleDateString(),
          sectionId.toUpperCase(),
          sectionTitle,
          section.reqsMet,
          section.comments,
          section.actionNeeded,
          section.actionOwner
        ];
      })
    );

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `people-controls-assessment-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const getUniqueActionOwners = () => {
    const owners = new Set<string>();
    assessments.forEach(assessment => {
      Object.values(assessment.sections).forEach(section => {
        if (section.actionOwner) {
          owners.add(section.actionOwner);
        }
      });
    });
    return Array.from(owners);
  };

  const renderListView = () => (
    <div className="space-y-4">
      {filteredAssessments.map(assessment => (
        <Card key={assessment.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Assessment {assessment.id}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(assessment.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedAssessment(assessment)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteAssessment(assessment.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(assessment.sections).map(([sectionId, section]) => {
                const sectionTitle = sections.find(s => s.id === sectionId)?.title || sectionId;
                return (
                  <div key={sectionId} className="space-y-2">
                    <h4 className="font-medium text-sm">{sectionTitle}</h4>
                    <Badge variant={section.reqsMet === 'yes' ? 'default' : 'destructive'}>
                      {section.reqsMet === 'yes' ? 'Met' : 'Not Met'}
                    </Badge>
                    <p className="text-xs text-muted-foreground">Owner: {section.actionOwner}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSpreadsheetView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border p-2 text-left">Date</th>
            <th className="border border-border p-2 text-left">Section</th>
            <th className="border border-border p-2 text-left">REQS MET</th>
            <th className="border border-border p-2 text-left">Comments</th>
            <th className="border border-border p-2 text-left">Action Owner</th>
            <th className="border border-border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssessments.flatMap(assessment => 
            Object.entries(assessment.sections).map(([sectionId, section]) => (
              <tr key={`${assessment.id}-${sectionId}`} className="hover:bg-muted/50">
                <td className="border border-border p-2">
                  {new Date(assessment.timestamp).toLocaleDateString()}
                </td>
                <td className="border border-border p-2">
                  {sections.find(s => s.id === sectionId)?.title || sectionId}
                </td>
                <td className="border border-border p-2">
                  <Badge variant={section.reqsMet === 'yes' ? 'default' : 'destructive'}>
                    {section.reqsMet === 'yes' ? 'Yes' : 'No'}
                  </Badge>
                </td>
                <td className="border border-border p-2 max-w-xs truncate">
                  {section.comments}
                </td>
                <td className="border border-border p-2">{section.actionOwner}</td>
                <td className="border border-border p-2">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedAssessment(assessment)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteAssessment(assessment.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderKanbanView = () => {
    const metSections = filteredAssessments.flatMap(assessment => 
      Object.entries(assessment.sections)
        .filter(([_, section]) => section.reqsMet === 'yes')
        .map(([sectionId, section]) => ({ assessment, sectionId, section }))
    );
    
    const notMetSections = filteredAssessments.flatMap(assessment => 
      Object.entries(assessment.sections)
        .filter(([_, section]) => section.reqsMet === 'no')
        .map(([sectionId, section]) => ({ assessment, sectionId, section }))
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-green-600">Requirements Met ({metSections.length})</h3>
          <div className="space-y-2">
            {metSections.map(({ assessment, sectionId, section }) => (
              <Card key={`${assessment.id}-${sectionId}`} className="border-green-200">
                <CardContent className="p-4">
                  <h4 className="font-medium">{sections.find(s => s.id === sectionId)?.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Owner: {section.actionOwner}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(assessment.timestamp).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-red-600">Requirements Not Met ({notMetSections.length})</h3>
          <div className="space-y-2">
            {notMetSections.map(({ assessment, sectionId, section }) => (
              <Card key={`${assessment.id}-${sectionId}`} className="border-red-200">
                <CardContent className="p-4">
                  <h4 className="font-medium">{sections.find(s => s.id === sectionId)?.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Owner: {section.actionOwner}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(assessment.timestamp).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">A.6 People Controls Reports</h1>
            <p className="text-muted-foreground mt-2">
              View and manage all people controls assessment records
            </p>
          </div>
          <Button 
            onClick={() => navigate('/people-controls')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterSection} onValueChange={setFilterSection}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map(section => (
                <SelectItem key={section.id} value={section.id}>
                  {section.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterReqsMet} onValueChange={setFilterReqsMet}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="REQS MET" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'spreadsheet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('spreadsheet')}
            >
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <Kanban className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'spreadsheet' && renderSpreadsheetView()}
      {viewMode === 'kanban' && renderKanbanView()}

      {filteredAssessments.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No assessments found. Create your first assessment to get started.</p>
        </Card>
      )}
    </div>
  );
};

export default PeopleControlsReports;