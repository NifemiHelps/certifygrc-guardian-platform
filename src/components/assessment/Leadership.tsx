import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Eye, Save, FileText } from "lucide-react";

interface LeadershipProps {
  setActivePage?: (page: string) => void;
}

interface FormData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidence: File | null;
}

const sections = [
  {
    id: "5.1",
    title: "5.1 Leadership and commitment",
    question: "Does top management demonstrate leadership and commitment to the ISMS by providing resources and communicating effectively? (see list A to H)"
  },
  {
    id: "5.2.1",
    title: "5.2 Policy",
    question: "Is a documented information security policy in place?"
  },
  {
    id: "5.2.2",
    title: "5.2 Policy",
    question: "Does it set objectives for the ISMS?"
  },
  {
    id: "5.2.3",
    title: "5.2 Policy",
    question: "Does it commit the organization to satisfying requirements and continually improving the ISMS?"
  },
  {
    id: "5.2.4",
    title: "5.2 Policy",
    question: "Is it adequately communicated?"
  },
  {
    id: "5.3",
    title: "5.3 Organizational roles, responsibilities and authorities",
    question: "Are roles, responsibilities and authorities for the ISMS defined?"
  }
];

export const Leadership = ({ setActivePage }: LeadershipProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, FormData>>(
    sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: {
        reqsMet: "",
        comments: "",
        actionNeeded: "",
        actionOwner: "",
        evidence: null
      }
    }), {})
  );

  const updateSectionData = (sectionId: string, field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (sectionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateSectionData(sectionId, 'evidence', file);
  };

  const validateForm = () => {
    for (const section of sections) {
      const data = formData[section.id];
      if (!data.reqsMet) {
        toast({
          title: "Validation Error",
          description: `Please select REQS MET for section ${section.title}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    try {
      // Get existing records
      const existingRecords = JSON.parse(localStorage.getItem('leadershipAssessments') || '[]');
      
      // Create new record
      const newRecord = {
        id: Date.now().toString(),
        title: "5. Leadership",
        createdAt: new Date().toISOString(),
        sections: sections.map(section => ({
          ...section,
          data: {
            ...formData[section.id],
            evidenceFileName: formData[section.id].evidence?.name || null
          }
        }))
      };

      // Save to localStorage
      const updatedRecords = [...existingRecords, newRecord];
      localStorage.setItem('leadershipAssessments', JSON.stringify(updatedRecords));

      // Clear form
      setFormData(sections.reduce((acc, section) => ({
        ...acc,
        [section.id]: {
          reqsMet: "",
          comments: "",
          actionNeeded: "",
          actionOwner: "",
          evidence: null
        }
      }), {}));

      toast({
        title: "Success",
        description: "Leadership assessment saved successfully!",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">5. Leadership</h1>
          <p className="text-muted-foreground mt-1">Assessment of leadership commitment, policy implementation, and organizational roles for information security management.</p>
        </div>
        <Button 
          onClick={() => setActivePage?.('leadership-reports')}
          variant="outline"
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          View Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">5. Leadership Assessment</CardTitle>
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
                value={sectionData?.reqsMet || ""} 
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
                value={sectionData?.actionOwner || ""}
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
              value={sectionData?.comments || ""}
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
              value={sectionData?.actionNeeded || ""}
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
                  <Label htmlFor={`evidence-file-${section.id}`} className="cursor-pointer">
                    <span className="text-sm text-primary hover:text-primary/80">
                      Click to upload files
                    </span>
                    <Input
                      id={`evidence-file-${section.id}`}
                      type="file"
                      accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(section.id, e)}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports multiple file types
                  </p>
                </div>
              </div>
              {sectionData?.evidence && (
                <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                  <p className="text-xs text-muted-foreground mb-2">Uploaded file:</p>
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="h-3 w-3" />
                    <span className="truncate">{sectionData.evidence.name}</span>
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