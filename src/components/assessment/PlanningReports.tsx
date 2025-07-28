import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  Grid3x3, 
  List, 
  MoreHorizontal,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SectionData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidence: File | null;
}

interface AssessmentRecord {
  id: string;
  timestamp: string;
  sections: { [key: string]: SectionData };
}

const PlanningReports = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReqsMet, setFilterReqsMet] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'spreadsheet' | 'kanban'>('list');

  const sectionTitles: { [key: string]: string } = {
    section1: '6.1.1 - ISMS plan considers issues and requirements',
    section2: '6.1.1 - Risks and opportunities determined',
    section3: '6.1.1 - Actions planned for risks and opportunities',
    section4: '6.1.2 - Risk assessment process defined',
    section5: '6.1.2 - Risk owners identified',
    section6: '6.1.2 - Risks analyzed and prioritized',
    section7: '6.1.3 - Risk treatment process documented',
    section8: '6.1.3 - Risk treatment options selected',
    section9: '6.1.3 - Controls selected for risks',
    section10: '6.1.3 - Statement of Applicability created',
    section11: '6.1.3 - Implementation plan exists',
    section12: '6.2 - Security objectives established',
    section13: '6.2 - Plan to achieve objectives',
    section14: '6.3 - Process for planning changes'
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [assessments, searchTerm, filterReqsMet, filterOwner]);

  const loadAssessments = () => {
    const savedData = localStorage.getItem('planningAssessments') || '[]';
    const data = JSON.parse(savedData);
    console.log('Loading planning assessments:', data);
    setAssessments(data);
  };

  const applyFilters = () => {
    let filtered = [...assessments];
    
    if (searchTerm) {
      filtered = filtered.filter(assessment => 
        Object.values(assessment.sections).some(section => 
          section.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.actionNeeded.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.actionOwner.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (filterReqsMet !== 'all') {
      filtered = filtered.filter(assessment =>
        Object.values(assessment.sections).some(section => section.reqsMet === filterReqsMet)
      );
    }
    
    if (filterOwner !== 'all') {
      filtered = filtered.filter(assessment =>
        Object.values(assessment.sections).some(section => section.actionOwner === filterOwner)
      );
    }
    
    setFilteredAssessments(filtered);
  };

  const handleDelete = (id: string) => {
    setRecordToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      const updatedAssessments = assessments.filter(a => a.id !== recordToDelete);
      setAssessments(updatedAssessments);
      localStorage.setItem('planningAssessments', JSON.stringify(updatedAssessments));
      
      toast({
        title: "Record Deleted",
        description: "Assessment record has been deleted successfully.",
      });
    }
    setDeleteDialogOpen(false);
    setRecordToDelete(null);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Timestamp', 'Section', 'REQS MET', 'Comments', 'Action Needed', 'Action Owner'];
    const rows: string[][] = [headers];
    
    filteredAssessments.forEach(assessment => {
      Object.entries(assessment.sections).forEach(([sectionId, section]) => {
        rows.push([
          assessment.id,
          new Date(assessment.timestamp).toLocaleDateString(),
          sectionTitles[sectionId] || sectionId,
          section.reqsMet,
          section.comments,
          section.actionNeeded,
          section.actionOwner
        ]);
      });
    });
    
    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planning-reports.csv';
    a.click();
  };

  const getAllOwners = () => {
    const owners = new Set<string>();
    assessments.forEach(assessment => {
      Object.values(assessment.sections).forEach(section => {
        if (section.actionOwner) owners.add(section.actionOwner);
      });
    });
    return Array.from(owners);
  };

  const renderListView = () => (
    <div className="space-y-4">
      {filteredAssessments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No planning assessments found. Save an assessment first to see it here.</p>
          </CardContent>
        </Card>
      ) : (
        filteredAssessments.map(assessment => (
          <Card key={assessment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Assessment #{assessment.id}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {new Date(assessment.timestamp).toLocaleDateString()}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(assessment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(assessment.sections).map(([sectionId, section]) => (
                  <div key={sectionId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{sectionTitles[sectionId]}</h4>
                      <Badge variant={section.reqsMet === 'yes' ? 'default' : 'destructive'}>
                        {section.reqsMet === 'yes' ? 'Met' : 'Not Met'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Comments:</span> {section.comments || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Action:</span> {section.actionNeeded || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Owner:</span> {section.actionOwner || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderSpreadsheetView = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>REQS MET</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Action Needed</TableHead>
            <TableHead>Action Owner</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssessments.map(assessment => 
            Object.entries(assessment.sections).map(([sectionId, section]) => (
              <TableRow key={`${assessment.id}-${sectionId}`}>
                <TableCell>{assessment.id}</TableCell>
                <TableCell>{new Date(assessment.timestamp).toLocaleDateString()}</TableCell>
                <TableCell className="max-w-xs truncate">{sectionTitles[sectionId]}</TableCell>
                <TableCell>
                  <Badge variant={section.reqsMet === 'yes' ? 'default' : 'destructive'}>
                    {section.reqsMet === 'yes' ? 'Met' : 'Not Met'}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{section.comments}</TableCell>
                <TableCell className="max-w-xs truncate">{section.actionNeeded}</TableCell>
                <TableCell>{section.actionOwner}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(assessment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderKanbanView = () => {
    const metColumns = filteredAssessments.filter(assessment =>
      Object.values(assessment.sections).some(section => section.reqsMet === 'yes')
    );
    const notMetColumns = filteredAssessments.filter(assessment =>
      Object.values(assessment.sections).some(section => section.reqsMet === 'no')
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-green-700 mb-4">Requirements Met</h3>
          <div className="space-y-3">
            {metColumns.map(assessment => (
              <Card key={assessment.id} className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">#{assessment.id}</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(assessment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(assessment.sections).map(([sectionId, section]) => 
                      section.reqsMet === 'yes' && (
                        <div key={sectionId} className="text-sm">
                          <div className="font-medium">{sectionTitles[sectionId]}</div>
                          <div className="text-gray-600">{section.actionOwner}</div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-red-700 mb-4">Requirements Not Met</h3>
          <div className="space-y-3">
            {notMetColumns.map(assessment => (
              <Card key={assessment.id} className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="destructive">#{assessment.id}</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(assessment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(assessment.sections).map(([sectionId, section]) => 
                      section.reqsMet === 'no' && (
                        <div key={sectionId} className="text-sm">
                          <div className="font-medium">{sectionTitles[sectionId]}</div>
                          <div className="text-gray-600">{section.actionOwner}</div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/planning')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">6. Planning Reports</h1>
            <p className="text-gray-600">Manage and analyze planning assessment data</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterReqsMet} onValueChange={setFilterReqsMet}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by REQS MET" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requirements</SelectItem>
                <SelectItem value="yes">Met</SelectItem>
                <SelectItem value="no">Not Met</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterOwner} onValueChange={setFilterOwner}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {getAllOwners().map(owner => (
                  <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="spreadsheet" className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4" />
            Spreadsheet
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <MoreHorizontal className="h-4 w-4" />
            Kanban
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {renderListView()}
        </TabsContent>

        <TabsContent value="spreadsheet">
          {renderSpreadsheetView()}
        </TabsContent>

        <TabsContent value="kanban">
          {renderKanbanView()}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assessment record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlanningReports;