
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, BarChart } from "lucide-react";

interface PostTreatmentFormProps {
  onViewReports: () => void;
}

export const PostTreatmentForm = ({ onViewReports }: PostTreatmentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    existingControls: "",
    likelihoodPostTreatment: "",
    likelihoodRationalePostTreatment: "",
    impactPostTreatment: "",
    impactRationalePostTreatment: "",
    evidenceComment: "",
    evidenceFiles: [] as File[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.existingControls || !formData.likelihoodPostTreatment || !formData.impactPostTreatment) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    const assessment = {
      id: Date.now().toString(),
      ...formData,
      evidenceFiles: formData.evidenceFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      })),
      createdAt: new Date().toISOString()
    };

    const existingAssessments = JSON.parse(localStorage.getItem('postTreatmentAssessments') || '[]');
    const updatedAssessments = [...existingAssessments, assessment];
    localStorage.setItem('postTreatmentAssessments', JSON.stringify(updatedAssessments));

    toast({
      title: "Success",
      description: "Post-treatment assessment saved successfully!",
    });

    // Reset form
    setFormData({
      existingControls: "",
      likelihoodPostTreatment: "",
      likelihoodRationalePostTreatment: "",
      impactPostTreatment: "",
      impactRationalePostTreatment: "",
      evidenceComment: "",
      evidenceFiles: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Post-Treatment Assessment</h2>
          <p className="text-gray-600">Evaluate risk levels after implementing treatment plans</p>
        </div>
        <Button onClick={onViewReports} className="flex items-center gap-2">
          <BarChart size={16} />
          Go to Post-Treatment Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Post-Treatment Evaluation Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="existingControls">Existing Controls *</Label>
                <Textarea
                  id="existingControls"
                  placeholder="Describe the existing controls in place..."
                  value={formData.existingControls}
                  onChange={(e) => handleInputChange('existingControls', e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="likelihoodPostTreatment">Likelihood (Post-Treatment) *</Label>
                <Select
                  value={formData.likelihoodPostTreatment}
                  onValueChange={(value) => handleInputChange('likelihoodPostTreatment', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select likelihood level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Very Low">Very Low</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Very High">Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="impactPostTreatment">Impact (Post-Treatment) *</Label>
                <Select
                  value={formData.impactPostTreatment}
                  onValueChange={(value) => handleInputChange('impactPostTreatment', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Very Low">Very Low</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Very High">Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="likelihoodRationalePostTreatment">Likelihood Rationale (Post-Treatment)</Label>
                <Textarea
                  id="likelihoodRationalePostTreatment"
                  placeholder="Explain the rationale for the likelihood assessment..."
                  value={formData.likelihoodRationalePostTreatment}
                  onChange={(e) => handleInputChange('likelihoodRationalePostTreatment', e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="impactRationalePostTreatment">Impact Rationale (Post-Treatment)</Label>
                <Textarea
                  id="impactRationalePostTreatment"
                  placeholder="Explain the rationale for the impact assessment..."
                  value={formData.impactRationalePostTreatment}
                  onChange={(e) => handleInputChange('impactRationalePostTreatment', e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="evidenceUpload">Evidence Upload</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <input
                      type="file"
                      id="evidenceUpload"
                      multiple
                      accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="evidenceUpload"
                      className="cursor-pointer text-blue-600 hover:text-blue-500"
                    >
                      Click to upload files
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, DOCX, XLSX, JPG, PNG files up to 10MB each
                    </p>
                  </div>
                </div>
                
                {formData.evidenceFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
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

              <div className="md:col-span-2">
                <Label htmlFor="evidenceComment">Evidence Comment</Label>
                <Textarea
                  id="evidenceComment"
                  placeholder="Add any comments about the uploaded evidence..."
                  value={formData.evidenceComment}
                  onChange={(e) => handleInputChange('evidenceComment', e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Submit Assessment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
