import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Briefcase, UserCheck, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const stats = [
  {
    title: "Total Employees",
    value: "102",
    icon: Users,
  },
  {
    title: "Projects In Progress",
    value: "12",
    icon: Briefcase,
  },
  {
    title: "Available for Projects",
    value: "23",
    icon: UserCheck,
  },
];

const skillsData = [
  { name: 'JavaScript', value: 80 },
  { name: 'React', value: 75 },
  { name: 'Node.js', value: 60 },
  { name: 'Python', value: 55 },
  { name: 'AWS', value: 45 },
  { name: 'Figma', value: 30 },
  { name: 'DevOps', value: 25 },
];

const recentProjects = [
  {
    name: "E-commerce Platform Revamp",
    status: "In Progress",
    teamSize: 8,
  },
  {
    name: "Mobile Banking App",
    status: "In Progress",
    teamSize: 12,
  },
  {
    name: "Cloud Infrastructure Migration",
    status: "Planning",
    teamSize: 6,
  },
    {
    name: "AI-Powered Logistics Optimizer",
    status: "Completed",
    teamSize: 5,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Top Skills Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
                <BarChart data={skillsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProjects.map((project) => (
                   <TableRow key={project.name}>
                    <TableCell className="font-medium">{project.name}</TableCell>
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
    </div>
  );
}
