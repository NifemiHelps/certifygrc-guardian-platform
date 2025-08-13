import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  FileText, 
  Edit, 
  Trash2, 
  Eye,
  Grid,
  List,
  Kanban,
  Printer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssessmentRecord {
  id: string;
  section: string;
  title: string;
  question: string;
  reqsMet: 'Yes' | 'No' | '';
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidence: string[];
  lastUpdated: string;
}

const OrganizationalControlsReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('all');
  const [filterReqsMet, setFilterReqsMet] = useState('all');
  const [filterActionOwner, setFilterActionOwner] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'spreadsheet' | 'kanban'>('list');
  const { toast } = useToast();

  // Mock data - replace with actual data from your backend
  const mockData: AssessmentRecord[] = [
    {
      id: '1',
      section: 'A.5.1',
      title: 'Policies for information security',
      question: 'An appropriate set of information security policies has been approved and communicated, and reviews happen when required.',
      reqsMet: 'Yes',
      comments: 'All policies are in place and reviewed annually.',
      actionNeeded: '',
      actionOwner: 'John Smith',
      evidence: ['policy_doc.pdf', 'review_minutes.docx'],
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      section: 'A.5.2',
      title: 'Information security roles and responsibilities',
      question: 'Everyone knows what their information security roles and responsibilities are.',
      reqsMet: 'No',
      comments: 'Some staff members are unclear about their security responsibilities.',
      actionNeeded: 'Conduct training sessions for all staff members on security roles.',
      actionOwner: 'Jane Doe',
      evidence: ['training_plan.xlsx'],
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      section: 'A.5.3',
      title: 'Segregation of duties',
      question: 'There are no conflicts of duties that could be a risk to the organization.',
      reqsMet: 'Yes',
      comments: 'Duties are properly segregated across all departments.',
      actionNeeded: '',
      actionOwner: 'Mike Johnson',
      evidence: ['segregation_matrix.xlsx', 'audit_report.pdf'],
      lastUpdated: '2024-01-13'
    }
  ];

  const [records, setRecords] = useState<AssessmentRecord[]>(mockData);

  const sections = [
    'A.5.1', 'A.5.2', 'A.5.3', 'A.5.4', 'A.5.5', 'A.5.6', 'A.5.7', 'A.5.8', 'A.5.9', 'A.5.10',
    'A.5.11', 'A.5.12', 'A.5.13', 'A.5.14', 'A.5.15', 'A.5.16', 'A.5.17', 'A.5.18', 'A.5.19', 'A.5.20',
    'A.5.21', 'A.5.22', 'A.5.23', 'A.5.24', 'A.5.25', 'A.5.26', 'A.5.27', 'A.5.28', 'A.5.29', 'A.5.30',
    'A.5.31', 'A.5.32', 'A.5.33', 'A.5.34', 'A.5.35', 'A.5.36', 'A.5.37'
  ];

  const actionOwners = [...new Set(records.map(record => record.actionOwner).filter(Boolean))];

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = 
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.actionNeeded.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.actionOwner.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSection = filterSection === 'all' || record.section === filterSection;
      const matchesReqsMet = filterReqsMet === 'all' || record.reqsMet === filterReqsMet;
      const matchesActionOwner = filterActionOwner === 'all' || record.actionOwner === filterActionOwner;

      return matchesSearch && matchesSection && matchesReqsMet && matchesActionOwner;
    });
  }, [records, searchTerm, filterSection, filterReqsMet, filterActionOwner]);

  const handleView = (record: AssessmentRecord) => {
    // Navigate to view mode or open modal
    console.log('Viewing record:', record);
  };

  const handleEdit = (record: AssessmentRecord) => {
    // Navigate to edit mode or open edit modal
    console.log('Editing record:', record);
  };

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
    toast({
      title: "Record deleted",
      description: "The assessment record has been deleted successfully."
    });
  };

  const handleExport = (format: 'xlsx' | 'csv' | 'pdf') => {
    // Implement export functionality
    toast({
      title: "Export started",
      description: `Exporting data to ${format.toUpperCase()}...`
    });
  };

  const handleImport = () => {
    // Implement import functionality
    toast({
      title: "Import started",
      description: "Please select a file to import..."
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadEvidence = () => {
    // Implement evidence download
    toast({
      title: "Download started",
      description: "Downloading all evidence files..."
    });
  };

  const renderListView = () => (
    <div className="space-y-4">
      {filteredRecords.map(record => (
        <Card key={record.id} className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-blue-700">
                {record.section} - {record.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={record.reqsMet === 'Yes' ? 'default' : 'destructive'}>
                  {record.reqsMet || 'Not Set'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => handleView(record)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Comments:</p>
                <p className="text-gray-600">{record.comments || 'No comments'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Action Owner:</p>
                <p className="text-gray-600">{record.actionOwner || 'Not assigned'}</p>
              </div>
              {record.actionNeeded && (
                <div className="md:col-span-2">
                  <p className="font-medium text-gray-700">Action Needed:</p>
                  <p className="text-gray-600">{record.actionNeeded}</p>
                </div>
              )}
              {record.evidence.length > 0 && (
                <div className="md:col-span-2">
                  <p className="font-medium text-gray-700">Evidence:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {record.evidence.map((file, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {file}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSpreadsheetView = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Section</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>REQS MET</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Action Needed</TableHead>
            <TableHead>Action Owner</TableHead>
            <TableHead>Evidence</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map(record => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.section}</TableCell>
              <TableCell className="max-w-xs truncate">{record.title}</TableCell>
              <TableCell>
                <Badge variant={record.reqsMet === 'Yes' ? 'default' : 'destructive'}>
                  {record.reqsMet || 'Not Set'}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">{record.comments}</TableCell>
              <TableCell className="max-w-xs truncate">{record.actionNeeded}</TableCell>
              <TableCell>{record.actionOwner}</TableCell>
              <TableCell>{record.evidence.length} files</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleView(record)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                    <Trash2 className="h-4 w-4" />
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
    const groupedRecords = {
      'Yes': filteredRecords.filter(r => r.reqsMet === 'Yes'),
      'No': filteredRecords.filter(r => r.reqsMet === 'No'),
      'Not Set': filteredRecords.filter(r => !r.reqsMet)
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedRecords).map(([status, records]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{status}</h3>
              <Badge variant="outline">{records.length}</Badge>
            </div>
            <div className="space-y-3">
              {records.map(record => (
                <Card key={record.id} className="p-4 shadow-sm">
                  <div className="space-y-2">
                    <p className="font-medium text-sm text-blue-700">
                      {record.section} - {record.title}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {record.comments || 'No comments'}
                    </p>
                    {record.actionOwner && (
                      <p className="text-xs text-gray-500">
                        Owner: {record.actionOwner}
                      </p>
                    )}
                    <div className="flex items-center gap-1 pt-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(record)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          A.5 Organizational Controls Reports
        </h1>
        <p className="text-gray-600">
          View and manage all assessment records for organizational controls
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterSection} onValueChange={setFilterSection}>
              <SelectTrigger>
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map(section => (
                  <SelectItem key={section} value={section}>{section}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterReqsMet} onValueChange={setFilterReqsMet}>
              <SelectTrigger>
                <SelectValue placeholder="REQS MET" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterActionOwner} onValueChange={setFilterActionOwner}>
              <SelectTrigger>
                <SelectValue placeholder="Action Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {actionOwners.map(owner => (
                  <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'spreadsheet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('spreadsheet')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <Kanban className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>

            <Select onValueChange={handleExport}>
              <SelectTrigger className="w-32">
                <Download className="h-4 w-4 mr-1" />
                Export
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownloadEvidence}>
              <FileText className="h-4 w-4 mr-1" />
              Download Evidence
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredRecords.length} of {records.length} records
        </p>
      </div>

      {/* Content based on view mode */}
      <div className="min-h-[400px]">
        {viewMode === 'list' && renderListView()}
        {viewMode === 'spreadsheet' && renderSpreadsheetView()}
        {viewMode === 'kanban' && renderKanbanView()}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No records found</p>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default OrganizationalControlsReports;