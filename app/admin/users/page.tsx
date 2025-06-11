"use client";

import { useCallback, useDeferredValue, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Ban,
  CheckCircle,
  CircleX,
  Download,
  Eye,
  Filter,
  Lock,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  UserCheck,
} from "lucide-react";
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAPI, useMutation, usePublicAPI } from "@/hooks/useAPI";
import { userAPI } from "@/api/apiServices";
import { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { UserDetailsDialog } from "@/components/user-details-dialog";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const getUsers = useCallback(
    () => userAPI.getUsers({ page: 1, limit: 10 }),
    []
  );
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = usePublicAPI(getUsers, []);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { mutateAsync: approveUserMutation, loading: approveLoading } =
    useMutation();

  // Filter users based on search term, type filter, and status filter
  const filteredUsers = Array.isArray(usersData?.data)
    ? usersData.data.filter((user) => {
        const matchesSearch =
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
          typeFilter === "all" ||
          user.role.toLowerCase() === typeFilter.toLowerCase();

        const matchesStatus =
          statusFilter === "all" ||
          user.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesType && matchesStatus;
      })
    : [];

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "suspended":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  // Handle approve user
  const handleApproveUser = (user: User) => {
    setSelectedUser(user);
    console.log("Approving user:", user);
    setShowApproveDialog(true);
  };

  const approvedUser = async () => {
    if (!selectedUser) return;

    try {
      // Data sesuai dengan struktur yang diminta backend
      const verificationData = {
        verificationMethod: "KYC",
        documents: [
          // Bisa kosong untuk admin approval, atau isi jika ada dokumen
          // {
          //   type: "admin_approval",
          //   path: "admin/approval",
          //   hash: "admin_verified"
          // }
        ],
      };

      console.log("Approving user:", selectedUser.id);

      await approveUserMutation(() =>
        userAPI.approveUserVerification(selectedUser.id, verificationData)
      );

      refetchUsers();
      setShowApproveDialog(false);
      setSelectedUser(null);

      console.log("User approved successfully");
    } catch (error) {
      console.error("Error approving user:", error);
      // Bisa tambahkan toast notification di sini
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage platform users and their access
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage users, approve new registrations, and control access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select defaultValue="all" onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="lender">Lenders</SelectItem>
                        <SelectItem value="borrower">Borrowers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all" onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={"/placeholder.svg"}
                                  // alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {user.username}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusBadgeClass(
                                user.status.toLowerCase()
                              )}
                            >
                              {user.status.toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.verified ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <CircleX className="h-4 w-4 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleString("id-ID", {
                              dateStyle: "full",
                              timeStyle: "short",
                            })}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              user.lastLogin ?? user.createdAt
                            ).toLocaleString("id-ID", {
                              dateStyle: "full",
                              timeStyle: "short",
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <UserDetailsDialog
                                    user={user}
                                    onApproveUser={handleApproveUser}
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Message
                                </DropdownMenuItem>
                                {user.status.toLowerCase() === "pending" && (
                                  <DropdownMenuItem
                                    onClick={() => handleApproveUser(user)}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                                    Approve User
                                  </DropdownMenuItem>
                                )}
                                {user.status.toLowerCase() === "active" && (
                                  <DropdownMenuItem>
                                    <Ban className="mr-2 h-4 w-4 text-red-500" />
                                    Suspend User
                                  </DropdownMenuItem>
                                )}
                                {user.status.toLowerCase() === "suspended" && (
                                  <DropdownMenuItem>
                                    <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                                    Reactivate User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  {user.verified ? (
                                    <>
                                      <Lock className="mr-2 h-4 w-4" />
                                      Reset Password
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="mr-2 h-4 w-4" />
                                      Verify Identity
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">{filteredUsers.length}</span> of{" "}
                  <span className="font-medium">{usersData?.data.length}</span>{" "}
                  users
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approve User Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {selectedUser?.username}? This
              will grant them full access to the platform as a{" "}
              {selectedUser?.role}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={approvedUser}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}
