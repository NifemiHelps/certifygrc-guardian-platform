
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Save, FileText } from "lucide-react";

interface AssessmentEvidenceProps {
  setActivePage?: (page: string) => void;
}

interface SectionData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidenceFiles: File[];
}

interface FormData {
  "4.1": SectionData;
  "4.2": SectionData;
  "4.3": SectionData;
  "4.4": SectionData;
  submissionDate?: string;
  id?: string;
}

const sections = [
  {
    id: "4.1" as keyof FormData,
    title: "4.1 Understanding the organization and its context",
    question: "Understanding the organization and its context."
  },
  {
    id: "4.2" as keyof FormData,
    title: "4.2 Understanding the needs and expectations of interested parties",
    question: "Understanding the needs and expectations of interested parties."
  },
  {
    id: "4.3" as keyof FormData,
    title: "4.3 Determining the scope of the information security management system",
    question: "Determining the scope of the information security management system."
  },
  {
    id: "4.4" as keyof FormData,
    title: "4.4 Information security management system",
    question: "Information security management system."
  }
];

export const AssessmentEvidence = ({ setActivePage }: AssessmentEvidenceProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    "4.1": { reqsMet: "", comments: "", actionNeeded: "", actionOwner: "", evidenceFiles: [] },
    "4.2": { reqsMet: "", comments: "", actionNeeded: "", actionOwner: "", evidenceFiles: [] },
    "4.3": { reqsMet: "", comments: "", actionNeeded: "", actionOwner: "", evidenceFiles: [] },
    "4.4": { reqsMet: "", comments: "", actionNeeded: "", actionOwner: "", evidenceFiles: [] }
  });

  const updateSectionData = (sectionId: keyof FormData, field: keyof SectionData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] as SectionData),
        [field]: value
      }
    }));
  };

  const handleFileUpload = (sectionId: keyof FormData, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      updateSectionData(sectionId, 'evidenceFiles', fileArray);
    }
  };

  const validateForm = (): boolean => {
    for (const section of sections) {
      const sectionData = formData[section.id] as SectionData;
      if (!sectionData.reqsMet) {
        toast({
          title: "Validation Error",
          description: `Please select REQS MET for ${section.title}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submission = {
      ...formData,
      submissionDate: new Date().toISOString(),
      id: Date.now().toString()
    };

    const existingData = JSON.parse(localStorage.getItem('assessmentEvidenceData') || '[]');
    const newData = [...existingData, submission];
    localStorage.setItem('assessmentEvidenceData', JSON.stringify(newData));

    toast({
      title: "Success",
      description: "Assessment evidence submitted successfully!",
    });

    // Reset form
    setFormData({
      "4.1": { reqsMet: "", comments: "", actionNeeded: "", actionOwner: "", evidenceFiles: [] },
      "4.2": { reqsMet: "", comments: "", actionNeeded: "", actionOwner: "", evidenceFiles: [] },
      "4.3": { reqsMet: "", comments: "", actionNeeded: "", actionOwner: "", evidenceFiles: [] },
      "4.4": { reqsMet: "", comments: "", actionNeeded: "", actionOwner: "", evidenceFiles: [] }
    });
  };

  const renderSection = (section: typeof sections[0]) => {
    const sectionData = formData[section.id] as SectionData;

    return (
      <Card key={section.id} className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            {section.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {section.question}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`reqs-${section.id}`} className="text-sm font-medium">
                REQS MET <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={sectionData.reqsMet} 
                onValueChange={(value) => updateSectionData(section.id, 'reqsMet', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`action-owner-${section.id}`} className="text-sm font-medium">
                Action Owner
              </Label>
              <Input
                id={`action-owner-${section.id}`}
                value={sectionData.actionOwner}
                onChange={(e) => updateSectionData(section.id, 'actionOwner', e.target.value)}
                placeholder="Enter action owner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`comments-${section.id}`} className="text-sm font-medium">
              Comments
            </Label>
            <Textarea
              id={`comments-${section.id}`}
              value={sectionData.comments}
              onChange={(e) => updateSectionData(section.id, 'comments', e.target.value)}
              placeholder="Enter comments"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`action-needed-${section.id}`} className="text-sm font-medium">
              Action needed to meet REQS
            </Label>
            <Textarea
              id={`action-needed-${section.id}`}
              value={sectionData.actionNeeded}
              onChange={(e) => updateSectionData(section.id, 'actionNeeded', e.target.value)}
              placeholder="Enter action needed"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`evidence-${section.id}`} className="text-sm font-medium">
              Evidence Upload
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-muted-foreground/40 transition-colors">
              <div className="flex flex-col items-center justify-center space-y-2">
                <FileUp className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <Label htmlFor={`evidence-${section.id}`} className="cursor-pointer">
                    <span className="text-sm text-primary hover:text-primary/80">
                      Click to upload files
                    </span>
                    <Input
                      id={`evidence-${section.id}`}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(section.id, e.target.files)}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports multiple file types
                  </p>
                </div>
              </div>
              {sectionData.evidenceFiles.length > 0 && (
                <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                  <p className="text-xs text-muted-foreground mb-2">Uploaded files:</p>
                  <div className="space-y-1">
                    {sectionData.evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <FileText className="h-3 w-3" />
                        <span className="truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessment Evidence</h1>
          <p className="text-muted-foreground mt-1">Evidence collection and management for ISO compliance</p>
        </div>
        <Button 
          onClick={() => setActivePage?.('assessment-evidence-reports')}
          variant="outline"
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          View Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">4. Context of the Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {sections.map(renderSection)}
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Submit Assessment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
