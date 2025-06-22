"use client";

import Link from "next/link";
import { useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowRight,
  Clock,
  DollarSign,
  RefreshCw,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { BorrowerDashboardLayout } from "@/components/borrower-dashboard-layout";
import { loanAPI } from "@/api/apiServices";
import { useAPI } from "@/hooks/useAPI";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type BorrowerSummaryResponse = {
  success: boolean;
  message: string;
  data: {
    borrowerId: string;
    totalBorrowed: number;
    totalPaid: number;
    totalOutstanding: number;
    totalInterestPaid: number;
    totalPlatformFees: number;
    activeLoans: number;
    completedLoans: number;
    rejectedLoans: number;
    creditScore: number | null;
    creditScoreSummary: {
      score: number;
      calculatedAt: string;
      paymentHistoryScore: number;
      amountsOwedScore: number;
      creditHistoryScore: number;
      creditMixScore: number;
      newCreditScore: number;
    } | null;
    creditScoreTrend: {
      score: number;
      calculatedAt: string;
    }[];
    walletBalance: number;
    identityStatus: {
      isVerified: boolean;
      kycStatus: string;
      verifiedAt: string | null;
    } | null;
    documentStatus: {
      totalDocuments: number;
      types: string[];
    };
    loanSummaries: {
      loanId: string;
      amount: number;
      status: string;
      paid: number;
      outstanding: number;
      interestPaid: number;
      interestRate: number;
      term: number;
      purpose: string;
      createdAt: string;
      approvedAt: string | null;
      fundedAt: string | null;
      completedAt: string | null;
      rejectionReason: string | null;
      repaymentProgress: number;
      paymentStatusCounts: {
        onTime: number;
        late1to7: number;
        lateOver7: number;
        pending: number;
      };
      nextDuePayment: {
        installmentNumber: number;
        dueDate: string;
        amount: number;
        principal: number;
        interest: number;
      } | null;
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

  // Format currency
  const formatCurrency = (amount: number) =>
    `Rp ${amount.toLocaleString("id-ID", { minimumFractionDigits: 2 })}`;

  // Calculate outstanding percentage
  const outstandingPercentage = dashboardData?.totalBorrowed
    ? Math.min(
        (dashboardData.totalOutstanding / dashboardData.totalBorrowed) * 100,
        100
      ).toFixed(0)
    : 0;

  // Loan filters
  const loanSummaries = dashboardData?.loanSummaries || [];
  const activeLoans = loanSummaries.filter(
    (loan) =>
      loan.status.toLowerCase() === "active" ||
      loan.status.toLowerCase() === "funded" ||
      loan.status.toLowerCase() === "approved"
  );
  const pendingApprovalLoans = loanSummaries.filter(
    (loan) => loan.status.toLowerCase() === "pending_approval"
  );
  const completedLoans = loanSummaries.filter(
    (loan) => loan.status.toLowerCase() === "completed"
  );
  const rejectedLoans = loanSummaries.filter(
    (loan) => loan.status.toLowerCase() === "rejected"
  );

  // New loan restriction
  const hasRestrictingLoan =
    activeLoans.length > 0 || pendingApprovalLoans.length > 0;
  const nextDuePayment = activeLoans
    .flatMap((loan) => (loan.nextDuePayment ? [loan.nextDuePayment] : []))
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )[0];

  return (
    <BorrowerDashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Loading State */}
        {summaryLoading && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle>Loading</AlertTitle>
            <AlertDescription>Fetching your dashboard data...</AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {summaryError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load dashboard: {summaryError}.{" "}
              <Button
                variant="link"
                onClick={refetchSummary}
                className="p-0 h-auto"
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        {dashboardData && (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={dashboardData.identityStatus?.kycStatus || ""}
                  />
                  <AvatarFallback>
                    {dashboardData.borrowerId[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Borrower Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Welcome back, {dashboardData.borrowerId}
                  </p>
                </div>
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
                {hasRestrictingLoan ? (
                  <Button
                    disabled
                    title="Cannot apply due to active or pending loans"
                  >
                    Apply for a New Loan
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/borrower/apply">Apply for a New Loan</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Borrowed
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">
                    {formatCurrency(dashboardData.totalBorrowed)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across {loanSummaries.length} loans
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
                    {formatCurrency(dashboardData.totalOutstanding)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {outstandingPercentage}% of total borrowed
                  </p>
                  <Progress
                    value={Number(outstandingPercentage)}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Wallet Balance
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">
                    {formatCurrency(dashboardData.walletBalance)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available for payments
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
                  {dashboardData.creditScore !== null ? (
                    <>
                      <div className="text-xl md:text-2xl font-bold">
                        {dashboardData.creditScore}/850
                      </div>
                      <Progress
                        value={(dashboardData.creditScore / 850) * 100}
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

            {/* Next Due Payment Alert */}
            {nextDuePayment && (
              <Alert className=" border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle>Upcoming Payment</AlertTitle>
                <AlertDescription>
                  Your next payment of {formatCurrency(nextDuePayment.amount)}{" "}
                  is due on{" "}
                  {new Date(nextDuePayment.dueDate).toLocaleDateString("id-ID")}
                  .{" "}
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link
                      href={`/borrower/loans/${
                        // Ambil loanId dari loanSummaries yang aktif
                        dashboardData.loanSummaries.find(
                          (loan) => loan.status.toLowerCase() === "active"
                        )?.loanId ?? ""
                      }`}
                    >
                      Make Payment
                    </Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Credit Score Trend Chart */}
            {dashboardData.creditScoreTrend.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Credit Score Trend</CardTitle>
                  <CardDescription>Your credit score over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dashboardData.creditScoreTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="calculatedAt"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("id-ID", {
                            month: "short",
                            year: "2-digit",
                          })
                        }
                      />
                      <YAxis domain={[300, 850]} />
                      <Tooltip
                        formatter={(value) => [`${value}/850`, "Score"]}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString("id-ID")
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#4F46E5"
                        fill="rgba(79, 70, 229, 0.2)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Tabs Section */}
            <Tabs defaultValue="active" className="space-y-4">
              <TabsList className="grid w-full max-w-lg grid-cols-4">
                <TabsTrigger value="active">
                  Active ({activeLoans.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingApprovalLoans.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedLoans.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedLoans.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4">
                {activeLoans.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeLoans.map((loan) => (
                      <Card
                        key={loan.loanId}
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              Active Loan
                            </CardTitle>
                            <Badge variant="default">
                              {loan.status.toUpperCase()}
                            </Badge>
                          </div>
                          <CardDescription>
                            Loan #{loan.loanId.slice(0, 8)} • {loan.purpose}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Principal
                              </span>
                              <span className="font-medium">
                                {formatCurrency(loan.amount)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Interest Paid
                              </span>
                              <span className="font-medium">
                                {formatCurrency(loan.interestPaid)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Remaining
                              </span>
                              <span className="font-medium">
                                {formatCurrency(loan.outstanding)}
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
                              <span className="text-muted-foreground">
                                Term
                              </span>
                              <span className="font-medium">
                                {loan.term} months
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Repayment Progress</span>
                              <span className="font-medium">
                                {loan.repaymentProgress.toFixed(0)}%
                              </span>
                            </div>
                            <Progress
                              value={loan.repaymentProgress}
                              className="h-2"
                            />
                          </div>
                          {loan.paymentStatusCounts && (
                            <div className="text-xs text-muted-foreground">
                              Payments: {loan.paymentStatusCounts.onTime}{" "}
                              on-time, {loan.paymentStatusCounts.late1to7} late
                              (1-7 days), {loan.paymentStatusCounts.lateOver7}{" "}
                              late ({">"}7 days)
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button variant="outline" asChild className="flex-1">
                            <Link href={`/borrower/loans/${loan.loanId}`}>
                              View Details{" "}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          {/* {loan.nextDuePayment && (
                            <Button asChild className="flex-1">
                              <Link href="/borrower/payments">
                                Make Payment
                              </Link>
                            </Button>
                          )} */}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">
                    No active loans at the moment.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                {pendingApprovalLoans.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pendingApprovalLoans.map((loan) => (
                      <Card
                        key={loan.loanId}
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              Pending Loan
                            </CardTitle>
                            <Badge variant="secondary">PENDING_APPROVAL</Badge>
                          </div>
                          <CardDescription>
                            Loan #{loan.loanId.slice(0, 8)} • {loan.purpose}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Amount
                              </span>
                              <span className="font-medium">
                                {formatCurrency(loan.amount)}
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
                              <span className="text-muted-foreground">
                                Term
                              </span>
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
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">
                    No pending loans at the moment.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {completedLoans.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {completedLoans.map((loan) => (
                      <Card
                        key={loan.loanId}
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              Completed Loan
                            </CardTitle>
                            <Badge variant="outline">COMPLETED</Badge>
                          </div>
                          <CardDescription>
                            Loan #{loan.loanId.slice(0, 8)} • {loan.purpose}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Amount
                              </span>
                              <span className="font-medium">
                                {formatCurrency(loan.amount)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Interest Paid
                              </span>
                              <span className="font-medium">
                                {formatCurrency(loan.interestPaid)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Completed
                              </span>
                              <span className="font-medium">
                                {new Date(loan.completedAt!).toLocaleDateString(
                                  "id-ID"
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" asChild className="w-full">
                            <Link href={`/borrower/loans/${loan.loanId}`}>
                              View Details{" "}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">
                    No completed loans at the moment.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="rejected" className="space-y-4">
                {rejectedLoans.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rejectedLoans.map((loan) => (
                      <Card
                        key={loan.loanId}
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              Rejected Loan
                            </CardTitle>
                            <Badge variant="destructive">REJECTED</Badge>
                          </div>
                          <CardDescription>
                            Loan #{loan.loanId.slice(0, 8)} • {loan.purpose}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Amount
                              </span>
                              <span className="font-medium">
                                {formatCurrency(loan.amount)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Reason
                              </span>
                              <span className="font-medium">
                                {loan.rejectionReason || "N/A"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" disabled>
                            Application Closed
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">
                    No rejected loans at the moment.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </BorrowerDashboardLayout>
  );
}
