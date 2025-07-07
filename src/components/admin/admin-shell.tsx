'use client'

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { BookCopy, LogOut, Home, BarChartHorizontal } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '../logo';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/use-auth';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };
  
  const menuItems = [
    {
      href: '/admin/courses',
      label: 'Courses',
      icon: BookCopy,
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: BarChartHorizontal,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex-col !items-start gap-4 p-2">
           <div className="flex items-center gap-3 w-full p-2">
            <Avatar>
              <AvatarImage src={user?.photoURL ?? undefined} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">{user?.displayName || user?.email}</span>
                <span className="text-xs text-muted-foreground">Instructor</span>
            </div>
           </div>
           <SidebarMenu>
             <SidebarMenuItem>
                <Link href="/">
                    <SidebarMenuButton>
                        <Home />
                        <span>Back to Site</span>
                    </SidebarMenuButton>
                </Link>
             </SidebarMenuItem>
             <SidebarMenuItem>
                 <SidebarMenuButton onClick={handleLogout}>
                    <LogOut />
                    <span>Logout</span>
                 </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b px-4 lg:justify-end">
            <SidebarTrigger className="lg:hidden" />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
