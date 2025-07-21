'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Briefcase,
  UserPlus,
  FolderPlus,
  BrainCircuit,
} from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { Separator } from '../ui/separator';

const primaryNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, tooltip: 'Dashboard' },
  { href: '/employees', label: 'Employees', icon: Users, tooltip: 'Employees' },
  {
    href: '/projects',
    label: 'Projects',
    icon: Briefcase,
    tooltip: 'Projects',
  },
];

const secondaryNavItems = [
  {
    href: '/employees/new',
    label: 'Add Employee',
    icon: UserPlus,
    tooltip: 'Add New Employee',
  },
  {
    href: '/projects/new',
    label: 'New Project',
    icon: FolderPlus,
    tooltip: 'Create New Project',
  },
];

const toolsNavItems = [
  {
    href: '/analysis',
    label: 'Skill Analysis',
    icon: BrainCircuit,
    tooltip: 'AI Skill Gap Analysis',
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-4">
        <Icons.logo className="h-8 w-8 text-primary-foreground" />
        <h1 className="font-headline text-xl font-bold text-primary-foreground group-data-[collapsible=icon]:hidden">
          ResourceAlloc
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarMenu className="space-y-4 p-2">
          <div>
            <SidebarMenu className="space-y-1">
              {primaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    className="justify-start"
                    tooltip={item.tooltip}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
          <Separator className="bg-sidebar-border" />
          <div>
            <SidebarMenu className="space-y-1">
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="justify-start"
                    tooltip={item.tooltip}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
          <Separator className="bg-sidebar-border" />
          <div>
            <p className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
              AI Tools
            </p>
            <SidebarMenu className="space-y-1">
              {toolsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="justify-start"
                    tooltip={item.tooltip}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </SidebarMenu>
      </div>
    </div>
  );
}
