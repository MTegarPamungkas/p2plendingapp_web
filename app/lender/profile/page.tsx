"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LenderDashboardLayout } from "@/components/lender-dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, CreditCard, Shield, User } from "lucide-react";
import { useCallback } from "react";
import { authAPI } from "@/api/apiServices";
import { useAPI } from "@/hooks/useAPI";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <LenderDashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-red-500">
            Please log in to view your profile
          </h1>
          <Button asChild className="mt-4">
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </LenderDashboardLayout>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "JD";
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

  return (
    <LenderDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              View your account information and settings
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Summary Card */}
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
                <Badge variant="secondary">{user.userType}</Badge>
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
                      user.verified != true
                        ? "text-green-600 border-green-200"
                        : "text-orange-600 border-orange-200"
                    }`}
                  >
                    {user.verified != true ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Tabs */}
          <div className="lg:w-2/3">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="bank">Bank Information</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6 pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="full-name"
                          className="text-sm font-medium"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="full-name"
                          value={user.profile.fullName}
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
                          type="email"
                          value={user.email}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={user.phoneNumber}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-sm font-medium">
                          Date of Birth
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          value={user.profile.dateOfBirth}
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
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
                        value={user.profile.idNumber}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={user.profile.address}
                        readOnly
                        className="bg-muted/50"
                      />
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
    </LenderDashboardLayout>
  );
}
