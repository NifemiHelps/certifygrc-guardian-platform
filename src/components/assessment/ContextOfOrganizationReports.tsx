import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, Filter, Edit, Trash2, Eye, Download, Upload, Printer, 
  FileText, Plus, MoreHorizontal, ArrowLeft
} from "lucide-react";
import * as XLSX from 'xlsx';

interface SectionData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidenceFiles: File[];
}

interface ContextRecord {
  id: string;
  section1: SectionData;
  section2: SectionData;
  section3: SectionData;
  section4: SectionData;
  submittedAt: string;
}

interface ContextOfOrganizationReportsProps {
  setActivePage?: (page: string) => void;
}

export const ContextOfOrganizationReports = ({ setActivePage }: ContextOfOrganizationReportsProps) => {
  const { toast } = useToast();
  const [records, setRecords] = useState<ContextRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [editingRecord, setEditingRecord] = useState<ContextRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const sections = [
    { id: "section1", title: "4.1 Understanding the organization and its context" },
    { id: "section2", title: "4.2 Understanding the needs and expectations of interested parties" },
    { id: "section3", title: "4.3 Determining the scope of the ISMS" },
    { id: "section4", title: "4.4 Information security management system" }
  ];

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const savedRecords = JSON.parse(localStorage.getItem('contextOrganizationRecords') || '[]');
    setRecords(savedRecords);
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === "" || 
      Object.values(record).some(value => {
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(v => 
            typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
      });

    const matchesFilter = filterBy === "all" || 
      Object.values(record).some(section => {
        if (typeof section === 'object' && 'reqsMet' in section) {
          return section.reqsMet === filterBy;
        }
        return false;
      });

    return matchesSearch && matchesFilter;
  });

  const handleEdit = (record: ContextRecord) => {
    setEditingRecord({ ...record });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;

    const updatedRecords = records.map(record => 
      record.id === editingRecord.id ? editingRecord : record
    );
    
    setRecords(updatedRecords);
    localStorage.setItem('contextOrganizationRecords', JSON.stringify(updatedRecords));
    
    toast({
      title: "Record Updated",
      description: "Context assessment record has been updated successfully."
    });
    
    setIsEditDialogOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem('contextOrganizationRecords', JSON.stringify(updatedRecords));
    
    toast({
      title: "Record Deleted",
      description: "Context assessment record has been deleted."
    });
  };

  const exportToExcel = () => {
    const exportData = records.map(record => {
      const row: any = {
        'Submission Date': new Date(record.submittedAt).toLocaleDateString(),
        'Record ID': record.id
      };

      sections.forEach(section => {
        const sectionData = record[section.id as keyof ContextRecord] as SectionData;
        row[`${section.title} - REQS MET`] = sectionData.reqsMet;
        row[`${section.title} - Comments`] = sectionData.comments;
        row[`${section.title} - Action Needed`] = sectionData.actionNeeded;
        row[`${section.title} - Action Owner`] = sectionData.actionOwner;
      });

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Context Organization");
    XLSX.writeFile(wb, "context-organization-reports.xlsx");
    
    toast({
      title: "Export Successful",
      description: "Records exported to Excel successfully."
    });
  };

  const exportToCSV = () => {
    const exportData = records.map(record => {
      const row: any = {
        'Submission Date': new Date(record.submittedAt).toLocaleDateString(),
        'Record ID': record.id
      };

      sections.forEach(section => {
        const sectionData = record[section.id as keyof ContextRecord] as SectionData;
        row[`${section.title} - REQS MET`] = sectionData.reqsMet;
        row[`${section.title} - Comments`] = sectionData.comments;
        row[`${section.title} - Action Needed`] = sectionData.actionNeeded;
        row[`${section.title} - Action Owner`] = sectionData.actionOwner;
      });

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'context-organization-reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful", 
      description: "Records exported to CSV successfully."
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Initiated",
      description: "Print dialog opened."
    });
  };

  const renderListView = () => (
    <div className="space-y-4">
      {filteredRecords.map((record) => (
        <Card key={record.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Context Assessment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Submitted: {new Date(record.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(record.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map(section => {
                const sectionData = record[section.id as keyof ContextRecord] as SectionData;
                return (
                  <div key={section.id} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2">{section.title}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>REQS MET:</span>
                        <Badge variant={sectionData.reqsMet === 'yes' ? 'default' : 'destructive'}>
                          {sectionData.reqsMet}
                        </Badge>
                      </div>
                      {sectionData.actionOwner && (
                        <div>
                          <span className="font-medium">Owner:</span> {sectionData.actionOwner}
                        </div>
                      )}
                      {sectionData.comments && (
                        <div>
                          <span className="font-medium">Comments:</span> {sectionData.comments}
                        </div>
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

  const renderSpreadsheetView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border p-2">Date</th>
            <th className="border border-border p-2">ID</th>
            {sections.map(section => (
              <th key={section.id} className="border border-border p-2">{section.title}</th>
            ))}
            <th className="border border-border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.id}>
              <td className="border border-border p-2">
                {new Date(record.submittedAt).toLocaleDateString()}
              </td>
              <td className="border border-border p-2">{record.id}</td>
              {sections.map(section => {
                const sectionData = record[section.id as keyof ContextRecord] as SectionData;
                return (
                  <td key={section.id} className="border border-border p-2">
                    <Badge variant={sectionData.reqsMet === 'yes' ? 'default' : 'destructive'}>
                      {sectionData.reqsMet}
                    </Badge>
                  </td>
                );
              })}
              <td className="border border-border p-2">
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(record.id)}>
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

  const renderKanbanView = () => {
    const groupedRecords = {
      yes: filteredRecords.filter(record => 
        Object.values(record).some(section => 
          typeof section === 'object' && 'reqsMet' in section && section.reqsMet === 'yes'
        )
      ),
      no: filteredRecords.filter(record => 
        Object.values(record).some(section => 
          typeof section === 'object' && 'reqsMet' in section && section.reqsMet === 'no'
        )
      )
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedRecords).map(([status, records]) => (
          <div key={status}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              Requirements {status === 'yes' ? 'Met' : 'Not Met'}
              <Badge variant="outline">{records.length}</Badge>
            </h3>
            <div className="space-y-3">
              {records.map((record) => (
                <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Assessment {record.id}</h4>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(record.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.submittedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
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
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePage?.('context-org')}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Assessment
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Context of Organization Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage assessment records</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="yes">Requirements Met</SelectItem>
                <SelectItem value="no">Requirements Not Met</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                XLSX
              </Button>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Display */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="spreadsheet">Spreadsheet View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Context Assessment</DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-6">
              {sections.map(section => {
                const sectionData = editingRecord[section.id as keyof ContextRecord] as SectionData;
                return (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>REQS MET</Label>
                          <Select
                            value={sectionData.reqsMet}
                            onValueChange={(value) => {
                              setEditingRecord(prev => {
                                if (!prev) return prev;
                                const currentSection = prev[section.id as keyof ContextRecord] as SectionData;
                                return {
                                  ...prev,
                                  [section.id]: {
                                    ...currentSection,
                                    reqsMet: value
                                  }
                                };
                              });
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
                        <div>
                          <Label>Action Owner</Label>
                          <Input
                            value={sectionData.actionOwner}
                            onChange={(e) => {
                            setEditingRecord(prev => {
                              if (!prev) return prev;
                              const currentSection = prev[section.id as keyof ContextRecord] as SectionData;
                              return {
                                ...prev,
                                [section.id]: {
                                  ...currentSection,
                                  actionOwner: e.target.value
                                }
                              };
                            });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Comments</Label>
                        <Input
                          value={sectionData.comments}
                          onChange={(e) => {
                          setEditingRecord(prev => {
                            if (!prev) return prev;
                            const currentSection = prev[section.id as keyof ContextRecord] as SectionData;
                            return {
                              ...prev,
                              [section.id]: {
                                ...currentSection,
                                comments: e.target.value
                              }
                            };
                          });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Action Needed</Label>
                        <Textarea
                          value={sectionData.actionNeeded}
                          onChange={(e) => {
                          setEditingRecord(prev => {
                            if (!prev) return prev;
                            const currentSection = prev[section.id as keyof ContextRecord] as SectionData;
                            return {
                              ...prev,
                              [section.id]: {
                                ...currentSection,
                                actionNeeded: e.target.value
                              }
                            };
                          });
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