import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhysicalControlsData {
  section: string;
  reqsMet: string;
  comments: string;
  actionNeeded: string;
  actionOwner: string;
  evidence: File | null;
}

interface PhysicalControlsProps {
  onNavigate?: (page: string) => void;
}

const sections = [
  {
    id: 'A.7.1',
    title: 'Physical security perimeters',
    question: 'Perimeters are defined and appropriately secured.'
  },
  {
    id: 'A.7.2',
    title: 'Physical entry',
    question: 'Unauthorised access to secure areas is prevented.'
  },
  {
    id: 'A.7.3',
    title: 'Securing offices, rooms and facilities',
    question: 'Office locations and layouts are designed with information security in mind.'
  },
  {
    id: 'A.7.4',
    title: 'Physical security monitoring',
    question: 'Appropriate physical security monitoring is in place at all locations.'
  },
  {
    id: 'A.7.5',
    title: 'Protecting against physical and environmental threats',
    question: 'The risks from physical and environmental threats are managed appropriately.'
  },
  {
    id: 'A.7.6',
    title: 'Working in secure areas',
    question: 'Specific rules covering secure areas, such as datacentres, are defined and implemented.'
  },
  {
    id: 'A.7.7',
    title: 'Clear desk and clear screen',
    question: 'Devices and sensitive paper documents are protected from prying eyes.'
  },
  {
    id: 'A.7.8',
    title: 'Equipment siting and protection',
    question: 'Equipment is sited and positioned so that it is appropriately protected from unauthorised access or damage.'
  },
  {
    id: 'A.7.9',
    title: 'Security of assets off-premises',
    question: 'Devices used away from the organization\'s premises are appropriately protected.'
  },
  {
    id: 'A.7.10',
    title: 'Storage media',
    question: 'Storage media are managed throughout their lifecycle and appropriately protected, for example using encryption.'
  },
  {
    id: 'A.7.11',
    title: 'Supporting utilities',
    question: 'The risk of failure of utilities has been assessed, and appropriate action taken to protect information processing facilities.'
  },
  {
    id: 'A.7.12',
    title: 'Cabling security',
    question: 'The risks to physical cables have been assessed and appropriate protection put in place.'
  },
  {
    id: 'A.7.13',
    title: 'Equipment maintenance',
    question: 'Equipment such as UPS, alarm systems, air conditioning and fire systems are maintained correctly.'
  },
  {
    id: 'A.7.14',
    title: 'Secure disposal or re-use of equipment',
    question: 'There is a procedure in place to ensure that storage media are wiped and software licenses reclaimed when devices are disposed of.'
  }
];

const PhysicalControls: React.FC<PhysicalControlsProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, PhysicalControlsData>>({});

  const handleInputChange = (sectionId: string, field: keyof PhysicalControlsData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        section: sectionId,
        [field]: value
      }
    }));
  };

  const handleFileUpload = (sectionId: string, file: File | null) => {
    handleInputChange(sectionId, 'evidence', file);
  };

  const handleSave = () => {
    const existingData = localStorage.getItem('physicalControlsData');
    const allData = existingData ? JSON.parse(existingData) : {};
    
    // Convert File objects to file info for storage
    const dataToSave = Object.keys(formData).reduce((acc, key) => {
      const section = formData[key];
      acc[key] = {
        ...section,
        evidence: section.evidence ? {
          name: section.evidence.name,
          size: section.evidence.size,
          type: section.evidence.type,
          lastModified: section.evidence.lastModified
        } : null
      };
      return acc;
    }, {} as Record<string, any>);

    const updatedData = { ...allData, ...dataToSave };
    localStorage.setItem('physicalControlsData', JSON.stringify(updatedData));
    
    toast({
      title: "Success",
      description: "Physical Controls assessment data saved successfully.",
    });
  };

  const handleViewReports = () => {
    if (onNavigate) {
      onNavigate('physical-controls-reports');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">A.7 Physical Controls</h1>
          <p className="text-muted-foreground mt-2">Assessment of physical and environmental security controls</p>
        </div>
        <Button onClick={handleViewReports} variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          View Reports
        </Button>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="border-border">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">{section.id} {section.title}</CardTitle>
              <p className="text-muted-foreground">{section.question}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${section.id}-reqs`}>REQS MET</Label>
                  <Select 
                    value={formData[section.id]?.reqsMet || ''} 
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

                <div className="space-y-2">
                  <Label htmlFor={`${section.id}-owner`}>Action Owner</Label>
                  <Input
                    id={`${section.id}-owner`}
                    value={formData[section.id]?.actionOwner || ''}
                    onChange={(e) => handleInputChange(section.id, 'actionOwner', e.target.value)}
                    placeholder="Enter action owner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${section.id}-comments`}>Comments</Label>
                <Textarea
                  id={`${section.id}-comments`}
                  value={formData[section.id]?.comments || ''}
                  onChange={(e) => handleInputChange(section.id, 'comments', e.target.value)}
                  placeholder="Enter your comments"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${section.id}-action`}>Action needed to meet REQS</Label>
                <Textarea
                  id={`${section.id}-action`}
                  value={formData[section.id]?.actionNeeded || ''}
                  onChange={(e) => handleInputChange(section.id, 'actionNeeded', e.target.value)}
                  placeholder="Describe actions needed"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${section.id}-evidence`}>Evidence</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`${section.id}-evidence`}
                    type="file"
                    accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload(section.id, e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                {formData[section.id]?.evidence && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{formData[section.id].evidence.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Assessment
        </Button>
      </div>
    </div>
  );
};

export default PhysicalControls;