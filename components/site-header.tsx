"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Example: Determine dashboard link based on user role (modify as needed)
  const getDashboardLink = () => {
    if (!user) return "/";
    // Example role-based logic (replace with your actual user roles)
    if (user.role.toLowerCase() === "admin") return "/admin/dashboard";
    if (user.role.toLowerCase() === "borrower") return "/borrower/dashboard";
    if (user.role.toLowerCase() === "lender") return "/lender/dashboard";
    return "/"; // Fallback
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 px-8 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">
                  P2P
                </span>
              </div>
            </div>
            <span className="hidden font-bold sm:inline-block">
              SME<span className="text-primary">Lend</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-2">
            {isAuthenticated ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <div className="container py-4 space-y-4 px-4">
            <div className="space-y-1">
              <div className="font-medium text-sm text-muted-foreground mb-2">
                Menu
              </div>
              <Link href="/about" className="block py-2 text-sm">
                About Us
              </Link>
              <Link href="/faq" className="block py-2 text-sm">
                FAQ
              </Link>
              <Link href="/how-it-works" className="block py-2 text-sm">
                How It Works
              </Link>
              {isAuthenticated && (
                <Link href={getDashboardLink()} className="block py-2 text-sm">
                  Dashboard
                </Link>
              )}
            </div>

            <div className="pt-4 flex gap-2 border-t border-border/40">
              {isAuthenticated ? (
                <Button variant="outline" className="w-full" onClick={logout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Log out
                </Button>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
