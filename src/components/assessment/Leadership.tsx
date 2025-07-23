import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileUp, Eye } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActivePage?.('assessment-gap')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment Gap
          </Button>
        </div>
        <Button
          onClick={() => setActivePage?.('leadership-reports')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View 5. Leadership Reports
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">5. Leadership</h1>
        <p className="text-gray-600">
          Assessment of leadership commitment, policy implementation, and organizational roles for information security management.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <Card key={section.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">{section.title}</CardTitle>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 font-medium">Question:</p>
                <p className="text-gray-600 mt-1">{section.question}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${section.id}-reqs`}>REQS MET *</Label>
                  <Select
                    value={formData[section.id]?.reqsMet || ""}
                    onValueChange={(value) => updateSectionData(section.id, 'reqsMet', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${section.id}-owner`}>Action Owner</Label>
                  <Input
                    id={`${section.id}-owner`}
                    value={formData[section.id]?.actionOwner || ""}
                    onChange={(e) => updateSectionData(section.id, 'actionOwner', e.target.value)}
                    placeholder="Enter action owner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${section.id}-comments`}>Comments</Label>
                <Input
                  id={`${section.id}-comments`}
                  value={formData[section.id]?.comments || ""}
                  onChange={(e) => updateSectionData(section.id, 'comments', e.target.value)}
                  placeholder="Enter your comments"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${section.id}-action`}>Action needed to meet REQS</Label>
                <Textarea
                  id={`${section.id}-action`}
                  value={formData[section.id]?.actionNeeded || ""}
                  onChange={(e) => updateSectionData(section.id, 'actionNeeded', e.target.value)}
                  placeholder="Describe actions needed..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${section.id}-evidence`}>Evidence Upload</Label>
                <div className="flex items-center gap-2">
                  <input
                    id={`${section.id}-evidence`}
                    type="file"
                    accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(section.id, e)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById(`${section.id}-evidence`)?.click()}
                    className="flex items-center gap-2"
                  >
                    <FileUp className="h-4 w-4" />
                    Choose File
                  </Button>
                  {formData[section.id]?.evidence && (
                    <span className="text-sm text-gray-600">
                      {formData[section.id].evidence?.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOCX, Excel, Images (max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          Submit Assessment
        </Button>
      </div>
    </div>
  );
};