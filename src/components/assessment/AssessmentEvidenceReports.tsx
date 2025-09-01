import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  FileText, 
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  FileDown,
  Printer
} from "lucide-react";
import * as XLSX from 'xlsx';

interface AssessmentEvidenceReportsProps {
  setActivePage?: (page: string) => void;
}

interface SectionData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidenceFiles: File[];
}

interface EvidenceRecord {
  id: string;
  submissionDate: string;
  "4.1": SectionData;
  "4.2": SectionData;
  "4.3": SectionData;
  "4.4": SectionData;
}

const sections = [
  { id: "4.1", title: "Understanding the organization and its context" },
  { id: "4.2", title: "Understanding the needs and expectations of interested parties" },
  { id: "4.3", title: "Determining the scope of the information security management system" },
  { id: "4.4", title: "Information security management system" }
];

export const AssessmentEvidenceReports = ({ setActivePage }: AssessmentEvidenceReportsProps) => {
  const { toast } = useToast();
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingRecord, setEditingRecord] = useState<EvidenceRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const data = JSON.parse(localStorage.getItem('assessmentEvidenceData') || '[]');
    setRecords(data);
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = Object.values(record).some(value => 
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filter === "all") return matchesSearch;
    if (filter === "completed") {
      return matchesSearch && Object.values(record).some(section => 
        typeof section === 'object' && section?.reqsMet === 'yes'
      );
    }
    if (filter === "pending") {
      return matchesSearch && Object.values(record).some(section => 
        typeof section === 'object' && section?.reqsMet === 'no'
      );
    }
    return matchesSearch;
  });

  const handleEdit = (record: EvidenceRecord) => {
    setEditingRecord({ ...record });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;

    const updatedRecords = records.map(record => 
      record.id === editingRecord.id ? editingRecord : record
    );
    
    setRecords(updatedRecords);
    localStorage.setItem('assessmentEvidenceData', JSON.stringify(updatedRecords));
    setIsEditDialogOpen(false);
    setEditingRecord(null);
    
    toast({
      title: "Success",
      description: "Record updated successfully!",
    });
  };

  const handleDelete = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem('assessmentEvidenceData', JSON.stringify(updatedRecords));
    
    toast({
      title: "Success",
      description: "Record deleted successfully!",
    });
  };

  const exportToExcel = () => {
    const exportData = records.map(record => ({
      'Submission Date': new Date(record.submissionDate).toLocaleDateString(),
      'Record ID': record.id,
      '4.1 - REQS MET': record["4.1"].reqsMet,
      '4.1 - Comments': record["4.1"].comments,
      '4.1 - Action Needed': record["4.1"].actionNeeded,
      '4.1 - Action Owner': record["4.1"].actionOwner,
      '4.2 - REQS MET': record["4.2"].reqsMet,
      '4.2 - Comments': record["4.2"].comments,
      '4.2 - Action Needed': record["4.2"].actionNeeded,
      '4.2 - Action Owner': record["4.2"].actionOwner,
      '4.3 - REQS MET': record["4.3"].reqsMet,
      '4.3 - Comments': record["4.3"].comments,
      '4.3 - Action Needed': record["4.3"].actionNeeded,
      '4.3 - Action Owner': record["4.3"].actionOwner,
      '4.4 - REQS MET': record["4.4"].reqsMet,
      '4.4 - Comments': record["4.4"].comments,
      '4.4 - Action Needed': record["4.4"].actionNeeded,
      '4.4 - Action Owner': record["4.4"].actionOwner,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assessment Evidence");
    XLSX.writeFile(wb, "assessment_evidence_reports.xlsx");
    
    toast({
      title: "Success",
      description: "Data exported to Excel successfully!",
    });
  };

  const exportToCSV = () => {
    const exportData = records.map(record => ({
      'Submission Date': new Date(record.submissionDate).toLocaleDateString(),
      'Record ID': record.id,
      '4.1 - REQS MET': record["4.1"].reqsMet,
      '4.1 - Comments': record["4.1"].comments,
      '4.1 - Action Needed': record["4.1"].actionNeeded,
      '4.1 - Action Owner': record["4.1"].actionOwner,
      '4.2 - REQS MET': record["4.2"].reqsMet,
      '4.2 - Comments': record["4.2"].comments,
      '4.2 - Action Needed': record["4.2"].actionNeeded,
      '4.2 - Action Owner': record["4.2"].actionOwner,
      '4.3 - REQS MET': record["4.3"].reqsMet,
      '4.3 - Comments': record["4.3"].comments,
      '4.3 - Action Needed': record["4.3"].actionNeeded,
      '4.3 - Action Owner': record["4.3"].actionOwner,
      '4.4 - REQS MET': record["4.4"].reqsMet,
      '4.4 - Comments': record["4.4"].comments,
      '4.4 - Action Needed': record["4.4"].actionNeeded,
      '4.4 - Action Owner': record["4.4"].actionOwner,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assessment_evidence_reports.csv';
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
      {filteredRecords.map((record) => (
        <Card key={record.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Assessment Evidence Record</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(record.submissionDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    ID: {record.id}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sections.map((section) => {
                const sectionData = record[section.id as keyof EvidenceRecord] as SectionData;
                return (
                  <div key={section.id} className="space-y-2">
                    <h4 className="font-medium text-sm">{section.title}</h4>
                    <div className="flex items-center gap-2">
                      {sectionData.reqsMet === 'yes' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <Badge variant={sectionData.reqsMet === 'yes' ? 'default' : 'destructive'}>
                        {sectionData.reqsMet || 'Not Set'}
                      </Badge>
                    </div>
                    {sectionData.actionOwner && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        {sectionData.actionOwner}
                      </div>
                    )}
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
            <th className="border border-border p-2 text-left">ID</th>
            {sections.map((section) => (
              <th key={section.id} className="border border-border p-2 text-left">{section.id}</th>
            ))}
            <th className="border border-border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.id}>
              <td className="border border-border p-2">{new Date(record.submissionDate).toLocaleDateString()}</td>
              <td className="border border-border p-2">{record.id}</td>
              {sections.map((section) => {
                const sectionData = record[section.id as keyof EvidenceRecord] as SectionData;
                return (
                  <td key={section.id} className="border border-border p-2">
                    <Badge variant={sectionData.reqsMet === 'yes' ? 'default' : 'destructive'}>
                      {sectionData.reqsMet || 'Not Set'}
                    </Badge>
                  </td>
                );
              })}
              <td className="border border-border p-2">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderKanbanView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3 className="font-medium mb-4 text-center">Completed</h3>
        <div className="space-y-3">
          {filteredRecords
            .filter(record => Object.values(record).some(section => 
              typeof section === 'object' && section?.reqsMet === 'yes'
            ))
            .map((record) => (
              <Card key={record.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">ID: {record.id}</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(record.submissionDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-4 text-center">Pending</h3>
        <div className="space-y-3">
          {filteredRecords
            .filter(record => Object.values(record).some(section => 
              typeof section === 'object' && section?.reqsMet === 'no'
            ))
            .map((record) => (
              <Card key={record.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">ID: {record.id}</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(record.submissionDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-4 text-center">Mixed</h3>
        <div className="space-y-3">
          {filteredRecords
            .filter(record => {
              const hasYes = Object.values(record).some(section => 
                typeof section === 'object' && section?.reqsMet === 'yes'
              );
              const hasNo = Object.values(record).some(section => 
                typeof section === 'object' && section?.reqsMet === 'no'
              );
              return hasYes && hasNo;
            })
            .map((record) => (
              <Card key={record.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">ID: {record.id}</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(record.submissionDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessment Evidence Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage evidence assessment records</p>
        </div>
        <Button 
          onClick={() => setActivePage?.('assessment-evidence')}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Evidence Records</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <FileDown className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="spreadsheet">Spreadsheet</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
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
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Assessment Evidence Record</DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-6">
              {sections.map((section) => {
                const sectionData = editingRecord[section.id as keyof EvidenceRecord] as SectionData;
                return (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>REQS MET</Label>
                          <Select 
                            value={sectionData.reqsMet} 
                            onValueChange={(value) => {
                              setEditingRecord(prev => prev ? {
                                ...prev,
                                [section.id]: { ...sectionData, reqsMet: value }
                              } : null);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Action Owner</Label>
                          <Input
                            value={sectionData.actionOwner}
                            onChange={(e) => {
                              setEditingRecord(prev => prev ? {
                                ...prev,
                                [section.id]: { ...sectionData, actionOwner: e.target.value }
                              } : null);
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Comments</Label>
                        <Textarea
                          value={sectionData.comments}
                          onChange={(e) => {
                            setEditingRecord(prev => prev ? {
                              ...prev,
                              [section.id]: { ...sectionData, comments: e.target.value }
                            } : null);
                          }}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Action Needed</Label>
                        <Textarea
                          value={sectionData.actionNeeded}
                          onChange={(e) => {
                            setEditingRecord(prev => prev ? {
                              ...prev,
                              [section.id]: { ...sectionData, actionNeeded: e.target.value }
                            } : null);
                          }}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};