
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Printer, 
  Edit, 
  Trash2, 
  Eye,
  Grid3x3,
  List,
  Kanban
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface RiskDescriptionData {
  id: string;
  riskOwner: string;
  assetGroup: string;
  asset: string;
  threat: string;
  vulnerability: string;
  riskType: string;
  evidenceFileName?: string;
  createdAt: string;
  updatedAt: string;
}

interface RiskDescriptionReportsProps {
  onBackToForm: () => void;
}

export const RiskDescriptionReports = ({ onBackToForm }: RiskDescriptionReportsProps) => {
  const { toast } = useToast();
  const [risks, setRisks] = useState<RiskDescriptionData[]>([]);
  const [filteredRisks, setFilteredRisks] = useState<RiskDescriptionData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<'list' | 'spreadsheet' | 'kanban'>('list');

  useEffect(() => {
    loadRisks();
  }, []);

  useEffect(() => {
    filterRisks();
  }, [risks, searchTerm, filterType]);

  const loadRisks = () => {
    const savedRisks = JSON.parse(localStorage.getItem('riskDescriptions') || '[]');
    setRisks(savedRisks);
  };

  const filterRisks = () => {
    let filtered = risks;

    if (searchTerm) {
      filtered = filtered.filter(risk =>
        Object.values(risk).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(risk => risk.riskType === filterType);
    }

    setFilteredRisks(filtered);
  };

  const handleDelete = (id: string) => {
    const updatedRisks = risks.filter(risk => risk.id !== id);
    setRisks(updatedRisks);
    localStorage.setItem('riskDescriptions', JSON.stringify(updatedRisks));
    
    toast({
      title: "Success",
      description: "Risk description deleted successfully",
    });
  };

  const handleExport = (format: 'xlsx' | 'csv' | 'pdf') => {
    if (format === 'xlsx' || format === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(filteredRisks.map(risk => ({
        'Risk Owner': risk.riskOwner,
        'Asset Group': risk.assetGroup,
        'Asset': risk.asset,
        'Threat': risk.threat,
        'Vulnerability': risk.vulnerability,
        'Risk Type': risk.riskType,
        'Evidence File': risk.evidenceFileName || 'None',
        'Created Date': new Date(risk.createdAt).toLocaleDateString(),
      })));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Risk Descriptions');
      
      XLSX.writeFile(workbook, `risk-descriptions.${format}`);
      
      toast({
        title: "Export Complete",
        description: `Risk descriptions exported as ${format.toUpperCase()}`,
      });
    }
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Ready",
      description: "Print dialog opened",
    });
  };

  const riskTypes = [...new Set(risks.map(risk => risk.riskType))];

  const renderListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Risk Owner</TableHead>
          <TableHead>Asset Group</TableHead>
          <TableHead>Asset</TableHead>
          <TableHead>Risk Type</TableHead>
          <TableHead>Evidence</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredRisks.map((risk) => (
          <TableRow key={risk.id}>
            <TableCell>{risk.riskOwner}</TableCell>
            <TableCell>{risk.assetGroup}</TableCell>
            <TableCell>{risk.asset}</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {risk.riskType}
              </span>
            </TableCell>
            <TableCell>
              {risk.evidenceFileName ? (
                <span className="text-green-600 text-sm">📎 {risk.evidenceFileName}</span>
              ) : (
                <span className="text-gray-400 text-sm">No file</span>
              )}
            </TableCell>
            <TableCell>{new Date(risk.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Edit size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(risk.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderKanbanView = () => {
    const groupedRisks = riskTypes.reduce((acc, type) => {
      acc[type] = filteredRisks.filter(risk => risk.riskType === type);
      return acc;
    }, {} as Record<string, RiskDescriptionData[]>);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(groupedRisks).map(([type, typeRisks]) => (
          <div key={type} className="space-y-3">
            <h3 className="font-semibold text-gray-900 bg-gray-100 p-2 rounded">
              {type} ({typeRisks.length})
            </h3>
            <div className="space-y-2">
              {typeRisks.map((risk) => (
                <Card key={risk.id} className="p-3">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">{risk.riskOwner}</div>
                    <div className="text-xs text-gray-600">{risk.assetGroup} • {risk.asset}</div>
                    <div className="text-xs text-gray-500 truncate">{risk.threat}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {new Date(risk.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit size={12} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(risk.id)}>
                          <Trash2 size={12} />
                        </Button>
                      </div>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Description Reports</h1>
          <p className="text-gray-600 mt-1">View and manage risk descriptions</p>
        </div>
        <Button onClick={onBackToForm} variant="outline">
          Back to Form
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Risk Reports Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search risks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {riskTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 bg-gray-100 rounded p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
              <Button
                variant={viewMode === 'spreadsheet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('spreadsheet')}
              >
                <Grid3x3 size={16} />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <Kanban size={16} />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={() => handleExport('xlsx')}>
              <Download size={16} className="mr-2" />
              Export XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer size={16} className="mr-2" />
              Print
            </Button>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600">
            Showing {filteredRisks.length} of {risks.length} risk descriptions
          </div>

          {/* Data Display */}
          <div className="border rounded-lg">
            {viewMode === 'list' && renderListView()}
            {viewMode === 'spreadsheet' && renderListView()}
            {viewMode === 'kanban' && (
              <div className="p-4">
                {renderKanbanView()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
