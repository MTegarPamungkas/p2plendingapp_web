"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LenderDashboardLayout } from "@/components/lender-dashboard-layout";
import {
  Download,
  Calendar,
  Eye,
  FileText,
  RefreshCw,
  Shield,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Key, useCallback, useEffect, useState } from "react";
import { loanAPI } from "@/api/apiServices";
import { useAPI } from "@/hooks/useAPI";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FutureDistribution,
  Investment,
  InvestmentDetailsResponse,
  PaymentDistributionDetails,
  PortfolioResponse,
} from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PortfolioPage() {
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<
    string | null
  >(null);
  const [loanId, setLoanId] = useState<string | null>(null);

  // Fetch portfolio data
  const getUserPortfolio = useCallback(() => loanAPI.getUserPortfolio(), []);
  const {
    data: portfolioData,
    loading: portfolioLoading,
    error: portfolioError,
    refetch: refetchPortfolio,
  } = useAPI<PortfolioResponse>(getUserPortfolio, []);

  // Fetch investment details when an investment is selected
  const getInvestmentDetails = useCallback(
    () =>
      selectedInvestmentId
        ? loanAPI.getInvestmentDetails(selectedInvestmentId)
        : Promise.resolve(null),
    [selectedInvestmentId]
  );

  const {
    data: investmentDetailsData,
    loading: investmentDetailsLoading,
    error: investmentDetailsError,
  } = useAPI<InvestmentDetailsResponse | null>(getInvestmentDetails, [
    selectedInvestmentId,
  ]);

  // Prepare investment distribution data for doughnut chart
  const investmentDistributionData = (() => {
    if (!portfolioData?.data.investments) return [];

    return portfolioData.data.investments.map((inv) => ({
      loanId: inv.loanId.slice(0, 8) + "...",
      value: inv.investmentAmount,
      color:
        inv.loanId === "3a75ba710dae83292b335acd3d67b2c9"
          ? "#10b981"
          : "#f59e0b",
    }));
  })();

  // Fetch loan logs
  const getLogsLoan = useCallback(() => {
    if (!loanId) return Promise.resolve(null);
    return loanAPI.getLogsLoan(loanId);
  }, [loanId]);

  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
    refetch: logsRefetch,
  } = useAPI<any>(getLogsLoan, [loanId]);

  useEffect(() => {
    if (investmentDetailsData?.data?.loanId) {
      setLoanId(investmentDetailsData.data.loanId);
    }
  }, [investmentDetailsData]);

  // Prepare loan status distribution for pie chart
  const loanStatusData = portfolioData?.data.loanStatusDistribution
    ? Object.entries(portfolioData.data.loanStatusDistribution)
        .filter(([_, value]) => Number(value) > 0)
        .map(([status, value]) => ({
          name: status,
          value: Number(value),
          color:
            {
              ACTIVE: "#3b82f6",
              COMPLETED: "#10b981",
              FUNDING: "#f59e0b",
              APPROVED: "#8b5cf6",
              FUNDED: "#ef4444",
              PENDING_APPROVAL: "#64748b",
            }[status] || "#d1d5db",
        }))
    : [];

  // Formatters
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const formatPercentage = (value: number) => `${value}%`;

  return (
    <LenderDashboardLayout>
      <div className="flex flex-col gap-6 p-6 min-h-screen">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John Doe</p>
          </div>
          <Button asChild>
            <Link href="/lender/marketplace">Browse Opportunities</Link>
          </Button>
        </div>

        {/* Summary Cards */}
        {portfolioLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : portfolioError ? (
          <Card>
            <CardContent className="pt-6 text-center text-red-600">
              Error: {portfolioError}
            </CardContent>
          </Card>
        ) : portfolioData ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Investasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(portfolioData.data.totalInvested)}
                </div>
                {/* <p className="text-xs text-gray-400">
                  Diperbarui{" "}
                  {format(
                    new Date(portfolioData.data.lastUpdated),
                    "d MMM yyyy",
                    { locale: id }
                  )}
                </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Diterima
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-300">
                  {formatCurrency(portfolioData.data.totalReceived)}
                </div>
                <p className="text-xs text-gray-400">
                  Dari{" "}
                  {portfolioData.data.investments.reduce(
                    (total, inv) => total + inv.investmentIds.length,
                    0
                  )}{" "}
                  investasi
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  ROI Saat Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    portfolioData.data.performanceMetrics.roi >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {formatPercentage(portfolioData.data.performanceMetrics.roi)}
                </div>
                <p className="text-xs text-gray-400">
                  {portfolioData.data.performanceMetrics.roi >= 0 ? "+" : ""}
                  {portfolioData.data.performanceMetrics.expectedOverallROI}%
                  Roi diharapkan
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Ekspektasi Pengembalian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-300">
                  {formatCurrency(portfolioData.data.totalExpectedReturn)}
                </div>
                <p className="text-xs text-gray-400">
                  Termasuk bunga masa depan
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] p-1 rounded-lg">
            <TabsTrigger value="overview" className="rounded-md text-gray-300">
              Ringkasan
            </TabsTrigger>
            <TabsTrigger
              value="investments"
              className="rounded-md text-gray-300"
            >
              Investasi
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Investasi</CardTitle>
                  <CardDescription>
                    Proporsi investasi Anda per pinjaman
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={investmentDistributionData}
                        dataKey="value"
                        nameKey="loanId"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        label
                      >
                        {investmentDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Status Pinjaman</CardTitle>
                  <CardDescription>
                    Komposisi status investasi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={loanStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {loanStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Investasi</CardTitle>
                <CardDescription>
                  Semua investasi aktif dan selesai
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolioLoading ? (
                  <div className="text-center">Memuat...</div>
                ) : portfolioData ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Investasi</TableHead>
                        <TableHead>ID Pinjaman</TableHead>
                        <TableHead>Jumlah Investasi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Suku Bunga</TableHead>
                        <TableHead>Hasil yang Diharapkan</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioData.data.investments.map((inv: Investment) => (
                        <TableRow key={inv.loanId}>
                          <TableCell>
                            <span title={inv.investmentIds.join(", ")}>
                              {inv.investmentIds
                                .map((id) => id.slice(0, 8) + "...")
                                .join(", ")
                                .slice(0, 20) +
                                (inv.investmentIds.length > 1 ? "..." : "")}
                            </span>
                          </TableCell>
                          <TableCell>{inv.loanId.slice(0, 8)}...</TableCell>
                          <TableCell>
                            {formatCurrency(inv.investmentAmount)}
                          </TableCell>
                          <TableCell>{inv.loanStatus}</TableCell>
                          <TableHead>
                            {formatPercentage(inv.interestRate * 100)}
                          </TableHead>
                          <TableCell>
                            {formatCurrency(inv.expectedReturn)}
                          </TableCell>
                          <TableCell>
                            {inv.investmentIds.map((investmentId: string) => (
                              <Button
                                key={investmentId}
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setSelectedInvestmentId(investmentId)
                                }
                                className="mr-2"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Investment Details Dialog */}
        <Dialog
          open={!!selectedInvestmentId}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedInvestmentId(null);
              setLoanId(null); // Reset loanId saat dialog ditutup
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Investasi</DialogTitle>
            </DialogHeader>
            {investmentDetailsLoading ? (
              <div className="text-center">Memuat...</div>
            ) : investmentDetailsError ? (
              <div className="text-red-600">
                Error: {investmentDetailsError}
              </div>
            ) : investmentDetailsData ? (
              <div className="grid gap-6">
                {/* Investment Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ringkasan Investasi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-300">ID Investasi</p>
                        <p className="font-medium">
                          {investmentDetailsData.data.investmentId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">ID Pinjaman</p>
                        <p className="font-medium">
                          {investmentDetailsData.data.loanId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Total Investasi</p>
                        <p className="font-medium">
                          {formatCurrency(investmentDetailsData.data.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Total Diterima</p>
                        <p className="font-medium">
                          {formatCurrency(
                            investmentDetailsData.data.repaymentDetails
                              .totalReceived
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">ROI</p>
                        <p
                          className={`font-medium ${
                            investmentDetailsData.data.repaymentDetails.roi >= 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatPercentage(
                            investmentDetailsData.data.repaymentDetails.roi
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">
                          Ekspektasi Pengembalian
                        </p>
                        <p className="font-medium">
                          {formatCurrency(
                            investmentDetailsData.data.repaymentDetails
                              .expectedTotalReturn
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">
                          Total Biaya Platform
                        </p>
                        <p className="font-medium">
                          {formatCurrency(
                            investmentDetailsData.data.repaymentDetails
                              .totalPlatformFee
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Status</p>
                        <p className="font-medium">
                          {investmentDetailsData.data.loanStatus}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Distributions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribusi Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {investmentDetailsData.data.repaymentDetails
                      .paymentDistributions?.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Angsuran</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Pokok</TableHead>
                            <TableHead>Bunga</TableHead>
                            <TableHead>Biaya</TableHead>
                            <TableHead>Net</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {investmentDetailsData.data.repaymentDetails.paymentDistributions.map(
                            (dist: PaymentDistributionDetails) => (
                              <TableRow key={dist.transactionId}>
                                <TableCell>{dist.installmentNumber}</TableCell>
                                <TableCell>
                                  {format(
                                    new Date(dist.timestamp),
                                    "d MMM yyyy",
                                    { locale: id }
                                  )}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dist.principalShare)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dist.interestShare)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dist.platformFee)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dist.amountReceived)}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-gray-400">
                        Belum ada distribusi pembayaran untuk investasi ini.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Future Distributions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Proyeksi Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {investmentDetailsData.data.repaymentDetails
                      .futureDistributions?.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Angsuran</TableHead>
                            <TableHead>Jatuh Tempo</TableHead>
                            <TableHead>Pokok</TableHead>
                            <TableHead>Bunga</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Biaya</TableHead>
                            <TableHead>Net</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {investmentDetailsData.data.repaymentDetails.futureDistributions.map(
                            (dist: FutureDistribution) => (
                              <TableRow key={dist.installmentNumber}>
                                <TableCell>{dist.installmentNumber}</TableCell>
                                <TableCell>
                                  {format(
                                    new Date(dist.dueDate),
                                    "d MMM yyyy",
                                    { locale: id }
                                  )}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dist.principalShare)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dist.interestShare)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dist.totalShare)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dist.platformFee)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dist.amountAfterFee)}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-gray-400">
                        Belum ada proyeksi pembayaran untuk investasi ini.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Loan Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Detail Pinjaman</span>
                      {/* <Link
                        href={`/lender/marketplace/${investmentDetailsData.data.loanId}`}
                      >
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail Loan
                        </Button>
                      </Link> */}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {/* <div>
                        <p className="text-sm text-gray-300">Peminjam</p>
                        <p className="font-medium">
                          {investmentDetailsData.data.loanDetails.borrowerId}
                        </p>
                      </div> */}
                      <div>
                        <p className="text-sm text-gray-300">Tujuan</p>
                        <p className="font-medium">
                          {investmentDetailsData.data.loanDetails.purpose}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Jumlah Pinjaman</p>
                        <p className="font-medium">
                          {formatCurrency(
                            investmentDetailsData.data.loanDetails.totalAmount
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Skor Kredit</p>
                        <p className="font-medium">
                          {/* {investmentDetailsData.data.loanDetails.creditScore} */}
                          0
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">
                          Progres Pendanaan
                        </p>
                        <p className="font-medium">
                          {
                            investmentDetailsData.data.loanDetails
                              .fundingProgress
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Dibuat</p>
                        <p className="font-medium">
                          {format(
                            new Date(
                              investmentDetailsData.data.loanDetails.createdAt
                            ),
                            "d MMM yyyy",
                            { locale: id }
                          )}
                        </p>
                      </div>
                      {investmentDetailsData.data.loanDetails.approvedAt && (
                        <div>
                          <p className="text-sm text-gray-300">Disetujui</p>
                          <p className="font-medium">
                            {format(
                              new Date(
                                investmentDetailsData.data.loanDetails.approvedAt
                              ),
                              "d MMM yyyy",
                              { locale: id }
                            )}
                          </p>
                        </div>
                      )}
                      {investmentDetailsData.data.loanDetails.fundedAt && (
                        <div>
                          <p className="text-sm text-gray-300">Didanai</p>
                          <p className="font-medium">
                            {format(
                              new Date(
                                investmentDetailsData.data.loanDetails.fundedAt
                              ),
                              "d MMM yyyy",
                              { locale: id }
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Repayment Schedule
                <Card>
                  <CardHeader>
                    <CardTitle>Jadwal Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {investmentDetailsData.data.repaymentSchedule ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-300">
                            Total Angsuran
                          </p>
                          <p className="font-medium">
                            {
                              investmentDetailsData.data.repaymentSchedule
                                .totalInstallments
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-300">
                            Angsuran Dibayar
                          </p>
                          <p className="font-medium">
                            {
                              investmentDetailsData.data.repaymentSchedule
                                .paidInstallments
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-300">
                            Pembayaran Bulanan
                          </p>
                          <p className="font-medium">
                            {formatCurrency(
                              investmentDetailsData.data.repaymentSchedule
                                .standardMonthlyPayment
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-300">Total Bunga</p>
                          <p className="font-medium">
                            {formatCurrency(
                              investmentDetailsData.data.repaymentSchedule
                                .totalInterest
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400">
                        Jadwal pembayaran belum tersedia karena pinjaman masih
                        dalam status {investmentDetailsData.data.loanStatus}.
                      </p>
                    )}
                  </CardContent>
                </Card> */}
                <Card>
                  <CardHeader>
                    <CardTitle>Log Pinjaman</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {logsLoading ? (
                      <div className="text-center">Memuat log...</div>
                    ) : logsError ? (
                      <div className="text-red-600">Error: {logsError}</div>
                    ) : logsData?.data?.length > 0 ? (
                      <div className="space-y-3">
                        {logsData.data.map(
                          (log: any, index: Key | null | undefined) => (
                            <div
                              key={index}
                              className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <Badge
                                      variant="secondary"
                                      className="bg-primary/10 text-primary border-primary/20 font-medium"
                                    >
                                      {log.action
                                        .replace(/_/g, " ")
                                        .toUpperCase()}
                                    </Badge>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Dilakukan oleh:{" "}
                                      <span className="font-medium">
                                        {log.performedBy}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                  <Shield className="h-3 w-3" />
                                  Verified
                                </div>
                              </div>

                              <div className="mb-3">
                                <p className="text-sm text-muted-foreground">
                                  {new Date(log.timestamp).toLocaleString(
                                    "id-ID",
                                    {
                                      dateStyle: "full",
                                      timeStyle: "short",
                                    }
                                  )}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center py-1">
                                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Transaction ID
                                      </span>
                                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                        {log.transactionId.substring(0, 12)}
                                        ...
                                      </code>
                                    </div>

                                    {log.data.loanId && (
                                      <div className="flex justify-between items-center py-1">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                          Loan ID
                                        </span>
                                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                          {log.data.loanId.substring(0, 12)}
                                          ...
                                        </code>
                                      </div>
                                    )}

                                    {log.data.scheduleId && (
                                      <div className="flex justify-between items-center py-1">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                          Schedule ID
                                        </span>
                                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                          {log.data.scheduleId.substring(0, 12)}
                                          ...
                                        </code>
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    {log.data.amount && (
                                      <div className="flex justify-between items-center py-1">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                          Jumlah
                                        </span>
                                        <span className="text-sm font-semibold text-green-600">
                                          {formatCurrency(log.data.amount)}
                                        </span>
                                      </div>
                                    )}

                                    {log.data.creditScore && (
                                      <div className="flex justify-between items-center py-1">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                          Skor Kredit
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-semibold">
                                            {log.data.creditScore}/850
                                          </span>
                                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
                                              style={{
                                                width: `${
                                                  (log.data.creditScore / 850) *
                                                  100
                                                }%`,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {log.data.installments && (
                                      <div className="flex justify-between items-center py-1">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                          Angsuran
                                        </span>
                                        <span className="text-sm font-semibold">
                                          {log.data.installments}x
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {log.data.distributionDetails && (
                                  <div className="mt-3 p-3 bg-muted/30 rounded-md border-l-4 border-primary">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                      Detail Distribusi
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm font-semibold text-primary">
                                        {formatCurrency(
                                          log.data.distributionDetails.amount
                                        )}
                                      </span>
                                      <code className="text-xs bg-background px-2 py-1 rounded font-mono">
                                        ke{" "}
                                        {log.data.distributionDetails.toWallet.substring(
                                          0,
                                          8
                                        )}
                                        ...
                                      </code>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400">
                        Belum ada log untuk pinjaman ini.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </LenderDashboardLayout>
  );
}
