"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Calendar, CreditCard, Filter, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BorrowerDashboardLayout } from "@/components/borrower-dashboard-layout";
import { cn } from "@/lib/utils";
import { loanAPI } from "@/api/apiServices";
import { useAPI } from "@/hooks/useAPI";

// Define loan status types
type LoanStatus =
  | "ACTIVE"
  | "FUNDING"
  | "PENDING_APPROVAL"
  | "COMPLETED"
  | "REJECTED"
  | "LATE"
  | "APPROVED";

// Define the status priority with the correct type
const statusPriority: { [key in LoanStatus]: number } = {
  ACTIVE: 1,
  FUNDING: 1,
  PENDING_APPROVAL: 2,
  COMPLETED: 3,
  REJECTED: 4,
  LATE: 5,
  APPROVED: 1,
};

export default function BorrowerLoansPage() {
  const getLoans = useCallback(() => loanAPI.getAllLoansByUser(), []);
  const {
    data: loansData,
    loading: loansLoading,
    error: loansError,
    refetch: refetchLoans,
  } = useAPI(getLoans, []);

  // State to track the selected status filter
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Sort loans based on status priority
  const sortedLoans = loansData?.data
    ? [...loansData.data].sort((a, b) => {
        const priorityA = statusPriority[a.status as LoanStatus] || 999; // Type assertion and fallback
        const priorityB = statusPriority[b.status as LoanStatus] || 999;
        return priorityA - priorityB; // Ascending order (lower priority number comes first)
      })
    : [];

  // Filter loans based on selected status
  const filteredLoans = sortedLoans.filter((loan) => {
    if (selectedStatus === "all") return true; // Show all loans if "all" is selected
    // Treat "APPROVED" as "ACTIVE" for filtering purposes
    if (selectedStatus === "ACTIVE") {
      return loan.status === "ACTIVE" || loan.status === "APPROVED";
    }
    return loan.status === selectedStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: `IDR`,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <BorrowerDashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Loans</h1>
            <p className="text-muted-foreground">
              Manage and track all your loans
            </p>
          </div>
          {/* <Button asChild>
            <Link href="/borrower/apply">Apply for a New Loan</Link>
          </Button> */}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search loans..."
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select
              defaultValue="all"
              onValueChange={(value) => setSelectedStatus(value)} // Update state on selection change
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="FUNDING">Funding</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
                <SelectItem value="LATE">Late</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loan Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLoans.map((loan) => {
            const progress =
              loan.fundingTarget === 0
                ? 0
                : Math.min(
                    100,
                    Math.round((loan.currentFunding / loan.fundingTarget) * 100)
                  );

            const getBadgeClass = (status: string) => {
              switch (status) {
                case "APPROVED":
                case "ACTIVE":
                  return "bg-green-100 text-green-800 hover:bg-green-100";
                case "PENDING_APPROVAL":
                  return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
                case "COMPLETED":
                  return "bg-blue-100 text-blue-800 hover:bg-blue-100";
                case "LATE":
                case "REJECTED":
                  return "bg-red-100 text-red-800 hover:bg-red-100";
                default:
                  return "bg-gray-100 text-gray-800 hover:bg-gray-100";
              }
            };

            return (
              <Card key={loan.loanId}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{loan.purpose}</CardTitle>
                    <Badge
                      className={cn("text-center", getBadgeClass(loan.status))}
                    >
                      {loan.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <CardDescription>
                    Loan #
                    {`${loan.loanId.slice(0, 4)}...${loan.loanId.slice(
                      -4
                    )}`.toUpperCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Principal</span>
                      <span className="font-medium">
                        {` ${formatCurrency(loan.amount)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Interest Rate
                      </span>
                      <span className="font-medium">
                        {(loan.interestRate * 100).toFixed(1)}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Term</span>
                      <span className="font-medium">{loan.term} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-medium">
                        {` ${formatCurrency(
                          loan.fundingTarget - loan.currentFunding
                        )}`}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Funding Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="rounded-md bg-muted/30 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {progress === 100 ? (
                        <>
                          <CreditCard className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Loan fully funded</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm">Next payment info</span>
                        </>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">—</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/borrower/loans/${loan.loanId}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
          {filteredLoans.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center">
              No loans found for the selected status.
            </p>
          )}
        </div>

        {/* Pagination (optional, static now) */}
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" disabled>
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled
            >
              ...
            </Button>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </BorrowerDashboardLayout>
  );
}
