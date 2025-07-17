
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Search, Filter, Download, Upload, Printer, List, Grid, Kanban, Edit, Trash2, Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface TreatmentPlan {
  id: string;
  treatmentOption: string;
  proposedAction: string;
  controlReference: string;
  treatmentCost: number;
  actionOwner: string;
  actionTimescale: string;
  actionStatus: string;
  evidenceFile: any;
  evidenceComment: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'list' | 'spreadsheet' | 'kanban';

interface TreatmentPlanReportsProps {
  onBackToForm: () => void;
}

export const TreatmentPlanReports = ({ onBackToForm }: TreatmentPlanReportsProps) => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<TreatmentPlan[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<TreatmentPlan | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    filterPlans();
  }, [plans, searchTerm, filterStatus, filterOwner]);

  const loadPlans = () => {
    const savedPlans = localStorage.getItem('treatmentPlans');
    if (savedPlans) {
      const parsedPlans = JSON.parse(savedPlans);
      setPlans(parsedPlans);
    }
  };

  const filterPlans = () => {
    let filtered = plans;

    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.proposedAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.actionOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.controlReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.treatmentOption.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(plan => plan.actionStatus === filterStatus);
    }

    if (filterOwner !== 'all') {
      filtered = filtered.filter(plan => plan.actionOwner === filterOwner);
    }

    setFilteredPlans(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTreatmentOptionColor = (option: string) => {
    switch (option) {
      case 'avoid': return 'bg-red-100 text-red-800';
      case 'modify': return 'bg-yellow-100 text-yellow-800';
      case 'accept': return 'bg-green-100 text-green-800';
      case 'share': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== id);
    setPlans(updatedPlans);
    localStorage.setItem('treatmentPlans', JSON.stringify(updatedPlans));
    
    // Remove associated file
    const fileStorage = JSON.parse(localStorage.getItem('treatmentPlanFiles') || '{}');
    delete fileStorage[id];
    localStorage.setItem('treatmentPlanFiles', JSON.stringify(fileStorage));
    
    toast({
      title: "Success",
      description: "Treatment plan deleted successfully.",
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPlans.map(plan => ({
      'Treatment Option': plan.treatmentOption,
      'Proposed Action': plan.proposedAction,
      'Control Reference': plan.controlReference,
      'Treatment Cost': plan.treatmentCost,
      'Action Owner': plan.actionOwner,
      'Action Timescale': plan.actionTimescale ? new Date(plan.actionTimescale).toLocaleDateString() : '',
      'Action Status': plan.actionStatus,
      'Evidence Comment': plan.evidenceComment,
      'Created At': new Date(plan.createdAt).toLocaleDateString()
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Treatment Plans');
    XLSX.writeFile(workbook, 'treatment_plans.xlsx');
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPlans.map(plan => ({
      'Treatment Option': plan.treatmentOption,
      'Proposed Action': plan.proposedAction,
      'Control Reference': plan.controlReference,
      'Treatment Cost': plan.treatmentCost,
      'Action Owner': plan.actionOwner,
      'Action Timescale': plan.actionTimescale ? new Date(plan.actionTimescale).toLocaleDateString() : '',
      'Action Status': plan.actionStatus,
      'Evidence Comment': plan.evidenceComment,
      'Created At': new Date(plan.createdAt).toLocaleDateString()
    })));

    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'treatment_plans.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Treatment Plans Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Treatment Plans Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Treatment Option</th>
                <th>Action Owner</th>
                <th>Control Reference</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Timescale</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPlans.map(plan => `
                <tr>
                  <td>${plan.treatmentOption}</td>
                  <td>${plan.actionOwner}</td>
                  <td>${plan.controlReference}</td>
                  <td>$${plan.treatmentCost}</td>
                  <td>${plan.actionStatus}</td>
                  <td>${plan.actionTimescale ? new Date(plan.actionTimescale).toLocaleDateString() : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const renderListView = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Treatment Option</TableHead>
            <TableHead>Action Owner</TableHead>
            <TableHead>Control Reference</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timescale</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>
                <Badge className={getTreatmentOptionColor(plan.treatmentOption)}>
                  {plan.treatmentOption}
                </Badge>
              </TableCell>
              <TableCell>{plan.actionOwner}</TableCell>
              <TableCell>{plan.controlReference}</TableCell>
              <TableCell>${plan.treatmentCost}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(plan.actionStatus)}>
                  {plan.actionStatus}
                </Badge>
              </TableCell>
              <TableCell>
                {plan.actionTimescale ? new Date(plan.actionTimescale).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(plan)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingPlan(plan)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
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
    const statusGroups = {
      'not-started': filteredPlans.filter(p => p.actionStatus === 'not-started'),
      'in-progress': filteredPlans.filter(p => p.actionStatus === 'in-progress'),
      'completed': filteredPlans.filter(p => p.actionStatus === 'completed'),
      'rejected': filteredPlans.filter(p => p.actionStatus === 'rejected')
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusGroups).map(([status, plans]) => (
          <div key={status} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4 capitalize">{status.replace('-', ' ')}</h3>
            <div className="space-y-3">
              {plans.map((plan) => (
                <Card key={plan.id} className="p-3">
                  <div className="space-y-2">
                    <Badge className={getTreatmentOptionColor(plan.treatmentOption)}>
                      {plan.treatmentOption}
                    </Badge>
                    <p className="text-sm font-medium">{plan.actionOwner}</p>
                    <p className="text-xs text-gray-600">{plan.controlReference}</p>
                    <p className="text-sm">${plan.treatmentCost}</p>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(plan)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingPlan(plan)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
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

  const uniqueOwners = [...new Set(plans.map(plan => plan.actionOwner))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBackToForm}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Form
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Treatment Plan Reports</h2>
            <p className="text-gray-600 mt-1">View and manage treatment plan records</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Excel
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

      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search treatment plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter-status">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-owner">Owner</Label>
              <Select value={filterOwner} onValueChange={setFilterOwner}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {uniqueOwners.map(owner => (
                    <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Treatment Plans ({filteredPlans.length})</CardTitle>
            <div className="flex items-center gap-2">
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
        </CardHeader>
        <CardContent>
          {viewMode === 'list' && renderListView()}
          {viewMode === 'spreadsheet' && renderListView()}
          {viewMode === 'kanban' && renderKanbanView()}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Treatment Plan Details</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Treatment Option</Label>
                  <Badge className={getTreatmentOptionColor(selectedPlan.treatmentOption)}>
                    {selectedPlan.treatmentOption}
                  </Badge>
                </div>
                <div>
                  <Label>Action Owner</Label>
                  <p>{selectedPlan.actionOwner}</p>
                </div>
                <div>
                  <Label>Control Reference</Label>
                  <p>{selectedPlan.controlReference}</p>
                </div>
                <div>
                  <Label>Treatment Cost</Label>
                  <p>${selectedPlan.treatmentCost}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedPlan.actionStatus)}>
                    {selectedPlan.actionStatus}
                  </Badge>
                </div>
                <div>
                  <Label>Timescale</Label>
                  <p>{selectedPlan.actionTimescale ? new Date(selectedPlan.actionTimescale).toLocaleDateString() : '-'}</p>
                </div>
              </div>
              <div>
                <Label>Proposed Treatment Action</Label>
                <p className="mt-1 text-sm text-gray-600">{selectedPlan.proposedAction}</p>
              </div>
              {selectedPlan.evidenceComment && (
                <div>
                  <Label>Evidence Comment</Label>
                  <p className="mt-1 text-sm text-gray-600">{selectedPlan.evidenceComment}</p>
                </div>
              )}
              {selectedPlan.evidenceFile && (
                <div>
                  <Label>Evidence File</Label>
                  <p className="mt-1 text-sm text-gray-600">
                    <FileText className="inline h-4 w-4 mr-2" />
                    {selectedPlan.evidenceFile.name}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
