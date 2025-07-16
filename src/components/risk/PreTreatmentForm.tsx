
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreTreatmentFormProps {
  onViewReports: () => void;
}

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

export const PreTreatmentForm = ({ onViewReports }: PreTreatmentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    existingControls: "",
    likelihoodPreTreatment: "",
    likelihoodRationale: "",
    impactPreTreatment: "",
    impactRationale: "",
    evidenceFiles: [] as File[]
  });

  const riskLevels = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      evidenceFiles: [...prev.evidenceFiles, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.existingControls.trim()) {
      toast({
        title: "Validation Error",
        description: "Existing Controls is required",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.likelihoodPreTreatment) {
      toast({
        title: "Validation Error",
        description: "Likelihood (Pre-Treatment) is required",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.impactPreTreatment) {
      toast({
        title: "Validation Error",
        description: "Impact (Pre-Treatment) is required",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newRecord: PreTreatmentData = {
      id: `pre-treatment-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingRecords = JSON.parse(localStorage.getItem('preTreatmentAssessments') || '[]');
    const updatedRecords = [...existingRecords, newRecord];
    localStorage.setItem('preTreatmentAssessments', JSON.stringify(updatedRecords));

    toast({
      title: "Success",
      description: "Pre-Treatment Assessment saved successfully",
    });

    // Reset form
    setFormData({
      existingControls: "",
      likelihoodPreTreatment: "",
      likelihoodRationale: "",
      impactPreTreatment: "",
      impactRationale: "",
      evidenceFiles: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pre-Treatment Assessment</h2>
          <p className="text-gray-600 mt-1">Assess existing controls and risk levels before treatment</p>
        </div>
        <Button onClick={onViewReports} variant="outline" className="flex items-center gap-2">
          <Eye size={16} />
          View Pre-Treatment Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="existingControls">Existing Controls *</Label>
              <Textarea
                id="existingControls"
                placeholder="Describe the current controls in place..."
                value={formData.existingControls}
                onChange={(e) => handleInputChange('existingControls', e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="likelihoodPreTreatment">Likelihood (Pre-Treatment) *</Label>
                <Select value={formData.likelihoodPreTreatment} onValueChange={(value) => handleInputChange('likelihoodPreTreatment', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select likelihood level" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="impactPreTreatment">Impact (Pre-Treatment) *</Label>
                <Select value={formData.impactPreTreatment} onValueChange={(value) => handleInputChange('impactPreTreatment', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="likelihoodRationale">Likelihood Rationale (Pre-Treatment)</Label>
              <Textarea
                id="likelihoodRationale"
                placeholder="Provide rationale for the likelihood assessment..."
                value={formData.likelihoodRationale}
                onChange={(e) => handleInputChange('likelihoodRationale', e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="impactRationale">Impact Rationale (Pre-Treatment)</Label>
              <Textarea
                id="impactRationale"
                placeholder="Provide rationale for the impact assessment..."
                value={formData.impactRationale}
                onChange={(e) => handleInputChange('impactRationale', e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="evidenceUpload">Evidence Upload</Label>
              <div className="mt-1">
                <div className="flex items-center gap-4">
                  <Input
                    id="evidenceUpload"
                    type="file"
                    multiple
                    accept=".pdf,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  <Upload size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: PDF, DOCX, XLSX, PNG, JPG
                </p>
                
                {formData.evidenceFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="px-8">
              Submit Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
