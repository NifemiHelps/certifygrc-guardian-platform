import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Upload, Search, Filter, Eye, Edit, Trash2, Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImprovementRecord {
  id: string;
  section: string;
  question: string;
  reqsMet: "yes" | "no";
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidenceFiles: string[];
  dateCreated: string;
  lastModified: string;
  status: "completed" | "in-progress" | "pending";
}

export const ImprovementReports = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReqsMet, setFilterReqsMet] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeView, setActiveView] = useState("list");

  // Mock data - in real app this would come from your database
  const [records] = useState<ImprovementRecord[]>([
    {
      id: "1",
      section: "10.1 Continual improvement",
      question: "Are all of the topics from the standard a to f covered in each management review?",
      reqsMet: "yes",
      comments: "All required topics are covered in management reviews conducted quarterly.",
      actionNeeded: "",
      actionOwner: "Quality Manager",
      evidenceFiles: ["management-review-q4.pdf", "review-checklist.xlsx"],
      dateCreated: "2024-01-15",
      lastModified: "2024-01-15",
      status: "completed"
    },
    {
      id: "2",
      section: "10.2 Nonconformity and corrective action",
      question: "Are nonconformities being identified, documented and corrective actions taken?",
      reqsMet: "no",
      comments: "Nonconformities are identified but documentation process needs improvement.",
      actionNeeded: "Implement standardized nonconformity documentation system and train staff.",
      actionOwner: "Compliance Officer",
      evidenceFiles: ["nonconformity-log.xlsx"],
      dateCreated: "2024-01-10",
      lastModified: "2024-01-12",
      status: "in-progress"
    }
  ]);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.actionOwner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReqsMet = filterReqsMet === "all" || record.reqsMet === filterReqsMet;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    
    return matchesSearch && matchesReqsMet && matchesStatus;
  });

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    toast({
      title: "Export started",
      description: `Exporting improvement reports as ${format.toUpperCase()}...`
    });
  };

  const handleImport = () => {
    toast({
      title: "Import feature",
      description: "Import functionality will be available soon."
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      pending: "bg-gray-100 text-gray-800"
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getReqsMetBadge = (reqsMet: string) => {
    return reqsMet === "yes" 
      ? <Badge className="bg-green-100 text-green-800">Yes</Badge>
      : <Badge className="bg-red-100 text-red-800">No</Badge>;
  };

  const ListView = () => (
    <div className="space-y-4">
      {filteredRecords.map((record) => (
        <Card key={record.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg text-blue-700">{record.section}</CardTitle>
                <p className="text-sm text-gray-600">{record.question}</p>
              </div>
              <div className="flex items-center gap-2">
                {getReqsMetBadge(record.reqsMet)}
                {getStatusBadge(record.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Action Owner:</span>
                <p className="text-gray-600">{record.actionOwner || "Not assigned"}</p>
              </div>
              <div>
                <span className="font-medium">Last Modified:</span>
                <p className="text-gray-600">{new Date(record.lastModified).toLocaleDateString()}</p>
              </div>
            </div>
            
            {record.comments && (
              <div>
                <span className="font-medium text-sm">Comments:</span>
                <p className="text-gray-600 text-sm mt-1">{record.comments}</p>
              </div>
            )}
            
            {record.actionNeeded && (
              <div>
                <span className="font-medium text-sm">Action Needed:</span>
                <p className="text-gray-600 text-sm mt-1">{record.actionNeeded}</p>
              </div>
            )}
            
            {record.evidenceFiles.length > 0 && (
              <div>
                <span className="font-medium text-sm">Evidence Files:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {record.evidenceFiles.map((file, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {file}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const SpreadsheetView = () => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Section</TableHead>
            <TableHead>REQS MET</TableHead>
            <TableHead>Action Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Evidence Files</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.section}</TableCell>
              <TableCell>{getReqsMetBadge(record.reqsMet)}</TableCell>
              <TableCell>{record.actionOwner || "Not assigned"}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell>
                <Badge variant="outline">{record.evidenceFiles.length} files</Badge>
              </TableCell>
              <TableCell>{new Date(record.lastModified).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const KanbanView = () => {
    const groupedByStatus = {
      pending: filteredRecords.filter(r => r.status === "pending"),
      "in-progress": filteredRecords.filter(r => r.status === "in-progress"),
      completed: filteredRecords.filter(r => r.status === "completed")
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedByStatus).map(([status, records]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium capitalize">{status.replace("-", " ")}</h3>
              <Badge variant="outline">{records.length}</Badge>
            </div>
            <div className="space-y-3">
              {records.map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{record.section}</h4>
                    <div className="flex items-center justify-between">
                      {getReqsMetBadge(record.reqsMet)}
                      <span className="text-xs text-gray-500">{record.actionOwner}</span>
                    </div>
                    {record.actionNeeded && (
                      <p className="text-xs text-gray-600 line-clamp-2">{record.actionNeeded}</p>
                    )}
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">10. Improvement Reports</h1>
          <p className="text-gray-600 mt-2">Manage and analyze improvement assessment data</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => handleExport('csv')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => handleExport('excel')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={handleImport} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search sections, questions, or owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterReqsMet} onValueChange={setFilterReqsMet}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="REQS MET" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requirements</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Views */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="spreadsheet">Spreadsheet View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <ListView />
        </TabsContent>

        <TabsContent value="spreadsheet" className="space-y-4">
          <SpreadsheetView />
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <KanbanView />
        </TabsContent>
      </Tabs>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No improvement records found matching your criteria.</p>
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create First Assessment
          </Button>
        </div>
      )}
    </div>
  );
};