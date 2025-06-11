"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CreditCard,
  FileText,
  Home,
  LogOut,
  Settings,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import ProtectedRoute, { UserRole } from "./protectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface BorrowerDashboardLayoutProps {
  children: React.ReactNode;
}

export function BorrowerDashboardLayout({
  children,
}: BorrowerDashboardLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const { user } = useAuth();

  return (
    <ProtectedRoute
      allowedRoles={[UserRole.Borrower]}
      redirectTo="/borrower/dashboard"
    >
      <SidebarProvider>
        <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
          <Sidebar>
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2 px-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-foreground">
                      P2P
                    </span>
                  </div>
                </div>
                <span className="font-bold">
                  SME<span className="text-primary">Lend</span>
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive("/borrower/dashboard")}
                      >
                        <Link href="/borrower/dashboard">
                          <Home className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          isActive("/borrower/loans") ||
                          pathname?.startsWith("/borrower/loans/")
                        }
                      >
                        <Link href="/borrower/loans">
                          <CreditCard className="h-4 w-4" />
                          <span>Loans</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Account</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive("/borrower/profile")}
                      >
                        <Link href="/borrower/profile">
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive("/borrower/wallet")}
                      >
                        <Link href="/borrower/wallet">
                          <User className="h-4 w-4" />
                          <span>Wallet</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive("/compliance")}
                      >
                        <Link href="/compliance">
                          <Shield className="h-4 w-4" />
                          <span>Compliance</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem> */}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {user?.profile.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">Borrower</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/login">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Log out</span>
                  </Link>
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger />
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
