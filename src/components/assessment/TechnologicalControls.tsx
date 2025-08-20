import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Upload, Eye } from "lucide-react";

const formSchema = z.object({
  sections: z.array(z.object({
    id: z.string(),
    reqsMet: z.string().min(1, "REQS MET is required"),
    comments: z.string().min(1, "Comments is required"),
    actionNeeded: z.string().min(1, "Action needed is required"),
    actionOwner: z.string().min(1, "Action owner is required"),
    evidence: z.any().optional(),
  }))
});

interface TechnologicalControlsProps {
  onNavigate?: (page: string) => void;
}

const sections = [
  {
    id: "A.8.1",
    title: "User endpoint devices",
    question: "There is a policy setting out how endpoint devices must be protected and all relevant personnel are aware of its contents."
  },
  {
    id: "A.8.2", 
    title: "Privileged access rights",
    question: "Strict controls are in place over who has privileged access rights and they are regularly reviewed."
  },
  {
    id: "A.8.3",
    title: "Information access restriction", 
    question: "Dynamic access management techniques are used where appropriate to protect information."
  },
  {
    id: "A.8.4",
    title: "Access to source code",
    question: "Only authorised people have access to source code and associated assets such as software libraries."
  },
  {
    id: "A.8.5",
    title: "Secure authentication",
    question: "Multi-factor authentication (MFA) is used where possible and appropriate to protect information."
  },
  {
    id: "A.8.6",
    title: "Capacity management", 
    question: "Resource capacity, including ICT, people and facilities, is monitored and planned for so that it remains adequate at all times."
  },
  {
    id: "A.8.7",
    title: "Protection against malware",
    question: "Anti-malware software is installed on all nodes and complementary controls such as application allowlisting are used to reduce the risk."
  },
  {
    id: "A.8.8",
    title: "Management of technical vulnerabilities",
    question: "Information about vulnerabilities is regularly obtained and appropriate actions taken to address them."
  },
  {
    id: "A.8.9",
    title: "Configuration management",
    question: "Standard configurations are used for hardware, software, services and networks to reduce security exposures."
  },
  {
    id: "A.8.10",
    title: "Information deletion",
    question: "Information that is no longer required is deleted in a timely way and in accordance with legal obligations."
  },
  {
    id: "A.8.11",
    title: "Data masking",
    question: "Techniques such as data masking, pseudonymization and anonymization are used to protect PII where appropriate."
  },
  {
    id: "A.8.12", 
    title: "Data leakage prevention",
    question: "Tools and procedures are in place to detect and act upon suspected data extraction by unauthorized people."
  },
  {
    id: "A.8.13",
    title: "Information backup",
    question: "Appropriate backups are taken according to a documented policy and are regularly tested."
  },
  {
    id: "A.8.14",
    title: "Redundancy of information processing facilities",
    question: "Appropriate redundancy is designed into information systems to meet established availability requirements."
  },
  {
    id: "A.8.15",
    title: "Logging",
    question: "Logs are kept and protected that record activities on information systems for analysis and investigation."
  },
  {
    id: "A.8.16",
    title: "Monitoring activities",
    question: "Monitoring tools are used to detect suspicious activity within the organization's systems and networks."
  },
  {
    id: "A.8.17",
    title: "Clock synchronization",
    question: "A central source of time is used for all of the organization's systems and networks."
  },
  {
    id: "A.8.18",
    title: "Use of privileged utility programs",
    question: "Installation and use of utility programs is tightly controlled."
  },
  {
    id: "A.8.19",
    title: "Installation of software on operational systems",
    question: "Procedures are in place to manage the installation, updating and testing of software in the production environment."
  },
  {
    id: "A.8.20",
    title: "Networks security",
    question: "Appropriate controls are in place to secure networks, including virtualized networks."
  },
  {
    id: "A.8.21",
    title: "Security of network services",
    question: "The provision of external network services meets the organization's information security requirements."
  },
  {
    id: "A.8.22",
    title: "Segregation of networks",
    question: "Internal networks are segregated from each other where appropriate."
  },
  {
    id: "A.8.23",
    title: "Web filtering",
    question: "User access to websites is managed according to the organization's defined policy."
  },
  {
    id: "A.8.24",
    title: "Use of cryptography",
    question: "Approved ways to use cryptography are defined and implemented."
  },
  {
    id: "A.8.25",
    title: "Secure development life cycle",
    question: "Software and systems are developed in a secure way according to established rules."
  },
  {
    id: "A.8.26",
    title: "Application security requirements",
    question: "The security of applications is designed and evaluated as part of system development or acquisition."
  },
  {
    id: "A.8.27",
    title: "Secure system architecture and engineering principles",
    question: "A set of principles have been defined for the security of the overall architecture of the organization's systems and services."
  },
  {
    id: "A.8.28",
    title: "Secure coding",
    question: "Bespoke software code is written in a way that maximizes its security and minimizes vulnerabilities."
  },
  {
    id: "A.8.29",
    title: "Security testing in development and acceptance",
    question: "The security of new and changed systems is specifically tested as part of their creation and implementation."
  },
  {
    id: "A.8.30",
    title: "Outsourced development",
    question: "Appropriate control is exercised over the security of software developed by external third parties."
  },
  {
    id: "A.8.31",
    title: "Separation of development, test and production environments",
    question: "The environments involved in the creation and maintenance of software are kept separate with appropriate security implemented on each."
  },
  {
    id: "A.8.32",
    title: "Change management",
    question: "Documented procedures are in place to manage the change process for information systems."
  },
  {
    id: "A.8.33",
    title: "Test information",
    question: "Test data is chosen carefully and with due regard to the protection of sensitive information."
  },
  {
    id: "A.8.34",
    title: "Protection of information systems during audit testing",
    question: "Effective communication occurs between auditors and management to ensure that operational systems are not unduly affected by audit activities."
  }
];

