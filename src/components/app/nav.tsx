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
  Settings,
  LogOut,
  User,
  Shield,
  Users2,
} from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const primaryNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, tooltip: 'Dashboard' },
  { href: '/employees', label: 'Employees', icon: Users, tooltip: 'Employees' },
  {
    href: '/projects',
    label: 'Projects',
    icon: Briefcase,
    tooltip: 'Projects',
  },
  {
    href: '/team',
    label: 'Team',
    icon: Users2,
    tooltip: 'Team Management',
    adminOnly: true,
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

const settingsNavItem = {
  href: '/settings',
  label: 'Settings',
  icon: Settings,
  tooltip: 'Settings',
};

function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        <div className="group/menu-item flex w-full items-center gap-2 rounded-md p-2 text-left text-sm text-sidebar-foreground outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.avatarUrl} alt="User Avatar" />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start truncate group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">{user.name}</span>
            <span className="text-xs text-muted-foreground group-hover:text-sidebar-accent-foreground">
              {user.email}
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="right">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div className="flex items-center">
            <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground">
              Role: {user?.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isUserAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';

  const visiblePrimaryNavItems = primaryNavItems.filter(
    (item) => !item.adminOnly || isUserAdmin
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pt-2">
        <SidebarMenu className="space-y-4 p-2">
          <div>
            <SidebarMenu className="space-y-1">
              {visiblePrimaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname.startsWith(item.href) &&
                      (item.href !== '/dashboard' || pathname === '/dashboard')
                    }
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
              Quick Actions
            </p>
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

      <div className="mt-auto border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(settingsNavItem.href)}
              className="justify-start"
              tooltip={settingsNavItem.tooltip}
            >
              <Link href={settingsNavItem.href}>
                <settingsNavItem.icon className="h-5 w-5" />
                <span>{settingsNavItem.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
}
