
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RiskDescriptionData {
  id: string;
  riskOwner: string;
  assetGroup: string;
  asset: string;
  threat: string;
  vulnerability: string;
  riskType: string;
  evidenceFile?: File;
  evidenceFileName?: string;
  createdAt: string;
  updatedAt: string;
}

interface RiskDescriptionFormProps {
  onViewReports: () => void;
}

export const RiskDescriptionForm = ({ onViewReports }: RiskDescriptionFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    riskOwner: "",
    assetGroup: "",
    asset: "",
    threat: "",
    vulnerability: "",
    riskType: "",
    evidenceFile: null as File | null,
  });

  const riskTypes = [
    "Operational",
    "Strategic", 
    "Compliance",
    "Financial",
    "Reputational",
    "Technology",
    "Legal"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, evidenceFile: file }));
  };

  const validateForm = () => {
    const required = ['riskOwner', 'assetGroup', 'asset', 'threat', 'vulnerability', 'riskType'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Validation Error",
          description: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const riskRecord: RiskDescriptionData = {
      id: Date.now().toString(),
      ...formData,
      evidenceFileName: formData.evidenceFile?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in localStorage
    const existingRisks = JSON.parse(localStorage.getItem('riskDescriptions') || '[]');
    existingRisks.push(riskRecord);
    localStorage.setItem('riskDescriptions', JSON.stringify(existingRisks));

    toast({
      title: "Success",
      description: "Risk description saved successfully",
    });

    // Reset form
    setFormData({
      riskOwner: "",
      assetGroup: "",
      asset: "",
      threat: "",
      vulnerability: "",
      riskType: "",
      evidenceFile: null,
    });

    // Reset file input
    const fileInput = document.getElementById('evidence-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Description Form</h1>
          <p className="text-gray-600 mt-1">Document and categorize organizational risks</p>
        </div>
        <Button onClick={onViewReports} className="flex items-center gap-2">
          <Eye size={16} />
          View Risk Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Risk Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="riskOwner">Risk Owner *</Label>
              <Input
                id="riskOwner"
                value={formData.riskOwner}
                onChange={(e) => handleInputChange('riskOwner', e.target.value)}
                placeholder="Enter risk owner name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetGroup">Asset Group *</Label>
              <Input
                id="assetGroup"
                value={formData.assetGroup}
                onChange={(e) => handleInputChange('assetGroup', e.target.value)}
                placeholder="Enter asset group"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset">Asset *</Label>
              <Input
                id="asset"
                value={formData.asset}
                onChange={(e) => handleInputChange('asset', e.target.value)}
                placeholder="Enter specific asset"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskType">Risk Type *</Label>
              <Select value={formData.riskType} onValueChange={(value) => handleInputChange('riskType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk type" />
                </SelectTrigger>
                <SelectContent>
                  {riskTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threat">Threat *</Label>
            <Textarea
              id="threat"
              value={formData.threat}
              onChange={(e) => handleInputChange('threat', e.target.value)}
              placeholder="Describe the threat in detail"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vulnerability">Vulnerability *</Label>
            <Textarea
              id="vulnerability"
              value={formData.vulnerability}
              onChange={(e) => handleInputChange('vulnerability', e.target.value)}
              placeholder="Describe the vulnerability in detail"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence-upload">Evidence Upload</Label>
            <div className="flex items-center gap-4">
              <Input
                id="evidence-upload"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                className="flex-1"
              />
              <Upload size={20} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Accepted formats: PDF, DOCX, XLSX, PNG, JPG (Max 10MB)
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={handleSubmit} size="lg" className="w-full md:w-auto">
              Submit Risk Description
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
