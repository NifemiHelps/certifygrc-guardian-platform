import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Eye } from "lucide-react";

interface ContextOfOrganizationProps {
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
  section1: SectionData;
  section2: SectionData;
  section3: SectionData;
  section4: SectionData;
  submittedAt: string;
  id: string;
}

const initialSectionData: SectionData = {
  reqsMet: "",
  comments: "",
  actionNeeded: "",
  actionOwner: "",
  evidenceFiles: []
};

export const ContextOfOrganization = ({ setActivePage }: ContextOfOrganizationProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    section1: { ...initialSectionData },
    section2: { ...initialSectionData },
    section3: { ...initialSectionData },
    section4: { ...initialSectionData },
    submittedAt: "",
    id: ""
  });

  const sections = [
    {
      id: "section1",
      title: "4.1 Understanding the organization and its context",
      question: "Have the external and internal issues that affect the ISMS been determined?"
    },
    {
      id: "section2", 
      title: "4.2 Understanding the needs and expectations of interested parties",
      question: "Have the interested parties and their requirements been identified?"
    },
    {
      id: "section3",
      title: "4.3 Determining the scope of the information security management system", 
      question: "Has the scope of the ISMS been determined and documented?"
    },
    {
      id: "section4",
      title: "4.4 Information security management system",
      question: "Is an ISMS in place and being continually improved?"
    }
  ];

  const updateSectionData = (sectionId: keyof FormData, field: keyof SectionData, value: any) => {
    if (sectionId === 'submittedAt' || sectionId === 'id') return;
    
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (sectionId: keyof FormData, files: FileList | null) => {
    if (!files || sectionId === 'submittedAt' || sectionId === 'id') return;
    
    const fileArray = Array.from(files);
    updateSectionData(sectionId, 'evidenceFiles', fileArray);
  };

  const validateForm = (): boolean => {
    for (const section of sections) {
      const sectionData = formData[section.id as keyof FormData] as SectionData;
      if (!sectionData.reqsMet) {
        toast({
          title: "Validation Error",
          description: `Please select REQS MET for ${section.title}`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submissionData = {
      ...formData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('contextOrganizationRecords') || '[]');
    existingData.push(submissionData);
    localStorage.setItem('contextOrganizationRecords', JSON.stringify(existingData));

    toast({
      title: "Assessment Saved",
      description: "Context of Organization assessment has been saved successfully."
    });

    // Reset form
    setFormData({
      section1: { ...initialSectionData },
      section2: { ...initialSectionData },
      section3: { ...initialSectionData },
      section4: { ...initialSectionData },
      submittedAt: "",
      id: ""
    });
  };

  const renderSection = (section: typeof sections[0]) => {
    const sectionData = formData[section.id as keyof FormData] as SectionData;

    return (
      <Card key={section.id} className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{section.title}</CardTitle>
          <p className="text-muted-foreground font-medium">{section.question}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${section.id}-reqs`}>REQS MET</Label>
              <Select
                value={sectionData.reqsMet}
                onValueChange={(value) => updateSectionData(section.id as keyof FormData, 'reqsMet', value)}
              >
                <SelectTrigger id={`${section.id}-reqs`}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`${section.id}-owner`}>Action Owner</Label>
              <Input
                id={`${section.id}-owner`}
                value={sectionData.actionOwner}
                onChange={(e) => updateSectionData(section.id as keyof FormData, 'actionOwner', e.target.value)}
                placeholder="Enter action owner"
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`${section.id}-comments`}>Comments</Label>
            <Input
              id={`${section.id}-comments`}
              value={sectionData.comments}
              onChange={(e) => updateSectionData(section.id as keyof FormData, 'comments', e.target.value)}
              placeholder="Enter comments"
            />
          </div>

          <div>
            <Label htmlFor={`${section.id}-action`}>Action needed to meet REQS</Label>
            <Textarea
              id={`${section.id}-action`}
              value={sectionData.actionNeeded}
              onChange={(e) => updateSectionData(section.id as keyof FormData, 'actionNeeded', e.target.value)}
              placeholder="Describe actions needed..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor={`${section.id}-evidence`}>Evidence Upload</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <input
                id={`${section.id}-evidence`}
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.gif"
                onChange={(e) => handleFileUpload(section.id as keyof FormData, e.target.files)}
                className="hidden"
              />
              <label
                htmlFor={`${section.id}-evidence`}
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click to upload evidence files (PDF, DOCX, Excel, Images)
                </span>
              </label>
              {sectionData.evidenceFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {sectionData.evidenceFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">4. Context of Organization</h1>
          <p className="text-muted-foreground mt-1">ISO/IEC 27001 organizational context assessment</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setActivePage?.('context-organization-reports')}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Context of Organization Reports
        </Button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {sections.map(renderSection)}

        <div className="flex justify-end gap-4 pt-6">
          <Button type="submit" size="lg">
            Save Assessment
          </Button>
        </div>
      </form>
    </div>
  );
};