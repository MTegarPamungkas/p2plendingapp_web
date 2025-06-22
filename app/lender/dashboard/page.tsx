"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Eye,
  FileText,
  RefreshCw,
  Shield,
  Wallet,
} from "lucide-react";
import { LenderDashboardLayout } from "@/components/lender-dashboard-layout";
import { loanAPI } from "@/api/apiServices";
import { useAPI } from "@/hooks/useAPI";
import {
  LenderPortfolioResponse,
  InvestmentDetailsResponse,
  PaymentDistributionDetails,
  FutureDistribution,
  LoanDetails,
} from "@/types";

// Warna untuk chart
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#64748b",
];
const formatCurrency = (value: number | null | undefined) =>
  value
    ? value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
    : "N/A";

// Antarmuka untuk identitas lender
interface LenderIdentity {
  profilePicture?: string;
}

// Komponen Header Dashboard
const DashboardHeader = ({
  lenderId,
  profilePicture,
  onRefresh,
  isLoading,
}: {
  lenderId: string;
  profilePicture?: string;
  onRefresh: () => void;
  isLoading: boolean;
}) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={profilePicture || ""} />
        <AvatarFallback>{lenderId[0]?.toUpperCase() || "L"}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lender Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {lenderId || "Lender"}
        </p>
      </div>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Data
      </Button>
      <Button asChild>
        <Link href="/lender/marketplace">Browse Opportunities</Link>
      </Button>
    </div>
  </div>
);

