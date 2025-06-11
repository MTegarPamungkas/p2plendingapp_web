"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, DollarSign, RefreshCw, Wallet } from "lucide-react";
import { BorrowerDashboardLayout } from "@/components/borrower-dashboard-layout";
import { useCallback } from "react";
import { loanAPI } from "@/api/apiServices";
import { useAPI } from "@/hooks/useAPI";

export type BorrowerSummaryResponse = {
  success: boolean;
  data: {
    borrowerId: string;
    totalBorrowed: number;
    totalPaid: number;
    totalOutstanding: number;
    activeLoans: number;
    completedLoans: number;
    rejectedLoans: number;
    creditScore: number | null;
    loanSummaries: {
      loanId: string;
      amount: number;
      status: string; // e.g., "active", "completed", "rejected"
      paid: number;
      outstanding: number;
      interestRate: number;
      term: number;
    }[];
  };
};

export default function BorrowerDashboardPage() {
  const getSummary = useCallback(() => loanAPI.getUserSummary(), []);
  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useAPI<BorrowerSummaryResponse>(getSummary, []);

  const dashboardData = summaryData?.data;

  // Calculate outstanding percentage
  const outstandingPercentage = dashboardData?.totalBorrowed
    ? (
        (dashboardData?.totalOutstanding / dashboardData?.totalBorrowed) *
        100
      ).toFixed(0)
    : 0;

  // Derive loan counts from loanSummaries
  const activeLoans = dashboardData?.loanSummaries.filter(
    (loan) => loan.status === "active"
  );
  const pendingApprovalLoans = dashboardData?.loanSummaries.filter(
    (loan) => loan.status === "pending_approval"
  );

  // Determine active tab
  const activeTab =
    (pendingApprovalLoans?.length ?? 0) > 0 ? "pending-approval" : "active";
  const tabLabel =
    (pendingApprovalLoans?.length ?? 0) > 0
      ? "Pending Approval"
      : "Active Loans";

  // Check if new loan application is allowed
  const hasRestrictingLoan =
    (activeLoans?.length ?? 0) > 0 || (pendingApprovalLoans?.length ?? 0) > 0;

  return (
    <BorrowerDashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Borrower Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {dashboardData?.borrowerId}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={refetchSummary}
              disabled={summaryLoading}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            {!hasRestrictingLoan && (
              <Button asChild>
                <Link href="/borrower/apply">Apply for a New Loan</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Borrowed
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                Rp {dashboardData?.totalBorrowed.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                Across{" "}
                {(dashboardData?.activeLoans ?? 0) +
                  (dashboardData?.completedLoans ?? 0) +
                  (dashboardData?.rejectedLoans ?? 0)}{" "}
                loans
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Outstanding Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                Rp {dashboardData?.totalOutstanding.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                {outstandingPercentage}% of total borrowed
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Credit Score
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {dashboardData?.creditScore !== null ? (
                <>
                  <div className="text-xl md:text-2xl font-bold">
                    {dashboardData?.creditScore}/850
                  </div>
                  <Progress
                    value={((dashboardData?.creditScore ?? 0) / 850) * 100}
                    className="mt-4 h-2"
                  />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No credit score available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue={activeTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 max-w-md">
            <TabsTrigger value={activeTab}>{tabLabel}</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeTab === "pending-approval" &&
              (pendingApprovalLoans?.length ?? 0) > 0 ? (
                pendingApprovalLoans?.map((loan) => (
                  <Card
                    key={loan.loanId}
                    className="shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Pending Loan</CardTitle>
                        <Badge variant="secondary">PENDING_APPROVAL</Badge>
                      </div>
                      <CardDescription>
                        Loan #{loan.loanId.slice(0, 8)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-medium">
                            Rp {loan.amount.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Interest Rate
                          </span>
                          <span className="font-medium">
                            {(loan.interestRate * 100).toFixed(1)}% p.a.
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Term</span>
                          <span className="font-medium">
                            {loan.term} months
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" disabled>
                        Awaiting Approval
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (activeLoans ?? []).length > 0 ? (
                (activeLoans ?? []).map((loan) => (
                  <Card
                    key={loan.loanId}
                    className="shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Active Loan</CardTitle>
                        <Badge variant="default">
                          {loan.status.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription>
                        Loan #{loan.loanId.slice(0, 8)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Principal
                          </span>
                          <span className="font-medium">
                            Rp {loan.amount.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Interest Rate
                          </span>
                          <span className="font-medium">
                            {(loan.interestRate * 100).toFixed(1)}% p.a.
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Term</span>
                          <span className="font-medium">
                            {loan.term} months
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Remaining
                          </span>
                          <span className="font-medium">
                            Rp {loan.outstanding.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Repayment Progress</span>
                          <span className="font-medium">
                            {((loan.paid / loan.amount) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={(loan.paid / loan.amount) * 100}
                          className="h-2"
                        />
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
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center">
                  No {tabLabel.toLowerCase()} at the moment.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BorrowerDashboardLayout>
  );
}
