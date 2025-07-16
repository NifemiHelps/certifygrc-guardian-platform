
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Download, Upload, Printer, Edit, Trash2, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface PreTreatmentData {
  id: string;
  existingControls: string;
  likelihoodPreTreatment: string;
  likelihoodRationale: string;
  impactPreTreatment: string;
  impactRationale: string;
  evidenceFiles: File[];
  createdAt: string;
  updatedAt: string;
}

interface PreTreatmentReportsProps {
  onBackToForm: () => void;
}

export const PreTreatmentReports = ({ onBackToForm }: PreTreatmentReportsProps) => {
  const { toast } = useToast();
  const [records, setRecords] = useState<PreTreatmentData[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PreTreatmentData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [activeView, setActiveView] = useState("list");

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, filterBy]);

  const loadRecords = () => {
    const savedRecords = JSON.parse(localStorage.getItem('preTreatmentAssessments') || '[]');
    setRecords(savedRecords);
  };

  const filterRecords = () => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.existingControls.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.likelihoodRationale.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.impactRationale.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBy !== "all") {
      filtered = filtered.filter(record => 
        record.likelihoodPreTreatment === filterBy || record.impactPreTreatment === filterBy
      );
    }

    setFilteredRecords(filtered);
  };

  const deleteRecord = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem('preTreatmentAssessments', JSON.stringify(updatedRecords));
    toast({
      title: "Success",
      description: "Pre-Treatment Assessment deleted successfully",
    });
  };

  const exportToXLSX = () => {
    const exportData = filteredRecords.map(record => ({
      'Existing Controls': record.existingControls,
      'Likelihood (Pre-Treatment)': record.likelihoodPreTreatment,
      'Likelihood Rationale': record.likelihoodRationale,
      'Impact (Pre-Treatment)': record.impactPreTreatment,
      'Impact Rationale': record.impactRationale,
      'Evidence Files': record.evidenceFiles.map(f => f.name).join(', '),
      'Created At': new Date(record.createdAt).toLocaleDateString(),
      'Updated At': new Date(record.updatedAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pre-Treatment Assessments");
    XLSX.writeFile(wb, "pre-treatment-assessments.xlsx");

    toast({
      title: "Success",
      description: "Data exported to XLSX successfully",
    });
  };

  const exportToCSV = () => {
    const exportData = filteredRecords.map(record => ({
      'Existing Controls': record.existingControls,
      'Likelihood (Pre-Treatment)': record.likelihoodPreTreatment,
      'Likelihood Rationale': record.likelihoodRationale,
      'Impact (Pre-Treatment)': record.impactPreTreatment,
      'Impact Rationale': record.impactRationale,
      'Evidence Files': record.evidenceFiles.map(f => f.name).join(', '),
      'Created At': new Date(record.createdAt).toLocaleDateString(),
      'Updated At': new Date(record.updatedAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pre-treatment-assessments.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Data exported to CSV successfully",
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print",
      description: "Print dialog opened",
    });
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderListView = () => (
    <div className="space-y-4">
      {filteredRecords.map((record) => (
        <Card key={record.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(record.likelihoodPreTreatment)}`}>
                    Likelihood: {record.likelihoodPreTreatment}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(record.impactPreTreatment)}`}>
                    Impact: {record.impactPreTreatment}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Existing Controls</h3>
                <p className="text-gray-600 text-sm mb-2">{record.existingControls}</p>
                {record.evidenceFiles.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FileText size={16} />
                    <span>{record.evidenceFiles.length} evidence file(s)</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteRecord(record.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Created: {new Date(record.createdAt).toLocaleDateString()}
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
            <TableHead>Existing Controls</TableHead>
            <TableHead>Likelihood</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead>Evidence Files</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="max-w-xs truncate">{record.existingControls}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(record.likelihoodPreTreatment)}`}>
                  {record.likelihoodPreTreatment}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(record.impactPreTreatment)}`}>
                  {record.impactPreTreatment}
                </span>
              </TableCell>
              <TableCell>{record.evidenceFiles.length}</TableCell>
              <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteRecord(record.id)}>
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
    const groupedRecords = {
      low: filteredRecords.filter(r => r.likelihoodPreTreatment === 'low' || r.impactPreTreatment === 'low'),
      medium: filteredRecords.filter(r => r.likelihoodPreTreatment === 'medium' || r.impactPreTreatment === 'medium'),
      high: filteredRecords.filter(r => r.likelihoodPreTreatment === 'high' || r.impactPreTreatment === 'high')
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedRecords).map(([level, levelRecords]) => (
          <div key={level}>
            <h3 className={`font-medium mb-4 p-2 rounded ${getRiskLevelColor(level)}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)} Risk ({levelRecords.length})
            </h3>
            <div className="space-y-3">
              {levelRecords.map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="text-sm font-medium mb-2">Assessment #{record.id.slice(-6)}</div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{record.existingControls}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteRecord(record.id)}>
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
          <Button variant="ghost" onClick={onBackToForm} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Form
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pre-Treatment Assessment Reports</h2>
            <p className="text-gray-600 mt-1">{filteredRecords.length} assessment(s) found</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToXLSX} className="flex items-center gap-2">
            <Download size={16} />
            XLSX
          </Button>
          <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
            <Download size={16} />
            CSV
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer size={16} />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeView} onValueChange={setActiveView}>
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
        </CardContent>
      </Card>
    </div>
  );
};
