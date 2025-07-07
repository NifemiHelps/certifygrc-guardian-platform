
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Plus, Edit, Download } from "lucide-react";

export const CompanyDetails = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Details</h1>
          <p className="text-gray-600 mt-1">Organization registration and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export Data
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            New Organization
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building size={20} />
                Organization Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" placeholder="Enter organization name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskOwner">Risk Owner</Label>
                  <Input id="riskOwner" placeholder="Select risk owner" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetGroup">Asset Group</Label>
                  <Input id="assetGroup" placeholder="Select asset group" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset">Asset</Label>
                  <Input id="asset" placeholder="Select asset" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Organization description" rows={3} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" placeholder="Enter industry type" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Organization Size</Label>
                  <Input id="size" placeholder="Number of employees" />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>Save Organization</Button>
                <Button variant="outline">Reset Form</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "TechCorp Inc.", owner: "John Smith", assets: 12 },
                  { name: "SecureBank Ltd.", owner: "Sarah Johnson", assets: 25 },
                  { name: "DataFlow Systems", owner: "Mike Davis", assets: 8 }
                ].map((org, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{org.name}</h4>
                        <p className="text-sm text-gray-500">{org.owner}</p>
                        <p className="text-xs text-gray-400">{org.assets} assets</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Edit size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Organizations</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Risk Owners</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Assets</span>
                  <span className="font-semibold">342</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Compliance Rate</span>
                  <span className="font-semibold text-green-600">87%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
