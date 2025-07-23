'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Resource } from '@/types/resource';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import EmptyState from '@/components/app/empty-state';
import { Users } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

type ResourcesClientPageProps = {
  resources: Resource[];
  selectedResources: string[];
  onSelectionChange: (selected: string[]) => void;
};

export default function ResourcesClientPage({
  resources,
  selectedResources,
  onSelectionChange,
}: ResourcesClientPageProps) {
  const { user } = useAuth();
  const getAvailabilityBadgeClass = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'text-accent border-accent';
      case 'On Project':
        return 'text-orange-500 border-orange-500';
      default:
        return 'text-foreground';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(resources.map((e) => e.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (resourceId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedResources, resourceId]);
    } else {
      onSelectionChange(selectedResources.filter((id) => id !== resourceId));
    }
  };

  const canAddResource = user?.role === 'Admin' || user?.role === 'Super Admin';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Roster</CardTitle>
      </CardHeader>
      <CardContent>
        {resources.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    checked={
                      resources.length > 0 &&
                      selectedResources.length === resources.length
                    }
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource: Resource) => (
                <TableRow
                  key={resource.id}
                  data-state={
                    selectedResources.includes(resource.id) ? 'selected' : ''
                  }
                >
                  <TableCell>
                    <Checkbox
                      onCheckedChange={(checked) =>
                        handleSelectRow(resource.id, !!checked)
                      }
                      checked={selectedResources.includes(resource.id)}
                      aria-label={`Select ${resource.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?u=${resource.name}`}
                          alt={resource.name}
                        />
                        <AvatarFallback>
                          {resource.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/resources/${resource.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {resource.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{resource.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resource.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {resource.skills.length > 3 && (
                        <Badge variant="outline">
                          +{resource.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getAvailabilityBadgeClass(
                        resource.availability
                      )}
                    >
                      {resource.availability}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            icon={<Users className="h-8 w-8" />}
            title="No Resources Found"
            description="You haven't added any resources to your roster yet. Get started by adding your first team member."
            action={
              canAddResource
                ? { label: 'Add Resource', href: '/resources/new' }
                : undefined
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
