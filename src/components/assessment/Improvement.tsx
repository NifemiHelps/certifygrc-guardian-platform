import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Download, Eye } from "lucide-react";

interface ImprovementSection {
  id: string;
  title: string;
  question: string;
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidenceFiles: File[];
}

export const Improvement = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<ImprovementSection[]>([
    {
      id: "continual-improvement",
      title: "10.1 Continual improvement",
      question: "Are all of the topics from the standard a to f covered in each management review?",
      reqsMet: "",
      comments: "",
      actionNeeded: "",
      actionOwner: "",
      evidenceFiles: []
    },
    {
      id: "nonconformity-corrective-action",
      title: "10.2 Nonconformity and corrective action",
      question: "Are nonconformities being identified, documented and corrective actions taken?",
      reqsMet: "",
      comments: "",
      actionNeeded: "",
      actionOwner: "",
      evidenceFiles: []
    }
  ]);

  const updateSection = (sectionId: string, field: keyof ImprovementSection, value: any) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    ));
  };

  const handleFileUpload = (sectionId: string, files: FileList | null) => {
    if (files) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg'];
      const validFiles = Array.from(files).filter(file => validTypes.includes(file.type));
      
      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid file type",
          description: "Only PDF, DOCX, XLSX, PNG, and JPG files are allowed.",
          variant: "destructive"
        });
        return;
      }

      updateSection(sectionId, 'evidenceFiles', validFiles);
      toast({
        title: "Files uploaded",
        description: `${validFiles.length} file(s) uploaded successfully.`
      });
    }
  };

  const handleSubmit = () => {
    const incompleteSections = sections.filter(section => !section.reqsMet);
    
    if (incompleteSections.length > 0) {
      toast({
        title: "Incomplete sections",
        description: "Please complete all required fields (REQS MET) before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to a database
    console.log("Improvement Assessment Data:", sections);
    
    toast({
      title: "Assessment saved",
      description: "10. Improvement assessment has been saved successfully."
    });
  };

  const navigateToReports = () => {
    // This would typically use router navigation
    window.location.hash = '#improvement-reports';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">10. Improvement Assessment</h1>
          <p className="text-gray-600 mt-2">Assess improvement activities under Clause 10 of ISO 27001</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={navigateToReports} variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={section.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">{section.title}</CardTitle>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800">Assessment Question:</p>
                <p className="text-blue-700 mt-1">{section.question}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`reqsMet-${section.id}`} className="text-sm font-medium">
                    REQS MET <span className="text-red-500">*</span>
                  </Label>
                  <Select value={section.reqsMet} onValueChange={(value) => updateSection(section.id, 'reqsMet', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`actionOwner-${section.id}`} className="text-sm font-medium">
                    Action Owner
                  </Label>
                  <Input
                    id={`actionOwner-${section.id}`}
                    value={section.actionOwner}
                    onChange={(e) => updateSection(section.id, 'actionOwner', e.target.value)}
                    placeholder="Enter action owner name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`comments-${section.id}`} className="text-sm font-medium">
                  Comments
                </Label>
                <Textarea
                  id={`comments-${section.id}`}
                  value={section.comments}
                  onChange={(e) => updateSection(section.id, 'comments', e.target.value)}
                  placeholder="Add your comments here..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor={`actionNeeded-${section.id}`} className="text-sm font-medium">
                  Action needed to meet REQS
                </Label>
                <Textarea
                  id={`actionNeeded-${section.id}`}
                  value={section.actionNeeded}
                  onChange={(e) => updateSection(section.id, 'actionNeeded', e.target.value)}
                  placeholder="Describe actions needed to meet requirements..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Evidence Upload</Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor={`evidence-${section.id}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> evidence files
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX, XLSX, PNG, JPG (MAX. 10MB each)</p>
                      </div>
                      <input
                        id={`evidence-${section.id}`}
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(section.id, e.target.files)}
                      />
                    </label>
                  </div>
                  
                  {section.evidenceFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium">Uploaded files:</p>
                      {section.evidenceFiles.map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <FileText className="h-4 w-4" />
                          <span>{file.name}</span>
                          <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Button onClick={handleSubmit} size="lg" className="px-8">
          Save Assessment
        </Button>
      </div>
    </div>
  );
};