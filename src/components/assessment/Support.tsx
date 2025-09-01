
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Save, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportProps {
  setActivePage?: (page: string) => void;
}

interface SectionData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidenceFile: File | null;
}

interface SupportAssessment {
  id: string;
  timestamp: string;
  sections: Record<string, SectionData>;
}

const sections = [
  {
    id: "7.2.1",
    title: "7.2 Competence",
    question: "Are ISMS resources determined and provided?"
  },
  {
    id: "7.2.2", 
    title: "7.2 Competence",
    question: "Are all relevant people aware of the information security policy and the importance of good security?"
  },
  {
    id: "7.2.3",
    title: "7.2 Competence", 
    question: "Where necessary, is action taken to improve competence and are records kept?"
  },
  {
    id: "7.2.4",
    title: "7.2 Competence",
    question: "Are all of the relevant people sufficiently competent to perform their roles?"
  },
  {
    id: "7.3.1",
    title: "7.3 Awareness",
    question: "Are all relevant people aware of the information security policy and the importance of good security?"
  },
  {
    id: "7.4.1",
    title: "7.4 Communication", 
    question: "Is effective internal and external communication in place?"
  },
  {
    id: "7.5.1",
    title: "7.5 Documented information",
    question: "7.5.1 Is all of the documented information required by the standard in place?"
  },
  {
    id: "7.5.2",
    title: "7.5 Documented information",
    question: "7.5.2 Are standards used for documentation such as titles, references, format, review and approval?"
  },
  {
    id: "7.5.3",
    title: "7.5 Documented information", 
    question: "7.5.3 Is the lifecycle of documented information controlled, including that from outside the organization?"
  }
];

export const Support = ({ setActivePage }: SupportProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, SectionData>>(() => {
    const initialData: Record<string, SectionData> = {};
    sections.forEach(section => {
      initialData[section.id] = {
        reqsMet: '',
        comments: '',
        actionNeeded: '',
        actionOwner: '',
        evidenceFile: null
      };
    });
    return initialData;
  });

  const handleInputChange = (sectionId: string, field: keyof SectionData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  };

  const handleFileChange = (sectionId: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        evidenceFile: file
      }
    }));
  };

  const handleSave = () => {
    // Validation
    const incompleteFields = [];
    for (const section of sections) {
      const data = formData[section.id];
      if (!data.reqsMet) {
        incompleteFields.push(`${section.title} - REQS MET`);
      }
    }

    if (incompleteFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please complete the following required fields: ${incompleteFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    const assessment: SupportAssessment = {
      id: `support-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sections: formData
    };

    const existingAssessments = JSON.parse(localStorage.getItem('supportAssessments') || '[]');
    const updatedAssessments = [...existingAssessments, assessment];
    localStorage.setItem('supportAssessments', JSON.stringify(updatedAssessments));

    toast({
      title: "Assessment Saved",
      description: "7. Support assessment has been saved successfully!",
    });

    console.log('Support Assessment saved:', assessment);
  };

  const handleViewReports = () => {
    setActivePage?.('support-reports');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">7. Support</h1>
          <p className="text-muted-foreground mt-1">ISO 27001 Support Assessment</p>
        </div>
        <Button 
          onClick={handleViewReports}
          variant="outline"
          className="gap-2"
        >
          <BarChart className="h-4 w-4" />
          View Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">7. Support Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
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

  function renderSection(section: typeof sections[0]) {
    const sectionData = formData[section.id];

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
                onValueChange={(value) => handleInputChange(section.id, 'reqsMet', value)}
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
                onChange={(e) => handleInputChange(section.id, 'actionOwner', e.target.value)}
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
              onChange={(e) => handleInputChange(section.id, 'comments', e.target.value)}
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
              onChange={(e) => handleInputChange(section.id, 'actionNeeded', e.target.value)}
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
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <Label htmlFor={`evidence-file-${section.id}`} className="cursor-pointer">
                    <span className="text-sm text-primary hover:text-primary/80">
                      Click to upload files
                    </span>
                    <Input
                      id={`evidence-file-${section.id}`}
                      type="file"
                      accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileChange(section.id, e.target.files?.[0] || null)}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports multiple file types
                  </p>
                </div>
              </div>
              {sectionData.evidenceFile && (
                <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                  <p className="text-xs text-muted-foreground mb-2">Uploaded file:</p>
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-3 w-3" />
                    <span className="truncate">{sectionData.evidenceFile.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
};
