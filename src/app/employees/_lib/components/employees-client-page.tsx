"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Employee } from '@/types/employee';
import { Search } from 'lucide-react';

export default function EmployeesClientPage({ employees: initialEmployees }: { employees: Employee[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [workModeFilter, setWorkModeFilter] = useState('all');

  const filteredEmployees = useMemo(() => {
    return initialEmployees.filter(employee => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      
      const matchesSearch = searchTerm
        ? employee.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          employee.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearchTerm))
        : true;

      const matchesAvailability = availabilityFilter !== 'all'
        ? employee.availability === availabilityFilter
        : true;
        
      const matchesWorkMode = workModeFilter !== 'all'
        ? employee.workMode === workModeFilter
        : true;

      return matchesSearch && matchesAvailability && matchesWorkMode;
    });
  }, [initialEmployees, searchTerm, availabilityFilter, workModeFilter]);


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              placeholder="Search by name or skill..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={setAvailabilityFilter} value={availabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availabilities</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="On Project">On Project</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setWorkModeFilter} value={workModeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Work Modes</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
              </SelectContent>
            </Select>
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
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                     <Link href={`/employees/${employee.id}`} className="hover:underline text-primary">
                        {employee.name}
                    </Link>
                  </TableCell>
                  <TableCell>{employee.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employee.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                      {employee.skills.length > 5 && <Badge variant="outline">+{employee.skills.length - 5} more</Badge>}
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
                {filteredEmployees.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                            No employees match your criteria.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
