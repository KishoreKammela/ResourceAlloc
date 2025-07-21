import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, UserPlus } from "lucide-react";
import Link from "next/link";

const mockEmployees = [
  {
    name: "Alice Johnson",
    title: "Senior Software Engineer",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    availability: "Available",
    workMode: "Remote",
  },
  {
    name: "Bob Williams",
    title: "Project Manager",
    skills: ["Agile", "Scrum", "JIRA", "Budgeting"],
    availability: "On Project",
    workMode: "Hybrid",
  },
  {
    name: "Charlie Brown",
    title: "UI/UX Designer",
    skills: ["Figma", "Sketch", "User Research"],
    availability: "Available",
    workMode: "On-site",
  },
  {
    name: "Diana Prince",
    title: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "CI/CD", "Terraform"],
    availability: "Available",
    workMode: "Remote",
  },
];

export default function EmployeesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">Employees</h1>
        <Button asChild>
          <Link href="/employees/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search by name or skill..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="on-project">On Project</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="on-site">On-site</SelectItem>
              </SelectContent>
            </Select>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Employee Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Work Mode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEmployees.map((employee) => (
                <TableRow key={employee.name}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employee.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.availability === "Available" ? "default" : "outline"} className={employee.availability === "Available" ? "bg-accent text-accent-foreground" : ""}>
                      {employee.availability}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.workMode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
