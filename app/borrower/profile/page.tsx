"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Building,
  Camera,
  Check,
  CreditCard,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { BorrowerDashboardLayout } from "@/components/borrower-dashboard-layout";
import { authAPI } from "@/api/apiServices";
import { useAPI } from "@/hooks/useAPI";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";

// Define the expected structure of the user object
interface User {
  profile?: {
    fullName?: string;
    profilePicture?: string;
    address?: string;
    idNumber?: string;
  };
  email?: string;
  phoneNumber?: string;
  businessProfile?: {
    businessName?: string;
    businessType?: string;
    businessDuration?: number;
    createdAt?: string | number | Date;
  };
  bankAccounts?: Array<{
    bankName: string;
    accountNumber: string;
    isPrimary: boolean;
  }>;
}

export default function BorrowerProfilePage() {
  const { user } = useAuth();

  // If user is null, show a fallback UI
  if (!user) {
    return (
      <BorrowerDashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-red-500">
            Please log in to view your profile
          </h1>
          <Button asChild className="mt-4">
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </BorrowerDashboardLayout>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "B";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatBusinessType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      trade: "Trading & Commerce",
      manufacturing: "Manufacturing",
      service: "Service Industry",
      agriculture: "Agriculture",
      technology: "Technology",
      retail: "Retail",
    };
    return (
      typeMap[type] ||
      (type ? type.charAt(0).toUpperCase() + type.slice(1) : "")
    );
  };

  return (
    <BorrowerDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">
              View your account and business profile
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="lg:w-1/3">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal information and account status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={
                      user.profile.profilePicture ||
                      "/placeholder.svg?height=96&width=96"
                    }
                    alt="Profile"
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.profile.fullName)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-sm"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
              </div>

              <h3 className="text-xl font-bold mb-1">
                {user.profile.fullName}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{user.email}</p>

              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">{user.role}</Badge>
              </div>

              <Separator className="my-4" />

              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Member since</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatDate(user.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Primary Bank</span>
                  </div>
                  <span className="text-sm font-medium">
                    {user.bankAccounts[0]?.bankName} •••
                    {user.bankAccounts[0]?.accountNumber.slice(-4)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">KYC Status</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      user.verified ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {user.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 lg:w-2/3">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="business">Business Information</TabsTrigger>
                <TabsTrigger value="bank">Bank Information</TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Business Information</CardTitle>
                      <CardDescription>
                        Your business details and information
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="business-name"
                          className="text-sm font-medium"
                        >
                          Business Name
                        </Label>
                        <Input
                          id="business-name"
                          value={user.businessProfile?.businessName || ""}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="business-type"
                          className="text-sm font-medium"
                        >
                          Business Type
                        </Label>
                        <Input
                          id="business-type"
                          value={formatBusinessType(
                            user.businessProfile?.businessType || ""
                          )}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="duration"
                          className="text-sm font-medium"
                        >
                          Business Duration
                        </Label>
                        <Input
                          id="duration"
                          value={`${
                            user.businessProfile?.businessDuration || 0
                          } years`}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="established"
                          className="text-sm font-medium"
                        >
                          Established
                        </Label>
                        <Input
                          id="established"
                          value={formatDate(
                            user.businessProfile?.createdAt || new Date()
                          )}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Business Address
                      </Label>
                      <Input
                        id="address"
                        value={user.profile?.address || ""}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Your contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="contact-name"
                          className="text-sm font-medium"
                        >
                          Contact Name
                        </Label>
                        <Input
                          id="contact-name"
                          value={user.profile?.fullName || ""}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          value={user.email || ""}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={user.phoneNumber || ""}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="id-number"
                          className="text-sm font-medium"
                        >
                          ID Number
                        </Label>
                        <Input
                          id="id-number"
                          value={user.profile?.idNumber || ""}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="bank" className="space-y-6 pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bank Account Information</CardTitle>
                    <CardDescription>
                      Your registered bank account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {user.bankAccounts.map((account, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg bg-muted/20"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Bank Name
                            </Label>
                            <Input
                              value={account.bankName}
                              readOnly
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Account Number
                            </Label>
                            <Input
                              value={account.accountNumber}
                              readOnly
                              className="bg-background"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`primary-${index}`}
                            checked={account.isPrimary}
                            disabled
                          />
                          <Label
                            htmlFor={`primary-${index}`}
                            className="text-sm"
                          >
                            Primary Account
                          </Label>
                          {account.isPrimary && (
                            <Badge variant="secondary" className="ml-2">
                              Primary
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </BorrowerDashboardLayout>
  );
}
