
'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
       toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: "Logout Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        {/* Placeholder for Breadcrumbs or title */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="User Avatar" />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Account</p>
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
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
