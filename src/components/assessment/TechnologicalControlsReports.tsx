import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, Download, Upload, Printer, Eye, Edit, Trash2, 
  FileText, Filter, ArrowLeft, MoreHorizontal, ListFilter
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface TechnologicalControlsReportsProps {
  onNavigate?: (page: string) => void;
}

export const TechnologicalControlsReports = ({ onNavigate }: TechnologicalControlsReportsProps) => {
  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'spreadsheet' | 'kanban'>('list');
  const [filters, setFilters] = useState({
    reqsMet: 'all',
    actionOwner: '',
    section: 'all'
  });

  const editForm = useForm();

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, filters]);

  const loadRecords = () => {
    const data = localStorage.getItem('technologicalControlsData');
    if (data) {
      const parsedData = JSON.parse(data);
      setRecords(parsedData);
    }
  };

  const filterRecords = () => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        JSON.stringify(record).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.reqsMet && filters.reqsMet !== "all") {
      filtered = filtered.filter(record =>
        record.sections?.some((section: any) => section.reqsMet === filters.reqsMet)
      );
    }

    if (filters.actionOwner) {
      filtered = filtered.filter(record =>
        record.sections?.some((section: any) => 
          section.actionOwner?.toLowerCase().includes(filters.actionOwner.toLowerCase())
        )
      );
    }

    if (filters.section && filters.section !== "all") {
      filtered = filtered.filter(record =>
        record.sections?.some((section: any) => section.id === filters.section)
      );
    }

    setFilteredRecords(filtered);
  };

  const handleDeleteRecord = (recordId: string) => {
    const updatedRecords = records.filter(record => record.id !== recordId);
    setRecords(updatedRecords);
    localStorage.setItem('technologicalControlsData', JSON.stringify(updatedRecords));
    toast.success("Record deleted successfully");
  };

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    editForm.reset(record);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (data: any) => {
    const updatedRecords = records.map(record =>
      record.id === selectedRecord.id ? { ...record, ...data } : record
    );
    setRecords(updatedRecords);
    localStorage.setItem('technologicalControlsData', JSON.stringify(updatedRecords));
    setIsEditDialogOpen(false);
    toast.success("Record updated successfully");
  };

  const exportToCSV = () => {
    const csvData = filteredRecords.map(record => ({
      ID: record.id,
      Timestamp: new Date(record.timestamp).toLocaleDateString(),
      'Total Sections': record.sections?.length || 0,
      'Sections Met': record.sections?.filter((s: any) => s.reqsMet === 'Yes').length || 0,
      'Completion %': Math.round(((record.sections?.filter((s: any) => s.reqsMet === 'Yes').length || 0) / (record.sections?.length || 1)) * 100)
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'technological-controls-reports.csv';
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (reqsMet: string) => (
    <Badge variant={reqsMet === 'Yes' ? 'default' : 'destructive'}>
      {reqsMet}
    </Badge>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredRecords.map((record) => (
        <Card key={record.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Assessment #{record.id}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {new Date(record.timestamp).toLocaleDateString()}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditRecord(record)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteRecord(record.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Sections</p>
                <p className="font-medium">{record.sections?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requirements Met</p>
                <p className="font-medium text-green-600">
                  {record.sections?.filter((s: any) => s.reqsMet === 'Yes').length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="font-medium">
                  {Math.round(((record.sections?.filter((s: any) => s.reqsMet === 'Yes').length || 0) / (record.sections?.length || 1)) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSpreadsheetView = () => (
    <div className="border rounded-lg overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Sections</TableHead>
            <TableHead>Requirements Met</TableHead>
            <TableHead>Completion %</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">#{record.id}</TableCell>
              <TableCell>{new Date(record.timestamp).toLocaleDateString()}</TableCell>
              <TableCell>{record.sections?.length || 0}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {record.sections?.filter((s: any) => s.reqsMet === 'Yes').length || 0}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {Math.round(((record.sections?.filter((s: any) => s.reqsMet === 'Yes').length || 0) / (record.sections?.length || 1)) * 100)}%
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRecord(record)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
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
    const yesRecords = filteredRecords.filter(record => 
      record.sections?.some((s: any) => s.reqsMet === 'Yes')
    );
    const noRecords = filteredRecords.filter(record => 
      record.sections?.some((s: any) => s.reqsMet === 'No')
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="default">Requirements Met</Badge>
              <span className="text-sm text-muted-foreground">({yesRecords.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {yesRecords.map((record) => (
              <Card key={record.id} className="p-3 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Assessment #{record.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRecord(record)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="destructive">Requirements Not Met</Badge>
              <span className="text-sm text-muted-foreground">({noRecords.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {noRecords.map((record) => (
              <Card key={record.id} className="p-3 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Assessment #{record.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRecord(record)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate?.('technological-controls')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">A.8 Technological Controls Reports</h1>
            <p className="text-muted-foreground">View and manage your technological controls assessments</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredRecords.length} records
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.reqsMet} onValueChange={(value) => setFilters({...filters, reqsMet: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by REQS MET" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requirements</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter by Action Owner"
              value={filters.actionOwner}
              onChange={(e) => setFilters({...filters, actionOwner: e.target.value})}
            />
            <Select value={filters.section} onValueChange={(value) => setFilters({...filters, section: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {Array.from({length: 34}, (_, i) => (
                  <SelectItem key={i} value={`A.8.${i + 1}`}>A.8.{i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="w-auto">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="spreadsheet" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Spreadsheet
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <MoreHorizontal className="h-4 w-4" />
              Kanban
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'spreadsheet' && renderSpreadsheetView()}
      {viewMode === 'kanban' && renderKanbanView()}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Assessment Record</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleSaveEdit)} className="space-y-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedRecord.sections?.map((section: any, index: number) => (
                    <Card key={section.id} className="p-4">
                      <h4 className="font-medium mb-2">{section.id}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={editForm.control}
                          name={`sections.${index}.reqsMet`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>REQS MET</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={editForm.control}
                          name={`sections.${index}.actionOwner`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Action Owner</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={editForm.control}
                        name={`sections.${index}.comments`}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Comments</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </Card>
                  ))}
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};