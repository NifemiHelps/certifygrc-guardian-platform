import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Download, Upload, Search, Filter, Trash2, Eye, Edit, FileText, Users, CheckCircle, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

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
  sections: {
    [key: string]: SectionData;
  };
}

const OperationReports = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [filterReqsMet, setFilterReqsMet] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'spreadsheet' | 'kanban'>('list');

  const sections = [
    {
      id: 'section1',
      title: '8.1 Operational planning and control',
      question: 'Are planned changes controlled and the consequences of unplanned changes mitigated?'
    },
    {
      id: 'section2', 
      title: '8.1 Operational planning and control',
      question: 'Are outsourced processes identified and controlled?'
    },
    {
      id: 'section3',
      title: '8.2 Information security risk assessment',
      question: 'Are documented risk assessments carried out at planned intervals and when significant change happens?'
    },
    {
      id: 'section4',
      title: '8.3 Information security risk treatment', 
      question: 'Is the information security risk treatment plan being implemented and results documented?'
    }
  ];

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [assessments, searchTerm, filterOwner, filterReqsMet]);

  const loadAssessments = () => {
    const saved = localStorage.getItem('operationAssessments');
    console.log('Loading assessments from localStorage:', saved);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('Parsed assessments:', parsed);
      setAssessments(parsed);
    } else {
      console.log('No saved assessments found');
    }
  };

  const applyFilters = () => {
    let filtered = assessments;

    if (searchTerm) {
      filtered = filtered.filter(assessment =>
        Object.values(assessment.sections).some(section =>
          section.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.actionNeeded.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.actionOwner.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterOwner && filterOwner !== 'all') {
      filtered = filtered.filter(assessment =>
        Object.values(assessment.sections).some(section =>
          section.actionOwner.toLowerCase().includes(filterOwner.toLowerCase())
        )
      );
    }

    if (filterReqsMet && filterReqsMet !== 'all') {
      filtered = filtered.filter(assessment =>
        Object.values(assessment.sections).some(section =>
          section.reqsMet === filterReqsMet
        )
      );
    }

    setFilteredAssessments(filtered);
  };

  const handleDelete = (id: string) => {
    setSelectedAssessment(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAssessment) {
      const updated = assessments.filter(a => a.id !== selectedAssessment);
      setAssessments(updated);
      localStorage.setItem('operationAssessments', JSON.stringify(updated));
      toast({
        title: "Assessment Deleted",
        description: "The assessment record has been deleted successfully."
      });
    }
    setDeleteDialogOpen(false);
    setSelectedAssessment(null);
  };

  const exportToCSV = () => {
    const csvData = filteredAssessments.map(assessment => {
      const row: any = {
        'Assessment ID': assessment.id,
        'Date Created': new Date(assessment.timestamp).toLocaleDateString(),
      };
      
      sections.forEach((section, index) => {
        const sectionData = assessment.sections[section.id] as SectionData || {
          reqsMet: '',
          comments: '',
          actionNeeded: '',
          actionOwner: '',
          evidence: null
        };
        row[`Section ${index + 1} - REQS MET`] = sectionData.reqsMet || '';
        row[`Section ${index + 1} - Comments`] = sectionData.comments || '';
        row[`Section ${index + 1} - Action Needed`] = sectionData.actionNeeded || '';
        row[`Section ${index + 1} - Action Owner`] = sectionData.actionOwner || '';
        row[`Section ${index + 1} - Evidence`] = sectionData.evidence ? 'Yes' : 'No';
      });
      
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Operation Assessments');
    XLSX.writeFile(wb, 'operation_assessments.xlsx');
    
    toast({
      title: "Export Successful",
      description: "Assessments have been exported to Excel file."
    });
  };

  const getAllOwners = () => {
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

  const renderListView = () => {
    console.log('Rendering list view with assessments:', filteredAssessments);
    
    if (filteredAssessments.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No assessments found.</p>
          <Button onClick={() => onNavigate('operation')} variant="outline">
            Create Your First Assessment
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredAssessments.map((assessment) => (
          <Card key={assessment.id} className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Assessment {assessment.id}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Created: {new Date(assessment.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(assessment.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sections.map((section, index) => {
                const sectionData = assessment.sections[section.id] as SectionData || {
                  reqsMet: '',
                  comments: '',
                  actionNeeded: '',
                  actionOwner: '',
                  evidence: null
                };
                return (
                  <div key={section.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Section {index + 1}</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-1">
                        {sectionData.reqsMet === 'yes' ? 
                          <CheckCircle className="h-3 w-3 text-green-600" /> : 
                          <XCircle className="h-3 w-3 text-red-600" />
                        }
                        <span className={sectionData.reqsMet === 'yes' ? 'text-green-600' : 'text-red-600'}>
                          {sectionData.reqsMet === 'yes' ? 'Met' : 'Not Met'}
                        </span>
                      </div>
                      <p className="text-gray-600">Owner: {sectionData.actionOwner}</p>
                      {sectionData.evidence && (
                        <Badge variant="secondary" className="text-xs">Has Evidence</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

  const renderSpreadsheetView = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assessment ID</TableHead>
            <TableHead>Date</TableHead>
            {sections.map((section, index) => (
              <TableHead key={section.id} className="text-center">
                Section {index + 1}
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssessments.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell className="font-medium">{assessment.id}</TableCell>
              <TableCell>{new Date(assessment.timestamp).toLocaleDateString()}</TableCell>
              {sections.map((section) => {
                const sectionData = assessment.sections[section.id] as SectionData || {
                  reqsMet: '',
                  comments: '',
                  actionNeeded: '',
                  actionOwner: '',
                  evidence: null
                };
                return (
                  <TableCell key={section.id} className="text-center">
                    <div className="space-y-1">
                      <Badge variant={sectionData.reqsMet === 'yes' ? 'default' : 'destructive'}>
                        {sectionData.reqsMet === 'yes' ? 'Met' : 'Not Met'}
                      </Badge>
                      <p className="text-xs text-gray-600">{sectionData.actionOwner}</p>
                    </div>
                  </TableCell>
                );
              })}
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(assessment.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderKanbanView = () => {
    const reqsMet = filteredAssessments.filter(assessment =>
      Object.values(assessment.sections).some(section => section.reqsMet === 'yes')
    );
    const reqsNotMet = filteredAssessments.filter(assessment =>
      Object.values(assessment.sections).some(section => section.reqsMet === 'no')
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Requirements Met ({reqsMet.length})
          </h3>
          <div className="space-y-3">
            {reqsMet.map((assessment) => (
              <Card key={assessment.id} className="shadow-sm border-green-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Assessment {assessment.id}</h4>
                    <Badge variant="default">Complete</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {new Date(assessment.timestamp).toLocaleDateString()}
                  </p>
                  <div className="space-y-2">
                    {sections.map((section, index) => {
                      const sectionData = assessment.sections[section.id] as SectionData || {
                        reqsMet: '',
                        comments: '',
                        actionNeeded: '',
                        actionOwner: '',
                        evidence: null
                      };
                      if (sectionData.reqsMet === 'yes') {
                        return (
                          <div key={section.id} className="text-xs p-2 bg-green-50 rounded">
                            <strong>Section {index + 1}:</strong> {sectionData.actionOwner}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Requirements Not Met ({reqsNotMet.length})
          </h3>
          <div className="space-y-3">
            {reqsNotMet.map((assessment) => (
              <Card key={assessment.id} className="shadow-sm border-red-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Assessment {assessment.id}</h4>
                    <Badge variant="destructive">Action Required</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {new Date(assessment.timestamp).toLocaleDateString()}
                  </p>
                  <div className="space-y-2">
                    {sections.map((section, index) => {
                      const sectionData = assessment.sections[section.id] as SectionData || {
                        reqsMet: '',
                        comments: '',
                        actionNeeded: '',
                        actionOwner: '',
                        evidence: null
                      };
                      if (sectionData.reqsMet === 'no') {
                        return (
                          <div key={section.id} className="text-xs p-2 bg-red-50 rounded">
                            <strong>Section {index + 1}:</strong> {sectionData.actionOwner}
                            <p className="mt-1 text-gray-600">{sectionData.actionNeeded}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button
              onClick={() => onNavigate('operation')}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to 8. Operation Assessment
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">8. Operation Reports</h1>
            <p className="text-gray-600 mt-2">
              Manage and analyze your operation assessment data
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterOwner} onValueChange={setFilterOwner}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              {getAllOwners().map(owner => (
                <SelectItem key={owner} value={owner}>{owner}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterReqsMet} onValueChange={setFilterReqsMet}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="yes">Requirements Met</SelectItem>
              <SelectItem value="no">Requirements Not Met</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredAssessments.length} assessments
          </div>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="spreadsheet">Spreadsheet</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {renderListView()}
        </TabsContent>

        <TabsContent value="spreadsheet" className="mt-6">
          {renderSpreadsheetView()}
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          {renderKanbanView()}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assessment? This action cannot be undone.
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

export default OperationReports;