import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";

const mockProjects = [
  {
    name: "E-commerce Platform Revamp",
    client: "Future Gadget Labs",
    timeline: "Q3 2024 - Q1 2025",
    status: "In Progress",
  },
  {
    name: "Mobile Banking App",
    client: "Global Bank Corp",
    timeline: "Q2 2024 - Q4 2024",
    status: "In Progress",
  },
  {
    name: "AI-Powered Logistics Optimizer",
    client: "ShipItFast Inc.",
    timeline: "Q1 2024 - Q3 2024",
    status: "Completed",
  },
  {
    name: "Cloud Infrastructure Migration",
    client: "Innovate Solutions",
    timeline: "Q4 2024 - Q2 2025",
    status: "Planning",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Projects</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProjects.map((project) => (
                <TableRow key={project.name}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>{project.timeline}</TableCell>
                  <TableCell>
                     <Badge 
                      variant="outline"
                      className={
                        project.status === 'In Progress' ? 'text-blue-600 border-blue-600' : 
                        project.status === 'Completed' ? 'text-green-600 border-green-600' : 
                        'text-gray-600 border-gray-600'
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