// Komponen Kartu Ringkasan
const SummaryCards = ({ data }: { data: LenderPortfolioResponse["data"] }) => {
  const formatCurrency = (value: number | null | undefined) =>
    value
      ? value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      : "N/A";

  const formatPercentage = (value: number) => `${value}%`;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Investasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.totalInvested)}
          </div>
          <p className="text-xs text-muted-foreground">
            Dari {data.investments.length} investasi
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Diterima</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.totalReceived)}
          </div>
          <p className="text-xs text-muted-foreground">
            Dari {data.performanceMetrics.activeInvestments} aktif,{" "}
            {data.performanceMetrics.completedInvestments} selesai
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Saldo Dompet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.walletBalance)}
          </div>
          <p className="text-xs text-muted-foreground">
            Tersedia untuk investasi
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">ROI Saat Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              data.performanceMetrics.roi >= 0
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {formatPercentage(data.performanceMetrics.roi)}
          </div>
          <p
            className="text-xs text-muted-foreground.markdown

          foreground"
          >
            Harapan:{" "}
            {formatPercentage(data.performanceMetrics.expectedOverallROI)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Komponen Tab Overview
const OverviewTab = ({ data }: { data: LenderPortfolioResponse["data"] }) => {
  const diversificationData = data.diversification.byPurpose
    ? Object.entries(data.diversification.byPurpose).map(([name, value]) => ({
        name,
        value: Number(value),
      }))
    : [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Diversifikasi Investasi</CardTitle>
          <CardDescription>Berdasarkan tujuan pinjaman</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={diversificationData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {diversificationData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Status Investasi</CardTitle>
          <CardDescription>Rincian berdasarkan status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Aktif",
                    value: data.performanceMetrics.activeInvestments,
                  },
                  {
                    name: "Pendanaan",
                    value: data.performanceMetrics.fundingInvestments,
                  },
                  {
                    name: "Menunggu",
                    value: data.performanceMetrics.pendingInvestments,
                  },
                  {
                    name: "Selesai",
                    value: data.performanceMetrics.completedInvestments,
                  },
                  {
                    name: "Ditolak",
                    value: data.performanceMetrics.rejectedInvestments,
                  },
                ].filter((d) => d.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {["#3b82f6", "#f59e0b", "#10b981", "#ef4444"].map(
                  (color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Komponen Tab Investasi
const InvestmentsTab = ({
  data,
  onSelectInvestment,
}: {
  data: LenderPortfolioResponse["data"];
  onSelectInvestment: (id: string) => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Investasi</CardTitle>
        <CardDescription>
          Semua investasi aktif, menunggu, dan selesai
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pinjaman</TableHead>
              <TableHead>Tujuan</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Jangka Waktu</TableHead>
              <TableHead>Pembayaran Berikutnya</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.investments.map((inv) => (
              <TableRow key={inv.loanId}>
                <TableCell>{inv.loanId.slice(0, 8)}...</TableCell>
                <TableCell>{inv.purpose}</TableCell>
                <TableCell>{formatCurrency(inv.investmentAmount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.loanStatus === "ACTIVE" || inv.loanStatus === "FUNDED"
                        ? "default"
                        : inv.loanStatus === "PENDING_APPROVAL" ||
                          inv.loanStatus === "APPROVED"
                        ? "secondary"
                        : inv.loanStatus === "COMPLETED"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {inv.applicationStatus || inv.loanStatus}
                  </Badge>
                </TableCell>
                <TableCell>{inv.term} bulan</TableCell>
                <TableCell>
                  {inv.nextExpectedPayment
                    ? `${formatCurrency(
                        inv.nextExpectedPayment.amount
                      )} (${format(
                        parseISO(inv.nextExpectedPayment.dueDate),
                        "d MMM yyyy",
                        { locale: id }
                      )})`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {inv.investmentIds.map((id) => (
                    <Button
                      key={id}
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectInvestment(id)}
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
      </CardContent>
    </Card>
  );
};

// Komponen Tab Performa
const PerformanceTab = ({
  data,
}: {
  data: LenderPortfolioResponse["data"];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Riwayat Performa</CardTitle>
      <CardDescription>ROI Anda dari waktu ke waktu</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.performanceMetrics.performanceHistory || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Line type="monotone" dataKey="roi" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// Komponen Dialog Detail Investasi
const InvestmentDetailsDialog = ({
  investmentId,
  investmentData,
  logsData,
  investmentLoading,
  investmentError,
  logsLoading,
  logsError,
  onRefetch,
  onClose,
}: {
  investmentId: string | null;
  investmentData: InvestmentDetailsResponse | null;
  logsData: any | null;
  investmentLoading: boolean;
  investmentError: string | null;
  logsLoading: boolean;
  logsError: string | null;
  onRefetch: () => void;
  onClose: () => void;
}) => {
  const formatCurrency = (value: number | null | undefined) =>
    value
      ? value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      : "N/A";

  return (
    <Dialog open={!!investmentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Investasi</DialogTitle>
        </DialogHeader>
        {investmentLoading ? (
          <div className="text-center">Memuat...</div>
        ) : investmentError ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Gagal memuat detail investasi: {investmentError}.{" "}
              <Button variant="link" onClick={onRefetch} className="p-0 h-auto">
                Coba lagi
              </Button>
            </AlertDescription>
          </Alert>
        ) : investmentData?.data ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Investasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      ID Investasi
                    </p>
                    <p className="font-medium">
                      {investmentData.data.investmentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ID Pinjaman</p>
                    <p className="font-medium">{investmentData.data.loanId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Jumlah Investasi
                    </p>
                    <p className="font-medium">
                      {formatCurrency(investmentData.data.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Diterima
                    </p>
                    <p className="font-medium">
                      {formatCurrency(
                        investmentData.data.repaymentDetails?.totalReceived
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pengembalian Diharapkan
                    </p>
                    <p className="font-medium">
                      {formatCurrency(
                        investmentData.data.repaymentDetails
                          ?.expectedTotalReturn
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Biaya Platform
                    </p>
                    <p className="font-medium">
                      {formatCurrency(
                        investmentData.data.repaymentDetails?.totalPlatformFee
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {investmentData.data.loanStatus}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribusi Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                {investmentData.data.repaymentDetails?.paymentDistributions
                  .length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Angsuran</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Pokok</TableHead>
                        <TableHead>Bunga</TableHead>
                        <TableHead>Biaya Platform</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investmentData.data.repaymentDetails.paymentDistributions.map(
                        (dist: PaymentDistributionDetails) => (
                          <TableRow key={dist.transactionId}>
                            <TableCell>{dist.installmentNumber}</TableCell>
                            <TableCell>
                              {format(parseISO(dist.timestamp), "d MMM yyyy", {
                                locale: id,
                              })}
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
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">
                    Belum ada distribusi pembayaran.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pembayaran Mendatang</CardTitle>
              </CardHeader>
              <CardContent>
                {investmentData.data.repaymentDetails?.futureDistributions
                  .length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Angsuran</TableHead>
                        <TableHead>Tanggal Jatuh Tempo</TableHead>
                        <TableHead>Pokok</TableHead>
                        <TableHead>Bunga</TableHead>
                        <TableHead>Biaya Platform</TableHead>
                        <TableHead>Jumlah Bersih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investmentData.data.repaymentDetails.futureDistributions.map(
                        (dist: FutureDistribution) => (
                          <TableRow key={dist.installmentNumber}>
                            <TableCell>{dist.installmentNumber}</TableCell>
                            <TableCell>
                              {format(parseISO(dist.dueDate), "d MMM yyyy", {
                                locale: id,
                              })}
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
                              {formatCurrency(dist.amountAfterFee)}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">
                    Tidak ada pembayaran mendatang.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jadwal Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                {investmentData.data.repaymentDetails == null ? (
                  <p className="text-muted-foreground">
                    Belum ada jadwal pembayaran.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Angsuran
                      </p>
                      <p className="font-medium">
                        {investmentData.data.repaymentDetails.totalInstallments}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Angsuran Lunas
                      </p>
                      <p className="font-medium">
                        {investmentData.data.repaymentDetails.paidInstallments}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pembayaran Bulanan
                      </p>
                      <p className="font-medium">
                        {formatCurrency(
                          investmentData.data.repaymentDetails
                            .standardMonthlyPayment
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Bunga
                      </p>
                      <p className="font-medium">
                        {formatCurrency(
                          investmentData.data.repaymentDetails.totalInterest
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detail Pinjaman</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tujuan</p>
                    <p className="font-medium">
                      {investmentData.data.loanDetails.purpose}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Jumlah Total Pinjaman
                    </p>
                    <p className="font-medium">
                      {formatCurrency(
                        investmentData.data.loanDetails.totalAmount
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Jangka Waktu
                    </p>
                    <p className="font-medium">
                      {investmentData.data.loanDetails.term} bulan
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Progres Pendanaan
                    </p>
                    <p className="font-medium">
                      {investmentData.data.loanDetails.fundingProgress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dibuat</p>
                    <p className="font-medium">
                      {format(
                        parseISO(investmentData.data.loanDetails.createdAt),
                        "d MMM yyyy",
                        { locale: id }
                      )}
                    </p>
                  </div>
                  {investmentData.data.loanDetails.approvedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Disetujui</p>
                      <p className="font-medium">
                        {format(
                          parseISO(investmentData.data.loanDetails.approvedAt),
                          "d MMM yyyy",
                          { locale: id }
                        )}
                      </p>
                    </div>
                  )}
                  {investmentData.data.loanDetails.fundedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Didanai</p>
                      <p className="font-medium">
                        {format(
                          parseISO(investmentData.data.loanDetails.fundedAt),
                          "d MMM yyyy",
                          { locale: id }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Log Pinjaman</CardTitle>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="text-center">Memuat log...</div>
                ) : logsError ? (
                  <div className="text-red-600">Error: {logsError}</div>
                ) : (logsData?.data ?? []).length > 0 ? (
                  <div className="space-y-3">
                    {logsData.data.map((log: any, index: number) => (
                      <div
                        key={index}
                        className="group relative rounded-lg border bg-card p-4 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <Badge variant="secondary">
                                {log.action.replace(/_/g, " ").toUpperCase()}
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
                            Terverifikasi
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString("id-ID", {
                              dateStyle: "full",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-1">
                              <span className="text-xs text-muted-foreground uppercase">
                                ID Transaksi
                              </span>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {log.transactionId.slice(0, 12)}...
                              </code>
                            </div>
                            {log.data.loanId && (
                              <div className="flex justify-between items-center py-1">
                                <span className="text-xs text-muted-foreground uppercase">
                                  ID Pinjaman
                                </span>
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                  {log.data.loanId.slice(0, 12)}...
                                </code>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            {log.data.amount && (
                              <div className="flex justify-between items-center py-1">
                                <span className="text-xs text-muted-foreground uppercase">
                                  Jumlah
                                </span>
                                <span className="text-sm font-semibold text-green-600">
                                  {formatCurrency(log.data.amount)}
                                </span>
                              </div>
                            )}
                            {log.data.creditScore && (
                              <div className="flex justify-between items-center py-1">
                                <span className="text-xs text-muted-foreground uppercase">
                                  Skor Kredit
                                </span>
                                <span className="text-sm font-semibold">
                                  {log.data.creditScore}/850
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Tidak ada log untuk pinjaman ini.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

// Komponen Utama
export default function PortfolioPage() {
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<
    string | null
  >(null);
  const [loanId, setLoanId] = useState<string | null>(null);
  const [lenderIdentity, setLenderIdentity] = useState<LenderIdentity | null>(
    null
  );

  // Ambil data portofolio
  const getUserPortfolio = useCallback(() => loanAPI.getUserPortfolio(), []);
  const {
    data: portfolioData,
    loading: portfolioLoading,
    error: portfolioError,
    refetch: refetchPortfolio,
  } = useAPI<LenderPortfolioResponse>(getUserPortfolio, []);

  // Ambil detail investasi
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
    refetch: refetchInvestmentDetails,
  } = useAPI<InvestmentDetailsResponse | null>(getInvestmentDetails, [
    selectedInvestmentId,
  ]);

  // Ambil log pinjaman
  const getLogsLoan = useCallback(
    () => (loanId ? loanAPI.getLogsLoan(loanId) : Promise.resolve(null)),
    [loanId]
  );
  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
  } = useAPI<any | null>(getLogsLoan, [loanId]);

  // Ambil identitas lender (mock)
  useEffect(() => {
    setLenderIdentity({ profilePicture: undefined }); // Ganti dengan panggilan API sebenarnya
  }, []);

  // Perbarui loanId berdasarkan detail investasi
  useEffect(() => {
    if (investmentDetailsData?.data?.loanId) {
      setLoanId(investmentDetailsData.data.loanId);
    }
  }, [investmentDetailsData]);

  // Format mata uang
  const formatCurrency = (value: number | null | undefined) =>
    value
      ? value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      : "N/A";

  return (
    <LenderDashboardLayout>
      <div className="flex flex-col gap-6 p-6 min-h-screen max-w-7xl mx-auto">
        <DashboardHeader
          lenderId={portfolioData?.data.lenderId || "Lender"}
          profilePicture={lenderIdentity?.profilePicture}
          onRefresh={refetchPortfolio}
          isLoading={portfolioLoading}
        />

        {portfolioLoading && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle>Memuat</AlertTitle>
            <AlertDescription>
              Sedang mengambil data portofolio...
            </AlertDescription>
          </Alert>
        )}

        {portfolioError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Gagal memuat portofolio: {portfolioError}.{" "}
              <Button
                variant="link"
                onClick={refetchPortfolio}
                className="p-0 h-auto"
              >
                Coba lagi
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {portfolioData && (
          <>
            <SummaryCards data={portfolioData.data} />
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                <TabsTrigger value="investments">Investasi</TabsTrigger>
                <TabsTrigger value="performance">Performa</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <OverviewTab data={portfolioData.data} />
              </TabsContent>
              <TabsContent value="investments" className="mt-6">
                <InvestmentsTab
                  data={portfolioData.data}
                  onSelectInvestment={setSelectedInvestmentId}
                />
              </TabsContent>
              <TabsContent value="performance" className="mt-6">
                <PerformanceTab data={portfolioData.data} />
              </TabsContent>
            </Tabs>
          </>
        )}

        <InvestmentDetailsDialog
          investmentId={selectedInvestmentId}
          investmentData={investmentDetailsData}
          logsData={logsData}
          investmentLoading={investmentDetailsLoading}
          investmentError={investmentDetailsError}
          logsLoading={logsLoading}
          logsError={logsError}
          onRefetch={refetchInvestmentDetails}
          onClose={() => {
            setSelectedInvestmentId(null);
            setLoanId(null);
          }}
        />
      </div>
    </LenderDashboardLayout>
  );
}
