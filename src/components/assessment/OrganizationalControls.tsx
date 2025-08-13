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

const OrganizationalControls: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, FormData>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const sections = [
    {
      id: 'a51',
      title: 'A.5.1 Policies for information security',
      question: 'An appropriate set of information security policies has been approved and communicated, and reviews happen when required.'
    },
    {
      id: 'a52',
      title: 'A.5.2 Information security roles and responsibilities',
      question: 'Everyone knows what their information security roles and responsibilities are.'
    },
    {
      id: 'a53',
      title: 'A.5.3 Segregation of duties',
      question: 'There are no conflicts of duties that could be a risk to the organization.'
    },
    {
      id: 'a54',
      title: 'A.5.4 Management responsibilities',
      question: 'Management makes sure that everyone plays their part in ensuring effective information security.'
    },
    {
      id: 'a55',
      title: 'A.5.5 Contact with authorities',
      question: 'Relevant authorities are known and appropriate ways to keep in contact with them are established.'
    },
    {
      id: 'a56',
      title: 'A.5.6 Contact with special interest groups',
      question: 'Relevant specialist groups are known and appropriate ways to keep in contact with them are established.'
    },
    {
      id: 'a57',
      title: 'A.5.7 Threat intelligence',
      question: 'A process is in place to understand information security threats to the organization.'
    },
    {
      id: 'a58',
      title: 'A.5.8 Information security in project management',
      question: 'Projects take due account of their information security responsibilities.'
    },
    {
      id: 'a59',
      title: 'A.5.9 Inventory of information and other assets',
      question: 'There is an accurate list of information assets and each asset has an owner.'
    },
    {
      id: 'a510',
      title: 'A.5.10 Acceptable use of information and other associated assets',
      question: 'There is a policy on how to use assets appropriately and everyone follows it.'
    },
    {
      id: 'a511',
      title: 'A.5.11 Return of assets',
      question: 'Procedures are in place to ensure that assets are returned when people leave or change jobs.'
    },
    {
      id: 'a512',
      title: 'A.5.12 Classification of information',
      question: 'An information classification scheme is in effect and is being used in all areas within scope.'
    },
    {
      id: 'a513',
      title: 'A.5.13 Labelling of information',
      question: 'Everyone knows how to label information appropriately according to the classification scheme.'
    },
    {
      id: 'a514',
      title: 'A.5.14 Information transfer',
      question: 'Ways in which information must be transferred, both internally and externally, are defined.'
    },
    {
      id: 'a515',
      title: 'A.5.15 Access control',
      question: 'It is clear how access to information and other assets will be managed so that it stays secure.'
    },
    {
      id: 'a516',
      title: 'A.5.16 Identity management',
      question: 'Appropriate methods are used to establish the identity of the person or system making a request.'
    },
    {
      id: 'a517',
      title: 'A.5.17 Authentication information',
      question: 'Passwords and other types of authentication are managed according to a documented process.'
    },
    {
      id: 'a518',
      title: 'A.5.18 Access rights',
      question: 'Access rights to assets are assigned according to a documented policy.'
    },
    {
      id: 'a519',
      title: 'A.5.19 Information security in supplier relationships',
      question: 'The risks involved in dealing with suppliers are managed by the use of appropriate processes and procedures.'
    },
    {
      id: 'a520',
      title: 'A.5.20 Addressing information security within supplier agreements',
      question: 'The ways in which the organization will interface with suppliers from an information security point of view are agreed.'
    },
    {
      id: 'a521',
      title: 'A.5.21 Managing information security in the ICT supply chain',
      question: 'The organization\'s security requirements are passed down the supply chain.'
    },
    {
      id: 'a522',
      title: 'A.5.22 Monitoring, review and change management of supplier services',
      question: 'A close eye is kept on whether suppliers are performing as expected and any changes are evaluated carefully.'
    },
    {
      id: 'a523',
      title: 'A.5.23 Information security for use of cloud services',
      question: 'Purchase, use and management of cloud services are performed according to defined processes.'
    },
    {
      id: 'a524',
      title: 'A.5.24 Information security incident management planning and preparation',
      question: 'There are defined procedures for incident management and everyone involved knows about them.'
    },
    {
      id: 'a525',
      title: 'A.5.25 Assessment and decision on information security events',
      question: 'There is a process to decide whether an event should become an information security incident.'
    },
    {
      id: 'a526',
      title: 'A.5.26 Response to information security incidents',
      question: 'When they happen, incidents are responded to effectively according to the documented procedures.'
    },
    {
      id: 'a527',
      title: 'A.5.27 Learning from information security incidents',
      question: 'Lessons learned from incidents are fed back into the relevant processes and procedures.'
    },
    {
      id: 'a528',
      title: 'A.5.28 Collection of evidence',
      question: 'Incident management procedures include methods of finding and preserving evidence where required.'
    },
    {
      id: 'a529',
      title: 'A.5.29 Information security during disruption',
      question: 'When a disruptive event happens, security is not compromised.'
    },
    {
      id: 'a530',
      title: 'A.5.30 ICT readiness for business continuity',
      question: 'Plans are in place to recover ICT systems in a way that meets the defined objectives of the organization.'
    },
    {
      id: 'a531',
      title: 'A.5.31 Legal, statutory, regulatory and contractual requirements',
      question: 'The relevant requirements are known and are taken into account when implementing information security procedures and controls.'
    },
    {
      id: 'a532',
      title: 'A.5.32 Intellectual property rights',
      question: 'Care is taken to ensure that the IP rights of others are not infringed, and to protect the organization\'s IP.'
    },
    {
      id: 'a533',
      title: 'A.5.33 Protection of records',
      question: 'Processes are in place to protect records throughout their lifecycle.'
    },
    {
      id: 'a534',
      title: 'A.5.34 Privacy and protection of personally identifiable information',
      question: 'Legal requirements for the protection of PII are understood and complied with at all times.'
    },
    {
      id: 'a535',
      title: 'A.5.35 Independent review of information security',
      question: 'The approach to information security is independently reviewed on a regular basis to identify improvements.'
    },
    {
      id: 'a536',
      title: 'A.5.36 Compliance with policies, rules and standards for information security',
      question: 'Management regularly checks that information security rules and controls are correctly followed by everyone.'
    },
    {
      id: 'a537',
      title: 'A.5.37 Documented operating procedures',
      question: 'The correct way to perform information security activities is documented within procedures.'
    }
  ];

  const handleInputChange = (sectionId: string, field: keyof Omit<FormData, 'evidence'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value,
        evidence: prev[sectionId]?.evidence || []
      }
    }));
  };

  const handleFileUpload = (sectionId: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          evidence: [...(prev[sectionId]?.evidence || []), ...fileArray]
        }
      }));
    }
  };

  const removeFile = (sectionId: string, fileIndex: number) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        evidence: prev[sectionId]?.evidence.filter((_, index) => index !== fileIndex) || []
      }
    }));
  };

  const handleSubmit = () => {
    // Validate that at least one section has data
    const hasData = Object.values(formData).some(section => 
      section.reqsMet || section.comments || section.actionNeeded || section.actionOwner || section.evidence.length > 0
    );

    if (!hasData) {
      toast({
        title: "No data to save",
        description: "Please fill in at least one section before saving.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to your backend/database
    console.log('Saving A.5 Organizational Controls data:', formData);
    
    toast({
      title: "Assessment saved successfully",
      description: "Your A.5 Organizational Controls assessment has been saved."
    });
  };

  const getSectionData = (sectionId: string): FormData => {
    return formData[sectionId] || {
      reqsMet: '',
      comments: '',
      actionNeeded: '',
      actionOwner: '',
      evidence: []
    };
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">A.5 Organizational Controls</h1>
          <Button 
            onClick={() => navigate('/organizational-controls-reports')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            View Reports
          </Button>
        </div>
        <p className="text-gray-600">
          Complete the assessment for each organizational control section. Each section requires your evaluation of requirements compliance and any necessary actions.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const data = getSectionData(section.id);
          
          return (
            <Card key={section.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">{section.title}</CardTitle>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-700 font-medium">{section.question}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${section.id}-reqs`}>REQS MET</Label>
                    <Select
                      value={data.reqsMet}
                      onValueChange={(value) => handleInputChange(section.id, 'reqsMet', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${section.id}-owner`}>Action Owner</Label>
                    <Input
                      id={`${section.id}-owner`}
                      value={data.actionOwner}
                      onChange={(e) => handleInputChange(section.id, 'actionOwner', e.target.value)}
                      placeholder="Enter action owner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${section.id}-comments`}>Comments</Label>
                  <Textarea
                    id={`${section.id}-comments`}
                    value={data.comments}
                    onChange={(e) => handleInputChange(section.id, 'comments', e.target.value)}
                    placeholder="Enter your comments"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${section.id}-action`}>Action needed to meet REQS</Label>
                  <Textarea
                    id={`${section.id}-action`}
                    value={data.actionNeeded}
                    onChange={(e) => handleInputChange(section.id, 'actionNeeded', e.target.value)}
                    placeholder="Describe actions needed to meet requirements"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Evidence Upload</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor={`${section.id}-evidence`} className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-500">Upload files</span>
                          <input
                            id={`${section.id}-evidence`}
                            type="file"
                            multiple
                            accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileUpload(section.id, e.target.files)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOCX, XLSX, PNG, JPG up to 10MB each
                      </p>
                    </div>
                    
                    {data.evidence.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Uploaded files:</p>
                        {data.evidence.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-600 truncate">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(section.id, index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Assessment
        </Button>
      </div>
    </div>
  );
};

export default OrganizationalControls;