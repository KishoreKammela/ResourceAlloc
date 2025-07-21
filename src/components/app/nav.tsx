"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Briefcase, UserPlus } from "lucide-react";

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home, tooltip: "Dashboard" },
  { href: "/employees", label: "Employees", icon: Users, tooltip: "Employees" },
  { href: "/employees/new", label: "Add Employee", icon: UserPlus, tooltip: "Add New Employee" },
  { href: "/projects", label: "Projects", icon: Briefcase, tooltip: "Projects" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-2">
        <Icons.logo className="w-8 h-8 text-primary-foreground" />
        <h1 className="text-xl font-headline font-bold text-primary-foreground group-data-[collapsible=icon]:hidden">
          ResourceAlloc
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarMenu className="p-2">
          {navItems.map((item) => (
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
    </div>
  );
}
