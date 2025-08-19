import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  FileText, 
  Printer, 
  List, 
  Grid, 
  Kanban,
  Edit,
  Eye,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhysicalControlsRecord {
  section: string;
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidence: any;
}

type ViewMode = 'list' | 'spreadsheet' | 'kanban';

interface PhysicalControlsReportsProps {
  onNavigate?: (page: string) => void;
}

const PhysicalControlsReports: React.FC<PhysicalControlsReportsProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [records, setRecords] = useState<Record<string, PhysicalControlsRecord>>({});
  const [filteredRecords, setFilteredRecords] = useState<Record<string, PhysicalControlsRecord>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<PhysicalControlsRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<PhysicalControlsRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const sectionTitles: Record<string, string> = {
    'A.7.1': 'Physical security perimeters',
    'A.7.2': 'Physical entry',
    'A.7.3': 'Securing offices, rooms and facilities',
    'A.7.4': 'Physical security monitoring',
    'A.7.5': 'Protecting against physical and environmental threats',
    'A.7.6': 'Working in secure areas',
    'A.7.7': 'Clear desk and clear screen',
    'A.7.8': 'Equipment siting and protection',
    'A.7.9': 'Security of assets off-premises',
    'A.7.10': 'Storage media',
    'A.7.11': 'Supporting utilities',
    'A.7.12': 'Cabling security',
    'A.7.13': 'Equipment maintenance',
    'A.7.14': 'Secure disposal or re-use of equipment'
  };

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, filterBy]);

  const loadRecords = () => {
    const savedData = localStorage.getItem('physicalControlsData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setRecords(data);
    }
  };

  const filterRecords = () => {
    let filtered = { ...records };

    if (searchTerm) {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        const record = filtered[key];
        const searchableText = `${record.section} ${sectionTitles[record.section]} ${record.comments} ${record.actionNeeded} ${record.actionOwner}`.toLowerCase();
        if (searchableText.includes(searchTerm.toLowerCase())) {
          acc[key] = record;
        }
        return acc;
      }, {} as Record<string, PhysicalControlsRecord>);
    }

    if (filterBy !== 'all') {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        const record = filtered[key];
        if (filterBy === 'yes' && record.reqsMet === 'yes') {
          acc[key] = record;
        } else if (filterBy === 'no' && record.reqsMet === 'no') {
          acc[key] = record;
        }
        return acc;
      }, {} as Record<string, PhysicalControlsRecord>);
    }

    setFilteredRecords(filtered);
  };

  const handleEdit = (record: PhysicalControlsRecord) => {
    setEditingRecord({ ...record });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;

    const updatedRecords = {
      ...records,
      [editingRecord.section]: editingRecord
    };

    setRecords(updatedRecords);
    localStorage.setItem('physicalControlsData', JSON.stringify(updatedRecords));
    
    setIsEditDialogOpen(false);
    setEditingRecord(null);
    
    toast({
      title: "Success",
      description: "Record updated successfully.",
    });
  };

  const handleDelete = (sectionId: string) => {
    const updatedRecords = { ...records };
    delete updatedRecords[sectionId];
    
    setRecords(updatedRecords);
    localStorage.setItem('physicalControlsData', JSON.stringify(updatedRecords));
    
    toast({
      title: "Success",
      description: "Record deleted successfully.",
    });
  };

  const handleExport = (format: 'xlsx' | 'csv' | 'pdf') => {
    toast({
      title: "Export Started",
      description: `Exporting data in ${format.toUpperCase()} format...`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const renderListView = () => (
    <div className="space-y-4">
      {Object.values(filteredRecords).map((record) => (
        <Card key={record.section} className="border-border">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{record.section} - {sectionTitles[record.section]}</CardTitle>
                <Badge variant={record.reqsMet === 'yes' ? 'default' : 'destructive'} className="mt-2">
                  {record.reqsMet === 'yes' ? 'Requirements Met' : 'Requirements Not Met'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(record.section)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-foreground">Action Owner:</span>
                <p className="text-muted-foreground">{record.actionOwner || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-foreground">Evidence:</span>
                <p className="text-muted-foreground">{record.evidence ? 'Attached' : 'No evidence'}</p>
              </div>
              {record.comments && (
                <div className="md:col-span-2">
                  <span className="font-medium text-foreground">Comments:</span>
                  <p className="text-muted-foreground">{record.comments}</p>
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
      <table className="w-full border-collapse border border-border">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border p-2 text-left">Section</th>
            <th className="border border-border p-2 text-left">Title</th>
            <th className="border border-border p-2 text-left">REQS MET</th>
            <th className="border border-border p-2 text-left">Action Owner</th>
            <th className="border border-border p-2 text-left">Evidence</th>
            <th className="border border-border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(filteredRecords).map((record) => (
            <tr key={record.section} className="hover:bg-muted/50">
              <td className="border border-border p-2">{record.section}</td>
              <td className="border border-border p-2">{sectionTitles[record.section]}</td>
              <td className="border border-border p-2">
                <Badge variant={record.reqsMet === 'yes' ? 'default' : 'destructive'}>
                  {record.reqsMet === 'yes' ? 'Yes' : 'No'}
                </Badge>
              </td>
              <td className="border border-border p-2">{record.actionOwner || '-'}</td>
              <td className="border border-border p-2">{record.evidence ? 'Yes' : 'No'}</td>
              <td className="border border-border p-2">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(record.section)}>
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
    const yesRecords = Object.values(filteredRecords).filter(r => r.reqsMet === 'yes');
    const noRecords = Object.values(filteredRecords).filter(r => r.reqsMet === 'no');

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Requirements Met ({yesRecords.length})</h3>
          <div className="space-y-3">
            {yesRecords.map((record) => (
              <Card key={record.section} className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{record.section}</h4>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{sectionTitles[record.section]}</p>
                  {record.actionOwner && (
                    <p className="text-xs text-muted-foreground mt-2">Owner: {record.actionOwner}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-700">Requirements Not Met ({noRecords.length})</h3>
          <div className="space-y-3">
            {noRecords.map((record) => (
              <Card key={record.section} className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{record.section}</h4>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{sectionTitles[record.section]}</p>
                  {record.actionOwner && (
                    <p className="text-xs text-muted-foreground mt-2">Owner: {record.actionOwner}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">A.7 Physical Controls Reports</h1>
          <p className="text-muted-foreground mt-2">View and manage physical controls assessment records</p>
        </div>
      </div>

      {/* Controls Bar */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="yes">Requirements Met</SelectItem>
                    <SelectItem value="no">Requirements Not Met</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <Kanban className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('xlsx')}>
              <Download className="h-4 w-4 mr-2" />
              Export XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="min-h-[400px]">
        {Object.keys(filteredRecords).length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Records Found</h3>
              <p className="text-muted-foreground">
                {Object.keys(records).length === 0 
                  ? "No assessment records available. Complete the A.7 Physical Controls assessment first."
                  : "No records match your current search and filter criteria."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === 'list' && renderListView()}
            {viewMode === 'spreadsheet' && renderSpreadsheetView()}
            {viewMode === 'kanban' && renderKanbanView()}
          </>
        )}
      </div>

      {/* View Record Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRecord?.section} - {selectedRecord && sectionTitles[selectedRecord.section]}
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">REQS MET</Label>
                  <Badge className="mt-1" variant={selectedRecord.reqsMet === 'yes' ? 'default' : 'destructive'}>
                    {selectedRecord.reqsMet === 'yes' ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Action Owner</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRecord.actionOwner || 'Not specified'}</p>
                </div>
              </div>
              {selectedRecord.comments && (
                <div>
                  <Label className="text-sm font-medium">Comments</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRecord.comments}</p>
                </div>
              )}
              {selectedRecord.actionNeeded && (
                <div>
                  <Label className="text-sm font-medium">Action Needed</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRecord.actionNeeded}</p>
                </div>
              )}
              {selectedRecord.evidence && (
                <div>
                  <Label className="text-sm font-medium">Evidence</Label>
                  <p className="text-sm text-muted-foreground mt-1">File attached: {selectedRecord.evidence.name}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {editingRecord?.section} - {editingRecord && sectionTitles[editingRecord.section]}
            </DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>REQS MET</Label>
                  <Select 
                    value={editingRecord.reqsMet} 
                    onValueChange={(value) => setEditingRecord({...editingRecord, reqsMet: value})}
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
                    value={editingRecord.actionOwner}
                    onChange={(e) => setEditingRecord({...editingRecord, actionOwner: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Comments</Label>
                <Textarea
                  value={editingRecord.comments}
                  onChange={(e) => setEditingRecord({...editingRecord, comments: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <Label>Action Needed</Label>
                <Textarea
                  value={editingRecord.actionNeeded}
                  onChange={(e) => setEditingRecord({...editingRecord, actionNeeded: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
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

export default PhysicalControlsReports;