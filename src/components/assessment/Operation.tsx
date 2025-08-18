import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { FileText, Upload } from 'lucide-react';

interface SectionData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidence: File | null;
}

interface OperationData {
  [key: string]: SectionData;
}

const Operation = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [formData, setFormData] = useState<OperationData>({});

  const sections = [
    {
      id: 'section1',
      title: '8.1 Operational planning and control',
      question: 'Are planned changes controlled and the consequences of unplanned changes mitigated?'
    },
    {
      id: 'section2', 
      title: '8.1 Operational planning and control',
      question: 'Are outsourced processes identified and controlled?'
    },
    {
      id: 'section3',
      title: '8.2 Information security risk assessment',
      question: 'Are documented risk assessments carried out at planned intervals and when significant change happens?'
    },
    {
      id: 'section4',
      title: '8.3 Information security risk treatment', 
      question: 'Is the information security risk treatment plan being implemented and results documented?'
    }
  ];

  const handleInputChange = (sectionId: string, field: keyof Omit<SectionData, 'evidence'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...getSectionData(sectionId),
        [field]: value
      }
    }));
  };

  const handleFileUpload = (sectionId: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...getSectionData(sectionId),
        evidence: file
      }
    }));
  };

  const handleSubmit = () => {
    // Validate that all required fields are filled
    const isValid = sections.every(section => {
      const data = getSectionData(section.id);
      return data.reqsMet && data.comments && data.actionNeeded && data.actionOwner;
    });

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields for each section.",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    const savedAssessments = JSON.parse(localStorage.getItem('operationAssessments') || '[]');
    const newAssessment = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      sections: formData
    };
    
    console.log('Saving new assessment:', newAssessment);
    savedAssessments.push(newAssessment);
    localStorage.setItem('operationAssessments', JSON.stringify(savedAssessments));
    console.log('Total assessments saved:', savedAssessments.length);

    toast({
      title: "Assessment Saved",
      description: "Your 8. Operation assessment has been saved successfully.",
    });

    // Reset form
    setFormData({});
  };

  const getSectionData = (sectionId: string): SectionData => {
    return formData[sectionId] || {
      reqsMet: '',
      comments: '',
      actionNeeded: '',
      actionOwner: '',
      evidence: null
    };
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">8. Operation Assessment</h1>
            <p className="text-gray-600 mt-2">
              Assess operational planning, control, risk assessment, and risk treatment processes
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => onNavigate('operation-reports')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View 8. Operation Reports
            </Button>
            <Button 
              onClick={() => onNavigate('people-controls-reports')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              A.6 People Controls Reports
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={section.id} className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
                <p className="text-gray-700">{section.question}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`reqs-met-${section.id}`}>REQS MET *</Label>
                  <Select
                    value={getSectionData(section.id).reqsMet}
                    onValueChange={(value) => handleInputChange(section.id, 'reqsMet', value)}
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
                    value={getSectionData(section.id).actionOwner}
                    onChange={(e) => handleInputChange(section.id, 'actionOwner', e.target.value)}
                    placeholder="Enter action owner..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`comments-${section.id}`}>Comments *</Label>
                <Input
                  id={`comments-${section.id}`}
                  value={getSectionData(section.id).comments}
                  onChange={(e) => handleInputChange(section.id, 'comments', e.target.value)}
                  placeholder="Enter comments..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`action-needed-${section.id}`}>Action needed to meet REQS *</Label>
                <Textarea
                  id={`action-needed-${section.id}`}
                  value={getSectionData(section.id).actionNeeded}
                  onChange={(e) => handleInputChange(section.id, 'actionNeeded', e.target.value)}
                  placeholder="Describe actions needed..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Evidence Upload</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0] || null;
                        handleFileUpload(section.id, file);
                      };
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4" />
                    Upload File
                  </Button>
                  {getSectionData(section.id).evidence && (
                    <span className="text-sm text-gray-600">
                      {getSectionData(section.id).evidence?.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOCX, XLSX, JPG, PNG
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center pt-6">
          <Button 
            onClick={handleSubmit}
            size="lg"
            className="px-8"
          >
            Save Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Operation;