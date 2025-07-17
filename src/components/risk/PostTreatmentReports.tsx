
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  FileText,
  Grid,
  List,
  Columns,
  Printer,
  Share,
  Eye
} from "lucide-react";
import * as XLSX from "xlsx";

interface PostTreatmentReportsProps {
  onBackToForm: () => void;
}

type ViewMode = 'list' | 'spreadsheet' | 'kanban';

interface Assessment {
  id: string;
  existingControls: string;
  likelihoodPostTreatment: string;
  likelihoodRationalePostTreatment: string;
  impactPostTreatment: string;
  impactRationalePostTreatment: string;
  evidenceComment: string;
  evidenceFiles: Array<{
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }>;
  createdAt: string;
}

export const PostTreatmentReports = ({ onBackToForm }: PostTreatmentReportsProps) => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLikelihood, setFilterLikelihood] = useState('');
  const [filterImpact, setFilterImpact] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Assessment | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    const saved = localStorage.getItem('postTreatmentAssessments');
    if (saved) {
      setAssessments(JSON.parse(saved));
    }
  };

  const saveAssessments = (updatedAssessments: Assessment[]) => {
    localStorage.setItem('postTreatmentAssessments', JSON.stringify(updatedAssessments));
    setAssessments(updatedAssessments);
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = !searchTerm || 
      assessment.existingControls.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.likelihoodRationalePostTreatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.impactRationalePostTreatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.evidenceComment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLikelihood = !filterLikelihood || assessment.likelihoodPostTreatment === filterLikelihood;
    const matchesImpact = !filterImpact || assessment.impactPostTreatment === filterImpact;

    return matchesSearch && matchesLikelihood && matchesImpact;
  });

  const handleEdit = (assessment: Assessment) => {
    setEditingId(assessment.id);
    setEditData({ ...assessment });
  };

  const handleSaveEdit = () => {
    if (editData) {
      const updatedAssessments = assessments.map(assessment =>
        assessment.id === editData.id ? editData : assessment
      );
      saveAssessments(updatedAssessments);
      setEditingId(null);
      setEditData(null);
      toast({
        title: "Success",
        description: "Assessment updated successfully!",
      });
    }
  };

  const handleDelete = (id: string) => {
    const updatedAssessments = assessments.filter(assessment => assessment.id !== id);
    saveAssessments(updatedAssessments);
    toast({
      title: "Success",
      description: "Assessment deleted successfully!",
    });
  };

  const exportToXLSX = () => {
    const exportData = assessments.map(assessment => ({
      'ID': assessment.id,
      'Existing Controls': assessment.existingControls,
      'Likelihood (Post-Treatment)': assessment.likelihoodPostTreatment,
      'Likelihood Rationale': assessment.likelihoodRationalePostTreatment,
      'Impact (Post-Treatment)': assessment.impactPostTreatment,
      'Impact Rationale': assessment.impactRationalePostTreatment,
      'Evidence Comment': assessment.evidenceComment,
      'Evidence Files': assessment.evidenceFiles.map(f => f.name).join(', '),
      'Created At': new Date(assessment.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Post-Treatment Assessments");
    XLSX.writeFile(workbook, "post-treatment-assessments.xlsx");
    
    toast({
      title: "Success",
      description: "Data exported successfully!",
    });
  };

  const exportToCSV = () => {
    const exportData = assessments.map(assessment => ({
      'ID': assessment.id,
      'Existing Controls': assessment.existingControls,
      'Likelihood (Post-Treatment)': assessment.likelihoodPostTreatment,
      'Likelihood Rationale': assessment.likelihoodRationalePostTreatment,
      'Impact (Post-Treatment)': assessment.impactPostTreatment,
      'Impact Rationale': assessment.impactRationalePostTreatment,
      'Evidence Comment': assessment.evidenceComment,
      'Evidence Files': assessment.evidenceFiles.map(f => f.name).join(', '),
      'Created At': new Date(assessment.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'post-treatment-assessments.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Data exported to CSV successfully!",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const renderListView = () => (
    <div className="space-y-4">
      {filteredAssessments.map((assessment) => (
        <Card key={assessment.id}>
          <CardContent className="p-4">
            {editingId === assessment.id && editData ? (
              <div className="space-y-4">
                <div>
                  <Label>Existing Controls</Label>
                  <Textarea
                    value={editData.existingControls}
                    onChange={(e) => setEditData({ ...editData, existingControls: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Likelihood (Post-Treatment)</Label>
                    <Select
                      value={editData.likelihoodPostTreatment}
                      onValueChange={(value) => setEditData({ ...editData, likelihoodPostTreatment: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Very Low">Very Low</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Very High">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Impact (Post-Treatment)</Label>
                    <Select
                      value={editData.impactPostTreatment}
                      onValueChange={(value) => setEditData({ ...editData, impactPostTreatment: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Very Low">Very Low</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Very High">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} size="sm">Save</Button>
                  <Button onClick={() => setEditingId(null)} variant="outline" size="sm">Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Assessment #{assessment.id}</h3>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(assessment)} size="sm" variant="outline">
                      <Edit size={16} />
                    </Button>
                    <Button onClick={() => handleDelete(assessment.id)} size="sm" variant="outline">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Existing Controls:</strong>
                    <p className="mt-1">{assessment.existingControls}</p>
                  </div>
                  <div>
                    <strong>Likelihood:</strong> {assessment.likelihoodPostTreatment}
                    <br />
                    <strong>Impact:</strong> {assessment.impactPostTreatment}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Created: {new Date(assessment.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
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
            <TableHead>ID</TableHead>
            <TableHead>Existing Controls</TableHead>
            <TableHead>Likelihood</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead>Evidence Files</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssessments.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell>{assessment.id}</TableCell>
              <TableCell className="max-w-xs truncate">{assessment.existingControls}</TableCell>
              <TableCell>{assessment.likelihoodPostTreatment}</TableCell>
              <TableCell>{assessment.impactPostTreatment}</TableCell>
              <TableCell>{assessment.evidenceFiles.length} files</TableCell>
              <TableCell>{new Date(assessment.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(assessment)} size="sm" variant="outline">
                    <Edit size={16} />
                  </Button>
                  <Button onClick={() => handleDelete(assessment.id)} size="sm" variant="outline">
                    <Trash2 size={16} />
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
    const groupedByLikelihood = {
      'Very Low': filteredAssessments.filter(a => a.likelihoodPostTreatment === 'Very Low'),
      'Low': filteredAssessments.filter(a => a.likelihoodPostTreatment === 'Low'),
      'Medium': filteredAssessments.filter(a => a.likelihoodPostTreatment === 'Medium'),
      'High': filteredAssessments.filter(a => a.likelihoodPostTreatment === 'High'),
      'Very High': filteredAssessments.filter(a => a.likelihoodPostTreatment === 'Very High'),
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(groupedByLikelihood).map(([likelihood, assessments]) => (
          <div key={likelihood} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">{likelihood} ({assessments.length})</h3>
            <div className="space-y-2">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="p-3">
                  <div className="text-sm">
                    <div className="font-medium mb-1">Assessment #{assessment.id}</div>
                    <div className="text-gray-600 mb-2 truncate">{assessment.existingControls}</div>
                    <div className="text-xs text-gray-500">
                      Impact: {assessment.impactPostTreatment}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button onClick={() => handleEdit(assessment)} size="sm" variant="outline">
                        <Edit size={14} />
                      </Button>
                      <Button onClick={() => handleDelete(assessment.id)} size="sm" variant="outline">
                        <Trash2 size={14} />
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBackToForm} variant="outline">
            <ArrowLeft size={16} />
            Back to Form
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Post-Treatment Reports</h2>
            <p className="text-gray-600">{assessments.length} assessments found</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToXLSX} variant="outline">
            <Download size={16} />
            Export XLSX
          </Button>
          <Button onClick={exportToCSV} variant="outline">
            <Download size={16} />
            Export CSV
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer size={16} />
            Print
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterLikelihood} onValueChange={setFilterLikelihood}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Likelihood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Likelihood</SelectItem>
                <SelectItem value="Very Low">Very Low</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Very High">Very High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterImpact} onValueChange={setFilterImpact}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Impact</SelectItem>
                <SelectItem value="Very Low">Very Low</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Very High">Very High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggles */}
      <div className="flex gap-2">
        <Button
          onClick={() => setViewMode('list')}
          variant={viewMode === 'list' ? 'default' : 'outline'}
        >
          <List size={16} />
          List View
        </Button>
        <Button
          onClick={() => setViewMode('spreadsheet')}
          variant={viewMode === 'spreadsheet' ? 'default' : 'outline'}
        >
          <Grid size={16} />
          Spreadsheet View
        </Button>
        <Button
          onClick={() => setViewMode('kanban')}
          variant={viewMode === 'kanban' ? 'default' : 'outline'}
        >
          <Columns size={16} />
          Kanban View
        </Button>
      </div>

      {/* Content Area */}
      <Card>
        <CardContent className="p-6">
          {viewMode === 'list' && renderListView()}
          {viewMode === 'spreadsheet' && renderSpreadsheetView()}
          {viewMode === 'kanban' && renderKanbanView()}
          
          {filteredAssessments.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessments Found</h3>
              <p className="text-gray-500">
                {searchTerm || filterLikelihood || filterImpact
                  ? "Try adjusting your search or filters"
                  : "Create your first post-treatment assessment to get started"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
