
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">7. Support</h1>
          <p className="text-gray-600 mt-1">ISO 27001 Support Assessment</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleViewReports} variant="outline" className="flex items-center gap-2">
            <BarChart size={16} />
            View 7. Support Reports
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            7. Support Assessment Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {sections.map((section, index) => (
            <div key={section.id} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Section {index + 1}: {section.title}
                </h3>
                <p className="text-gray-700 mb-4 p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
                  {section.question}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`reqsMet-${section.id}`}>REQS MET *</Label>
                  <Select 
                    value={formData[section.id].reqsMet} 
                    onValueChange={(value) => handleInputChange(section.id, 'reqsMet', value)}
                  >
                    <SelectTrigger id={`reqsMet-${section.id}`}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`actionOwner-${section.id}`}>Action Owner</Label>
                  <Input
                    id={`actionOwner-${section.id}`}
                    value={formData[section.id].actionOwner}
                    onChange={(e) => handleInputChange(section.id, 'actionOwner', e.target.value)}
                    placeholder="Enter action owner name"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`comments-${section.id}`}>Comments</Label>
                  <Textarea
                    id={`comments-${section.id}`}
                    value={formData[section.id].comments}
                    onChange={(e) => handleInputChange(section.id, 'comments', e.target.value)}
                    placeholder="Enter your comments here..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`actionNeeded-${section.id}`}>Action Needed to Meet REQS</Label>
                  <Textarea
                    id={`actionNeeded-${section.id}`}
                    value={formData[section.id].actionNeeded}
                    onChange={(e) => handleInputChange(section.id, 'actionNeeded', e.target.value)}
                    placeholder="Describe actions needed to meet requirements..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`evidence-${section.id}`}>Evidence Upload</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`evidence-${section.id}`}
                      type="file"
                      accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(section.id, e.target.files?.[0] || null)}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <Upload className="h-4 w-4 text-gray-400" />
                  </div>
                  {formData[section.id].evidenceFile && (
                    <p className="text-sm text-green-600">
                      File selected: {formData[section.id].evidenceFile?.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, DOCX, XLSX, JPG, PNG (Max 10MB)
                  </p>
                </div>
              </div>

              {index < sections.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}

          <div className="flex justify-end pt-6">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} />
              Save Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