export const TechnologicalControls = ({ onNavigate }: TechnologicalControlsProps) => {
  const [savedData, setSavedData] = useState<any[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sections: sections.map(section => ({
        id: section.id,
        reqsMet: '',
        comments: '',
        actionNeeded: '',
        actionOwner: '',
        evidence: null,
      }))
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const timestamp = new Date().toISOString();
    const record = {
      id: Date.now().toString(),
      timestamp,
      ...values
    };
    
    const existingData = JSON.parse(localStorage.getItem('technologicalControlsData') || '[]');
    const updatedData = [...existingData, record];
    localStorage.setItem('technologicalControlsData', JSON.stringify(updatedData));
    setSavedData(updatedData);
    
    toast.success("A.8 Technological Controls assessment saved successfully!");
    form.reset();
  };

  const handleViewReports = () => {
    if (onNavigate) {
      onNavigate('technological-controls-reports');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">A.8 Technological Controls</h1>
          <p className="text-muted-foreground">
            Assess your organization's technological security controls implementation
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleViewReports}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Reports
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {sections.map((section, index) => (
            <Card key={section.id} className="border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {section.id}
                  </Badge>
                  <span className="text-lg">{section.title}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.question}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name={`sections.${index}.reqsMet`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          REQS MET <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`sections.${index}.actionOwner`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Action Owner <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter action owner" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`sections.${index}.comments`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Comments <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter your comments"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`sections.${index}.actionNeeded`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Action needed to meet REQS <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe actions needed"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`sections.${index}.evidence`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Evidence Upload</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <Input
                            type="file"
                            accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                            className="hidden"
                            id={`evidence-${section.id}`}
                          />
                          <label 
                            htmlFor={`evidence-${section.id}`}
                            className="cursor-pointer text-sm text-muted-foreground hover:text-primary"
                          >
                            Click to upload or drag and drop<br />
                            <span className="text-xs">PDF, DOCX, XLSX, PNG, JPG (max 10MB)</span>
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Clear Form
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <FileText className="h-4 w-4 mr-2" />
              Save Assessment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};