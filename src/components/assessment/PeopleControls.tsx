import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidence: File[];
}

const PeopleControls: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, FormData>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const sections = [
    {
      id: 'a61',
      title: 'A.6.1 Screening',
      question: 'Potential employees are subject to appropriate background checks prior to employment.'
    },
    {
      id: 'a62',
      title: 'A.6.2 Terms and conditions of employment',
      question: 'Appropriate information security-related wording is included in employment contracts.'
    },
    {
      id: 'a63',
      title: 'A.6.3 Information security awareness, education and training',
      question: 'Awareness, education and training are conducted to make sure everyone has the skills to maintain information security.'
    },
    {
      id: 'a64',
      title: 'A.6.4 Disciplinary process',
      question: 'Anyone violating information security policy is subject to a formal disciplinary process.'
    },
    {
      id: 'a65',
      title: 'A.6.5 Responsibilities after termination or change of employment',
      question: 'Leavers and job changers are made aware of their ongoing information security obligations.'
    },
    {
      id: 'a66',
      title: 'A.6.6 Confidentiality or non-disclosure agreements',
      question: 'Agreements are documented and signed when protected information is shared.'
    },
    {
      id: 'a67',
      title: 'A.6.7 Remote working',
      question: 'An appropriately secure environment is established for all remote workers.'
    },
    {
      id: 'a68',
      title: 'A.6.8 Information security event reporting',
      question: 'People know how to report suspicious events when they come across them.'
    }
  ];

  const initializeFormData = (sectionId: string): FormData => {
    return formData[sectionId] || {
      reqsMet: '',
      comments: '',
      actionNeeded: '',
      actionOwner: '',
      evidence: []
    };
  };

  const updateFormData = (sectionId: string, field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...initializeFormData(sectionId),
        [field]: value
      }
    }));
  };

  const handleFileUpload = (sectionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const currentData = initializeFormData(sectionId);
      updateFormData(sectionId, 'evidence', [...currentData.evidence, ...files]);
    }
  };

  const removeFile = (sectionId: string, fileIndex: number) => {
    const currentData = initializeFormData(sectionId);
    const updatedFiles = currentData.evidence.filter((_, index) => index !== fileIndex);
    updateFormData(sectionId, 'evidence', updatedFiles);
  };

  const validateForm = (): boolean => {
    for (const section of sections) {
      const data = initializeFormData(section.id);
      if (!data.reqsMet || !data.comments.trim() || !data.actionNeeded.trim() || !data.actionOwner.trim()) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields for each section.",
        variant: "destructive"
      });
      return;
    }

    try {
      const savedAssessments = JSON.parse(localStorage.getItem('peopleControlsAssessments') || '[]');
      const newAssessment = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        sections: Object.keys(formData).reduce((acc, sectionId) => {
          acc[sectionId] = {
            ...formData[sectionId],
            evidence: formData[sectionId].evidence.map(file => ({
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified
            }))
          };
          return acc;
        }, {} as any)
      };

      savedAssessments.push(newAssessment);
      localStorage.setItem('peopleControlsAssessments', JSON.stringify(savedAssessments));

      toast({
        title: "Assessment Saved",
        description: "Your A.6 People Controls assessment has been saved successfully.",
      });

      // Reset form
      setFormData({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">A.6 People Controls Assessment</h1>
            <p className="text-muted-foreground mt-2">
              Assess people-related information security controls and processes
            </p>
          </div>
          <Button 
            onClick={() => navigate('/people-controls-reports')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            View A.6 People Controls Reports
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const sectionData = initializeFormData(section.id);
          
          return (
            <Card key={section.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-md border-l-4 border-l-primary">
                  <p className="text-foreground">{section.question}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`reqs-met-${section.id}`}>REQS MET *</Label>
                    <Select
                      value={sectionData.reqsMet}
                      onValueChange={(value) => updateFormData(section.id, 'reqsMet', value)}
                    >
                      <SelectTrigger id={`reqs-met-${section.id}`}>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`action-owner-${section.id}`}>Action Owner *</Label>
                    <Input
                      id={`action-owner-${section.id}`}
                      value={sectionData.actionOwner}
                      onChange={(e) => updateFormData(section.id, 'actionOwner', e.target.value)}
                      placeholder="Enter action owner..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`comments-${section.id}`}>Comments *</Label>
                  <Textarea
                    id={`comments-${section.id}`}
                    value={sectionData.comments}
                    onChange={(e) => updateFormData(section.id, 'comments', e.target.value)}
                    placeholder="Enter comments..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`action-needed-${section.id}`}>Action needed to meet REQS *</Label>
                  <Textarea
                    id={`action-needed-${section.id}`}
                    value={sectionData.actionNeeded}
                    onChange={(e) => updateFormData(section.id, 'actionNeeded', e.target.value)}
                    placeholder="Describe actions needed..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Evidence Upload</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id={`evidence-${section.id}`}
                        className="hidden"
                        multiple
                        accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(section.id, e)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => document.getElementById(`evidence-${section.id}`)?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Upload Files
                      </Button>
                    </div>
                    
                    {sectionData.evidence.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Uploaded files:</p>
                        {sectionData.evidence.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm text-foreground">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(section.id, index)}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOCX, XLSX, JPG, PNG
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="flex justify-center pt-6">
          <Button 
            onClick={handleSubmit}
            size="lg"
            className="px-8 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PeopleControls;