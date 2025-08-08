import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  Grid3X3,
  List,
  BarChart3,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface PerformanceEvaluationReportsProps {
  setActivePage?: (page: string) => void;
}

interface SectionData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidenceFile: File | null;
}

interface PerformanceEvaluationAssessment {
  id: string;
  timestamp: string;
  sections: Record<string, SectionData>;
}

const sectionTitles = {
  "9.1.1": "9.1 Monitoring - Methods Defined",
  "9.1.2": "9.1 Monitoring - ISMS Effectiveness",
  "9.2.1": "9.2 Internal Audit - Qualified Personnel",
  "9.2.2": "9.2 Internal Audit - Results Communication",
  "9.3.1": "9.3 Management Review - Regular Reviews",
  "9.3.2": "9.3 Management Review - Standard Topics"
};

export const PerformanceEvaluationReports = ({ setActivePage }: PerformanceEvaluationReportsProps) => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<PerformanceEvaluationAssessment[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [activeView, setActiveView] = useState("list");

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    filterData();
  }, [assessments, searchTerm, filterBy]);

  const loadAssessments = () => {
    const saved = localStorage.getItem('performanceEvaluationAssessments');
    if (saved) {
      const parsedAssessments = JSON.parse(saved);
      setAssessments(parsedAssessments);
      console.log('Loaded Performance Evaluation assessments:', parsedAssessments);
    } else {
      console.log('No Performance Evaluation assessments found in localStorage');
    }
  };

  const filterData = () => {
    let flattened: any[] = [];
    
    assessments.forEach(assessment => {
      Object.entries(assessment.sections).forEach(([sectionId, data]) => {
        flattened.push({
          id: `${assessment.id}-${sectionId}`,
          assessmentId: assessment.id,
          timestamp: assessment.timestamp,
          sectionId,
          sectionTitle: sectionTitles[sectionId as keyof typeof sectionTitles] || sectionId,
          ...data
        });
      });
    });

    // Apply filters
    let filtered = flattened;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.sectionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.actionNeeded.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.actionOwner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBy !== "all") {
      filtered = filtered.filter(item => item.reqsMet === filterBy);
    }

    setFilteredData(filtered);
  };

  const handleDelete = (assessmentId: string) => {
    const updatedAssessments = assessments.filter(a => a.id !== assessmentId);
    setAssessments(updatedAssessments);
    localStorage.setItem('performanceEvaluationAssessments', JSON.stringify(updatedAssessments));
    
    toast({
      title: "Assessment Deleted",
      description: "The assessment has been removed successfully."
    });
  };

  const exportToExcel = () => {
    const exportData = filteredData.map(item => ({
      'Assessment ID': item.assessmentId,
      'Date': new Date(item.timestamp).toLocaleDateString(),
      'Section': item.sectionTitle,
      'REQS MET': item.reqsMet,
      'Comments': item.comments,
      'Action Needed': item.actionNeeded,
      'Action Owner': item.actionOwner,
      'Has Evidence': item.evidenceFile ? 'Yes' : 'No'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "9. Performance Evaluation Reports");
    XLSX.writeFile(wb, `performance-evaluation-assessment-${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Export Successful",
      description: "Data exported to Excel successfully!"
    });
  };

  const exportToCSV = () => {
    const exportData = filteredData.map(item => ({
      'Assessment ID': item.assessmentId,
      'Date': new Date(item.timestamp).toLocaleDateString(),
      'Section': item.sectionTitle,
      'REQS MET': item.reqsMet,
      'Comments': item.comments,
      'Action Needed': item.actionNeeded,
      'Action Owner': item.actionOwner,
      'Has Evidence': item.evidenceFile ? 'Yes' : 'No'
    }));

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(h => `"${row[h as keyof typeof row] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-evaluation-assessment-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Data exported to CSV successfully!"
    });
  };

  const getUniqueOwners = () => {
    return [...new Set(filteredData.map(item => item.actionOwner).filter(Boolean))];
  };

  const renderListView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>REQS MET</TableHead>
              <TableHead>Action Owner</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No Performance Evaluation assessments found. Go to the 9. Performance Evaluation page to create your first assessment.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{item.sectionTitle}</TableCell>
                  <TableCell>
                    <Badge variant={item.reqsMet === 'yes' ? 'default' : 'destructive'}>
                      {item.reqsMet}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.actionOwner || 'Not assigned'}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.comments}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(item.assessmentId)}
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
      </CardContent>
    </Card>
  );

  const renderKanbanView = () => {
    const groupedByStatus = {
      yes: filteredData.filter(item => item.reqsMet === 'yes'),
      no: filteredData.filter(item => item.reqsMet === 'no'),
      unassigned: filteredData.filter(item => !item.reqsMet)
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedByStatus).map(([status, items]) => (
          <Card key={status} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {status === 'yes' ? 'Requirements Met' : 
                 status === 'no' ? 'Requirements Not Met' : 'Unassigned'} 
                <Badge variant="secondary" className="ml-2">{items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map(item => (
                <Card key={item.id} className="p-3">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">{item.sectionTitle}</div>
                    <div className="text-xs text-gray-600">{item.actionOwner || 'No owner'}</div>
                    {item.comments && (
                      <div className="text-xs text-gray-700 line-clamp-2">{item.comments}</div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSpreadsheetView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Editable Grid View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Date</TableHead>
                <TableHead className="min-w-[200px]">Section</TableHead>
                <TableHead className="min-w-[120px]">REQS MET</TableHead>
                <TableHead className="min-w-[150px]">Action Owner</TableHead>
                <TableHead className="min-w-[200px]">Comments</TableHead>
                <TableHead className="min-w-[200px]">Action Needed</TableHead>
                <TableHead className="min-w-[100px]">Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{item.sectionTitle}</TableCell>
                    <TableCell>
                      <Badge variant={item.reqsMet === 'yes' ? 'default' : 'destructive'}>
                        {item.reqsMet}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.actionOwner || 'Not assigned'}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={item.comments}>
                        {item.comments}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={item.actionNeeded}>
                        {item.actionNeeded}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.evidenceFile ? 
                        <Badge variant="outline">Yes</Badge> : 
                        <Badge variant="secondary">No</Badge>
                      }
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setActivePage?.('performance-evaluation')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to 9. Performance Evaluation
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">9. Performance Evaluation Reports</h1>
            <p className="text-gray-600 mt-1">View and manage Performance Evaluation assessment data</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by REQS MET" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="yes">Requirements Met</SelectItem>
                  <SelectItem value="no">Requirements Not Met</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToExcel} className="flex items-center gap-2">
                <Download size={16} />
                Excel
              </Button>
              <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
                <Download size={16} />
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List size={16} />
            List View
          </TabsTrigger>
          <TabsTrigger value="spreadsheet" className="flex items-center gap-2">
            <Grid3X3 size={16} />
            Spreadsheet View
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Kanban View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {renderListView()}
        </TabsContent>

        <TabsContent value="spreadsheet" className="space-y-6">
          {renderSpreadsheetView()}
        </TabsContent>

        <TabsContent value="kanban" className="space-y-6">
          {renderKanbanView()}
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredData.length}</div>
            <p className="text-xs text-muted-foreground">Total Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {filteredData.filter(item => item.reqsMet === 'yes').length}
            </div>
            <p className="text-xs text-muted-foreground">Requirements Met</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {filteredData.filter(item => item.reqsMet === 'no').length}
            </div>
            <p className="text-xs text-muted-foreground">Requirements Not Met</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {getUniqueOwners().length}
            </div>
            <p className="text-xs text-muted-foreground">Unique Action Owners</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};