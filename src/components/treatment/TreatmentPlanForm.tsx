
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarIcon, Upload, FileText, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface TreatmentPlanFormProps {
  onViewReports: () => void;
}

export const TreatmentPlanForm = ({ onViewReports }: TreatmentPlanFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    treatmentOption: '',
    proposedAction: '',
    controlReference: '',
    treatmentCost: '',
    actionOwner: '',
    actionTimescale: null as Date | null,
    actionStatus: '',
    evidence: null as File | null,
    evidenceComment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const treatmentOptions = [
    { value: 'avoid', label: 'Avoid' },
    { value: 'share', label: 'Share' },
    { value: 'accept', label: 'Accept' },
    { value: 'modify', label: 'Modify' }
  ];

  const statusOptions = [
    { value: 'select', label: 'Select' },
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png'];
      
      if (validTypes.includes(file.type)) {
        setFormData(prev => ({ ...prev, evidence: file }));
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, DOCX, Excel, or image files only.",
          variant: "destructive"
        });
      }
    }
  };

  const validateForm = () => {
    const required = ['treatmentOption', 'proposedAction', 'actionOwner', 'actionStatus'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missing.map(f => f.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create treatment plan record
      const treatmentPlan = {
        id: Date.now().toString(),
        treatmentOption: formData.treatmentOption,
        proposedAction: formData.proposedAction,
        controlReference: formData.controlReference,
        treatmentCost: parseFloat(formData.treatmentCost) || 0,
        actionOwner: formData.actionOwner,
        actionTimescale: formData.actionTimescale?.toISOString(),
        actionStatus: formData.actionStatus,
        evidenceFile: formData.evidence ? {
          name: formData.evidence.name,
          size: formData.evidence.size,
          type: formData.evidence.type
        } : null,
        evidenceComment: formData.evidenceComment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingPlans = JSON.parse(localStorage.getItem('treatmentPlans') || '[]');
      existingPlans.push(treatmentPlan);
      localStorage.setItem('treatmentPlans', JSON.stringify(existingPlans));

      // Store file separately if exists
      if (formData.evidence) {
        const fileData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(formData.evidence!);
        });
        
        const fileStorage = JSON.parse(localStorage.getItem('treatmentPlanFiles') || '{}');
        fileStorage[treatmentPlan.id] = fileData;
        localStorage.setItem('treatmentPlanFiles', JSON.stringify(fileStorage));
      }

      toast({
        title: "Success!",
        description: "Treatment plan has been submitted successfully.",
        variant: "default"
      });

      // Reset form
      setFormData({
        treatmentOption: '',
        proposedAction: '',
        controlReference: '',
        treatmentCost: '',
        actionOwner: '',
        actionTimescale: null,
        actionStatus: '',
        evidence: null,
        evidenceComment: ''
      });

      // Reset file input
      const fileInput = document.getElementById('evidence-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error submitting treatment plan:', error);
      toast({
        title: "Error",
        description: "Failed to submit treatment plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Treatment Plan</h2>
          <p className="text-gray-600 mt-1">Create comprehensive treatment plans for identified risks</p>
        </div>
        <Button onClick={onViewReports} className="flex items-center gap-2">
          <BarChart3 size={16} />
          View Treatment Plan Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Treatment Plan Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="treatmentOption">Treatment Option Chosen *</Label>
                <Select value={formData.treatmentOption} onValueChange={(value) => handleInputChange('treatmentOption', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment option" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionOwner">Treatment Action Owner *</Label>
                <Input
                  id="actionOwner"
                  value={formData.actionOwner}
                  onChange={(e) => handleInputChange('actionOwner', e.target.value)}
                  placeholder="Enter action owner"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="controlReference">Annex A / Control Reference</Label>
                <Input
                  id="controlReference"
                  value={formData.controlReference}
                  onChange={(e) => handleInputChange('controlReference', e.target.value)}
                  placeholder="Enter control reference"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentCost">Treatment Cost</Label>
                <Input
                  id="treatmentCost"
                  type="number"
                  step="0.01"
                  value={formData.treatmentCost}
                  onChange={(e) => handleInputChange('treatmentCost', e.target.value)}
                  placeholder="Enter cost amount"
                />
              </div>

              <div className="space-y-2">
                <Label>Treatment Action Timescale</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.actionTimescale && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.actionTimescale ? (
                        format(formData.actionTimescale, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.actionTimescale}
                      onSelect={(date) => handleInputChange('actionTimescale', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionStatus">Treatment Action Status *</Label>
                <Select value={formData.actionStatus} onValueChange={(value) => handleInputChange('actionStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposedAction">Proposed Treatment Action *</Label>
              <Textarea
                id="proposedAction"
                value={formData.proposedAction}
                onChange={(e) => handleInputChange('proposedAction', e.target.value)}
                placeholder="Describe the proposed treatment action"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence-upload">Evidence Upload</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="evidence-upload"
                  type="file"
                  accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
              {formData.evidence && (
                <p className="text-sm text-gray-600">
                  Selected: {formData.evidence.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidenceComment">Evidence Comment</Label>
              <Textarea
                id="evidenceComment"
                value={formData.evidenceComment}
                onChange={(e) => handleInputChange('evidenceComment', e.target.value)}
                placeholder="Add comments about the evidence"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Treatment Plan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
