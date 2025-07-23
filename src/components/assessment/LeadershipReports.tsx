import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Printer, 
  Eye, 
  Edit, 
  Trash2,
  List,
  Grid3X3,
  Kanban
} from "lucide-react";
import * as XLSX from 'xlsx';

interface LeadershipReportsProps {
  setActivePage?: (page: string) => void;
}

interface AssessmentRecord {
  id: string;
  title: string;
  createdAt: string;
  sections: Array<{
    id: string;
    title: string;
    question: string;
    data: {
      reqsMet: string;
      comments: string;
      actionNeeded: string;
      actionOwner: string;
      evidenceFileName: string | null;
    };
  }>;
}

export const LeadershipReports = ({ setActivePage }: LeadershipReportsProps) => {
  const { toast } = useToast();
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AssessmentRecord[]>([]);
  const [view, setView] = useState<'list' | 'spreadsheet' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, filterBy]);

  const loadRecords = () => {
    try {
      const savedRecords = JSON.parse(localStorage.getItem('leadershipAssessments') || '[]');
      setRecords(savedRecords);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load records",
        variant: "destructive",
      });
    }
  };

  const filterRecords = () => {
    let filtered = [...records];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.sections.some(section =>
          section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.data.comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.data.actionOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.data.actionNeeded.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(record =>
        record.sections.some(section => section.data.reqsMet === filterBy)
      );
    }

    setFilteredRecords(filtered);
  };

  const deleteRecord = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem('leadershipAssessments', JSON.stringify(updatedRecords));
    toast({
      title: "Success",
      description: "Record deleted successfully",
    });
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredRecords.flatMap(record =>
        record.sections.map(section => ({
          'Record ID': record.id,
          'Created At': new Date(record.createdAt).toLocaleDateString(),
          'Section': section.title,
          'Question': section.question,
          'REQS MET': section.data.reqsMet,
          'Comments': section.data.comments,
          'Action Needed': section.data.actionNeeded,
          'Action Owner': section.data.actionOwner,
          'Evidence File': section.data.evidenceFileName || 'None'
        }))
      );

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Leadership Assessment');
      XLSX.writeFile(wb, 'leadership-assessment-report.xlsx');

      toast({
        title: "Success",
        description: "Report exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    try {
      const exportData = filteredRecords.flatMap(record =>
        record.sections.map(section => ({
          'Record ID': record.id,
          'Created At': new Date(record.createdAt).toLocaleDateString(),
          'Section': section.title,
          'Question': section.question,
          'REQS MET': section.data.reqsMet,
          'Comments': section.data.comments,
          'Action Needed': section.data.actionNeeded,
          'Action Owner': section.data.actionOwner,
          'Evidence File': section.data.evidenceFileName || 'None'
        }))
      );

      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leadership-assessment-report.csv';
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Report exported to CSV successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export CSV",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Process imported data and update records
        console.log('Imported data:', jsonData);
        toast({
          title: "Success",
          description: "Data imported successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import file",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const printReport = () => {
    window.print();
  };

  const getStatusBadge = (reqsMet: string) => {
    return reqsMet === 'yes' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
    ) : reqsMet === 'no' ? (
      <Badge variant="destructive">No</Badge>
    ) : (
      <Badge variant="secondary">-</Badge>
    );
  };

  const renderListView = () => (
    <div className="space-y-4">
      {filteredRecords.map((record) => (
        <Card key={record.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{record.title}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {new Date(record.createdAt).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteRecord(record.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {record.sections.map((section) => (
                <div key={section.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{section.title}</h4>
                    {getStatusBadge(section.data.reqsMet)}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{section.question}</p>
                  {section.data.comments && (
                    <p className="text-sm text-gray-700">Comments: {section.data.comments}</p>
                  )}
                  {section.data.actionOwner && (
                    <p className="text-sm text-gray-700">Owner: {section.data.actionOwner}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSpreadsheetView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
            <th className="border border-gray-300 px-4 py-2 text-left">REQS MET</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Comments</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Action Owner</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.flatMap(record =>
            record.sections.map(section => (
              <tr key={`${record.id}-${section.id}`} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {new Date(record.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{section.title}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {getStatusBadge(section.data.reqsMet)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{section.data.comments}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{section.data.actionOwner}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-600"
                    >
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
    const groupedByStatus = {
      yes: filteredRecords.flatMap(record => 
        record.sections.filter(section => section.data.reqsMet === 'yes')
          .map(section => ({ ...section, recordId: record.id, createdAt: record.createdAt }))
      ),
      no: filteredRecords.flatMap(record => 
        record.sections.filter(section => section.data.reqsMet === 'no')
          .map(section => ({ ...section, recordId: record.id, createdAt: record.createdAt }))
      ),
      pending: filteredRecords.flatMap(record => 
        record.sections.filter(section => !section.data.reqsMet || section.data.reqsMet === '')
          .map(section => ({ ...section, recordId: record.id, createdAt: record.createdAt }))
      )
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedByStatus).map(([status, items]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold capitalize">{status === 'yes' ? 'Compliant' : status === 'no' ? 'Non-Compliant' : 'Pending'}</h3>
              <Badge variant="secondary">{items.length}</Badge>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={`${item.recordId}-${item.id}`} className="p-4">
                  <h4 className="font-medium text-sm mb-2">{item.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{item.question}</p>
                  {item.data.actionOwner && (
                    <p className="text-xs text-gray-700">Owner: {item.data.actionOwner}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {getStatusBadge(item.data.reqsMet)}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActivePage?.('leadership')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leadership Assessment
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">5. Leadership Reports</h1>
        <p className="text-gray-600">
          View, manage, and analyze leadership assessment records and evidence.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Records</SelectItem>
              <SelectItem value="yes">Compliant</SelectItem>
              <SelectItem value="no">Non-Compliant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'spreadsheet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('spreadsheet')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('kanban')}
            >
              <Kanban className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            XLSX
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>

          <div>
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-file')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={printReport}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No leadership assessment records found.</p>
            <Button onClick={() => setActivePage?.('leadership')}>
              Create First Assessment
            </Button>
          </div>
        ) : (
          <div className="p-6">
            {view === 'list' && renderListView()}
            {view === 'spreadsheet' && renderSpreadsheetView()}
            {view === 'kanban' && renderKanbanView()}
          </div>
        )}
      </div>
    </div>
  );
};