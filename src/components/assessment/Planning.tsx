import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SectionData {
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidence: File | null;
}

interface PlanningData {
  [key: string]: SectionData;
}

const Planning = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<PlanningData>({});

  const sections = [
    {
      id: 'section1',
      title: '6.1.1 Actions to address risks and opportunities',
      question: 'Does the plan for the ISMS take into account the relevant issues and requirements?'
    },
    {
      id: 'section2',
      title: '6.1.1 Actions to address risks and opportunities',
      question: 'Are all of the relevant risks and opportunities determined?'
    },
    {
      id: 'section3',
      title: '6.1.1 Actions to address risks and opportunities',
      question: 'Are actions planned to address the identified risks and opportunities?'
    },
    {
      id: 'section4',
      title: '6.1.2 Information security risk assessment',
      question: 'Is a documented information security risk assessment process defined and applied?'
    },
    {
      id: 'section5',
      title: '6.1.2 Information security risk assessment',
      question: 'Have risk owners been identified?'
    },
    {
      id: 'section6',
      title: '6.1.2 Information security risk assessment',
      question: 'Have risks been analyzed, evaluated and prioritized for treatment?'
    },
    {
      id: 'section7',
      title: '6.1.3 Information security risk treatment',
      question: 'Is there a documented information security risk treatment process?'
    },
    {
      id: 'section8',
      title: '6.1.3 Information security risk treatment',
      question: 'Have appropriate risk treatment options been selected for each risk that exceeds the risk acceptance criteria?'
    },
    {
      id: 'section9',
      title: '6.1.3 Information security risk treatment',
      question: 'Have necessary controls been selected for each risk that requires treatment?'
    },
    {
      id: 'section10',
      title: '6.1.3 Information security risk treatment',
      question: 'Has a Statement of Applicability been created?'
    },
    {
      id: 'section11',
      title: '6.1.3 Information security risk treatment',
      question: 'Is there a plan to implement the identified treatments?'
    },
    {
      id: 'section12',
      title: '6.2 Information security objectives and planning to achieve them',
      question: 'Have measurable information security objectives been established and communicated?'
    },
    {
      id: 'section13',
      title: '6.2 Information security objectives and planning to achieve them',
      question: 'Is there a plan to achieve the defined information security objectives?'
    },
    {
      id: 'section14',
      title: '6.3 Planning of changes',
      question: 'Is there a process to cater for the planning of expected and unexpected changes to the ISMS?'
    }
  ];

  const handleInputChange = (sectionId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (sectionId: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        evidence: file
      }
    }));
  };

  const handleSubmit = () => {
    const savedData = localStorage.getItem('planningAssessments') || '[]';
    const existingData = JSON.parse(savedData);
    
    const newAssessment = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      sections: formData
    };
    
    existingData.push(newAssessment);
    localStorage.setItem('planningAssessments', JSON.stringify(existingData));
    
    toast({
      title: "Assessment Saved",
      description: "6. Planning assessment has been saved successfully.",
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
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">6. Planning</h1>
          <p className="text-gray-600 mt-2">Assessment of planning processes for information security management</p>
        </div>
        <Button 
          onClick={() => navigate('/planning-reports')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          View 6. Planning Reports
        </Button>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => {
          const sectionData = getSectionData(section.id);
          
          return (
            <Card key={section.id} className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">{section.title}</CardTitle>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">{section.question}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`reqsMet-${section.id}`}>REQS MET</Label>
                    <Select 
                      value={sectionData.reqsMet} 
                      onValueChange={(value) => handleInputChange(section.id, 'reqsMet', value)}
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
                  
                  <div>
                    <Label htmlFor={`comments-${section.id}`}>Comments</Label>
                    <Input
                      id={`comments-${section.id}`}
                      value={sectionData.comments}
                      onChange={(e) => handleInputChange(section.id, 'comments', e.target.value)}
                      placeholder="Enter comments..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`actionNeeded-${section.id}`}>Action needed to meet REQS</Label>
                  <Textarea
                    id={`actionNeeded-${section.id}`}
                    value={sectionData.actionNeeded}
                    onChange={(e) => handleInputChange(section.id, 'actionNeeded', e.target.value)}
                    placeholder="Describe actions needed..."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor={`actionOwner-${section.id}`}>Action Owner</Label>
                  <Input
                    id={`actionOwner-${section.id}`}
                    value={sectionData.actionOwner}
                    onChange={(e) => handleInputChange(section.id, 'actionOwner', e.target.value)}
                    placeholder="Enter action owner..."
                  />
                </div>

                <div>
                  <Label>Evidence Upload</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="file"
                      accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(section.id, file);
                      }}
                      className="hidden"
                      id={`evidence-${section.id}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById(`evidence-${section.id}`)?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Evidence
                    </Button>
                    {sectionData.evidence && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <FileText className="h-4 w-4" />
                        {sectionData.evidence.name}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSubmit}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          Save Assessment
        </Button>
      </div>
    </div>
  );
};

export default Planning;