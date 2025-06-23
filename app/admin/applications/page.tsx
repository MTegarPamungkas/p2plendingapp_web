"use client";

import { useCallback, useState } from "react";
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
  CheckCircle,
  Download,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
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
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout";
import { loanAPI } from "@/api/apiServices";
import { useAPI, useMutation, usePublicAPI } from "@/hooks/useAPI";
import { Loan } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const { user } = useAuth();
  console.log(user);

  const getLoans = useCallback(() => loanAPI.getAllLoans(), []);
  const {
    data: loansData,
    loading: loansLoading,
    error: loansError,
    refetch: refetchLoans,
  } = useAPI(getLoans, []);

  const { mutateAsync: approveLoanMutation, loading: approveLoanLoading } =
    useMutation();

  const { mutateAsync: rejectLoanMutation, loading: rejectLoanLoading } =
    useMutation();

  // Fungsi untuk menangani penolakan pinjaman
  const handleRejectLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowRejectDialog(true);
  };

  // Fungsi untuk mengeksekusi penolakan pinjaman
  const rejectLoan = async () => {
    if (!selectedLoan) return;

    try {
      await rejectLoanMutation(() =>
        loanAPI.rejectLoan(selectedLoan.loanId, "Rejected by admin")
      );
      setShowRejectDialog(false);
      refetchLoans();
    } catch (error) {
      console.error("Error rejecting loan:", error);
    }
  };

  // Fungsi untuk mengurutkan data berdasarkan tanggal terbaru
  const sortedLoans = loansData?.data?.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Urutkan dari terbaru ke terlama
  });

  const filteredApplications = sortedLoans?.filter((app) => {
    const matchesSearch =
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.loanId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      app.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleApproveLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    console.log("Approving user:", loan);
    setShowApproveDialog(true);
  };

  const approvedLoan = async () => {
    if (!selectedLoan) return;

    try {
      await approveLoanMutation(() => loanAPI.approveLoan(selectedLoan.loanId));
      setShowApproveDialog(false);
      refetchLoans();
    } catch (error) {
      console.error("Error approving loan:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>Applications Management</div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchLoans()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              Review, approve, or reject loan applications from SMEs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search applications..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select defaultValue="all" onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Credit Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loansLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Loading applications...
                        </TableCell>
                      </TableRow>
                    ) : loansError ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Error loading applications. Please try again.
                        </TableCell>
                      </TableRow>
                    ) : (filteredApplications ?? []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No applications found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      (filteredApplications ?? []).map((application) => (
                        <TableRow key={application.loanId}>
                          <TableCell className="font-medium">
                            {application.loanId}
                          </TableCell>
                          <TableCell>{application.borrowerId}</TableCell>
                          <TableCell>
                            {formatCurrency(application.amount)}
                          </TableCell>
                          <TableCell>{application.purpose}</TableCell>
                          <TableCell>
                            <Badge className="bg-primary/10 text-primary">
                              {application.creditScore}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                application.status === "APPROVED"
                                  ? "bg-green-500/10 text-green-500"
                                  : application.status === "REJECTED"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }
                            >
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{application.createdAt}</TableCell>
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
                                  <Link
                                    href={`/admin/applications/${application.loanId}`}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>

                                {application.status === "PENDING_APPROVAL" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleApproveLoan(application)
                                      }
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                      Approve Application
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRejectLoan(application)
                                      }
                                    >
                                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                      Reject Application
                                    </DropdownMenuItem>
                                  </>
                                )}
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
                  <span className="font-medium">
                    {(filteredApplications ?? []).length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {loansData?.data.length ?? 0}
                  </span>{" "}
                  applications
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

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Loan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this loan application with id
              {selectedLoan?.loanId}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={rejectLoan}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Loan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Approve Loan Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Loan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this loan application with id
              {selectedLoan?.loanId}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={approvedLoan}
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
