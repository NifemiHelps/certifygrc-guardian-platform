
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Plus, Edit, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface Organization {
  id: string;
  name: string;
  riskOwner: string;
  assetGroup: string;
  asset: string;
  description: string;
  industry: string;
  size: string;
  dateCreated: string;
}

interface OrganizationStats {
  totalOrganizations: number;
  totalRiskOwners: number;
  totalAssetGroups: number;
  complianceRate: number;
}

export const CompanyDetails = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    riskOwner: '',
    assetGroup: '',
    asset: '',
    description: '',
    industry: '',
    size: ''
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stats, setStats] = useState<OrganizationStats>({
    totalOrganizations: 0,
    totalRiskOwners: 0,
    totalAssetGroups: 0,
    complianceRate: 87
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load organizations from localStorage on component mount
  useEffect(() => {
    const savedOrganizations = localStorage.getItem('organizations');
    if (savedOrganizations) {
      const parsedOrgs = JSON.parse(savedOrganizations);
      setOrganizations(parsedOrgs);
      updateStats(parsedOrgs);
    }
  }, []);

  const updateStats = (orgs: Organization[]) => {
    const uniqueRiskOwners = new Set(orgs.map(org => org.riskOwner)).size;
    const uniqueAssetGroups = new Set(orgs.map(org => org.assetGroup)).size;
    
    setStats({
      totalOrganizations: orgs.length,
      totalRiskOwners: uniqueRiskOwners,
      totalAssetGroups: uniqueAssetGroups,
      complianceRate: 87 // Keep static for now
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.riskOwner || !formData.assetGroup || !formData.asset) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields: Organization Name, Risk Owner, Asset Group, and Asset.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSaveOrganization = () => {
    if (!validateForm()) return;

    const newOrganization: Organization = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      riskOwner: formData.riskOwner,
      assetGroup: formData.assetGroup,
      asset: formData.asset,
      description: formData.description,
      industry: formData.industry,
      size: formData.size,
      dateCreated: editingId ? organizations.find(org => org.id === editingId)?.dateCreated || new Date().toISOString() : new Date().toISOString()
    };

    let updatedOrganizations;
    if (isEditing && editingId) {
      updatedOrganizations = organizations.map(org => 
        org.id === editingId ? newOrganization : org
      );
      toast({
        title: "Success",
        description: "Organization updated successfully!"
      });
    } else {
      updatedOrganizations = [...organizations, newOrganization];
      toast({
        title: "Success",
        description: "Organization saved successfully!"
      });
    }

    setOrganizations(updatedOrganizations);
    updateStats(updatedOrganizations);
    localStorage.setItem('organizations', JSON.stringify(updatedOrganizations));
    
    // Reset form
    handleNewOrganization();
  };

  const handleNewOrganization = () => {
    setFormData({
      name: '',
      riskOwner: '',
      assetGroup: '',
      asset: '',
      description: '',
      industry: '',
      size: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditOrganization = (org: Organization) => {
    setFormData({
      name: org.name,
      riskOwner: org.riskOwner,
      assetGroup: org.assetGroup,
      asset: org.asset,
      description: org.description,
      industry: org.industry,
      size: org.size
    });
    setIsEditing(true);
    setEditingId(org.id);
  };

  const handleExportData = () => {
    if (organizations.length === 0) {
      toast({
        title: "No Data",
        description: "No organizations to export.",
        variant: "destructive"
      });
      return;
    }

    const exportData = organizations.map(org => ({
      'Organization Name': org.name,
      'Risk Owner': org.riskOwner,
      'Asset Group': org.assetGroup,
      'Asset': org.asset,
      'Description': org.description,
      'Industry': org.industry,
      'Organization Size': org.size,
      'Date Created': new Date(org.dateCreated).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Organizations");
    XLSX.writeFile(wb, "organizations_export.xlsx");

    toast({
      title: "Export Successful",
      description: "Organizations data exported successfully!"
    });
  };

  const handleResetForm = () => {
    handleNewOrganization();
    toast({
      title: "Form Reset",
      description: "Form has been cleared."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Details</h1>
          <p className="text-gray-600 mt-1">Organization registration and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
            <Download size={16} />
            Export Data
          </Button>
          <Button className="flex items-center gap-2" onClick={handleNewOrganization}>
            <Plus size={16} />
            New Organization
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building size={20} />
                {isEditing ? 'Edit Organization' : 'Organization Registration'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input 
                    id="orgName" 
                    placeholder="Enter organization name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskOwner">Risk Owner *</Label>
                  <Input 
                    id="riskOwner" 
                    placeholder="Select risk owner"
                    value={formData.riskOwner}
                    onChange={(e) => handleInputChange('riskOwner', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetGroup">Asset Group *</Label>
                  <Input 
                    id="assetGroup" 
                    placeholder="Select asset group"
                    value={formData.assetGroup}
                    onChange={(e) => handleInputChange('assetGroup', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset">Asset *</Label>
                  <Input 
                    id="asset" 
                    placeholder="Select asset"
                    value={formData.asset}
                    onChange={(e) => handleInputChange('asset', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Organization description" 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    placeholder="Enter industry type"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Organization Size</Label>
                  <Input 
                    id="size" 
                    placeholder="Number of employees"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveOrganization}>
                  {isEditing ? 'Update Organization' : 'Save Organization'}
                </Button>
                <Button variant="outline" onClick={handleResetForm}>Reset Form</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizations.length === 0 ? (
                  <p className="text-gray-500 text-sm">No organizations yet. Create your first organization!</p>
                ) : (
                  organizations.slice(-3).reverse().map((org) => (
                    <div key={org.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="cursor-pointer flex-1" onClick={() => handleEditOrganization(org)}>
                          <h4 className="font-medium text-gray-900">{org.name}</h4>
                          <p className="text-sm text-gray-500">{org.riskOwner}</p>
                          <p className="text-xs text-gray-400">{org.assetGroup}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleEditOrganization(org)}>
                          <Edit size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Organizations</span>
                  <span className="font-semibold">{stats.totalOrganizations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Risk Owners</span>
                  <span className="font-semibold">{stats.totalRiskOwners}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Asset Groups</span>
                  <span className="font-semibold">{stats.totalAssetGroups}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Compliance Rate</span>
                  <span className="font-semibold text-green-600">{stats.complianceRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
