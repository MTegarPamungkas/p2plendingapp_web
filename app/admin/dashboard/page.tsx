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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, PieChart, AlertCircle } from "lucide-react";
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout";
import { useCallback } from "react";
import { loanAPI } from "@/api/apiServices";
import { usePublicAPI } from "@/hooks/useAPI";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Type definition for loansNeedingAttention
type Loan = {
  loanId: string;
  borrowerId: string;
  amount: number;
  creditScore: number;
};

export type AdminSummaryResponse = {
  success: boolean;
  message: string;
  data: {
    status: string;
    message: string;
    data: {
      systemMetrics: {
        totalUsers: number;
        verifiedUsers: number;
        pendingVerification: number;
        rejectedIdentities: number;
        roleDistribution: Record<string, number>;
        totalLoans: number;
        activeLoans: number;
        pendingLoans: number;
        completedLoans: number;
        rejectedLoans: number;
        totalLoanAmount: number;
        averageLoanAmount: number;
        totalWalletBalance: number;
        totalPlatformFees: number;
        platformFeeRate: number;
        minimumCreditScore: number;
        maximumLoanAmount: number;
      };
      creditScoreDistribution: Record<string, number>;
      recentActivity: {
        recordId: string;
        action: string;
        performedBy: string;
        timestamp: string;
        data: Record<string, any>;
      }[];
      loansNeedingAttention: Loan[];
    };
  };
};

export default function AdminDashboardPage() {
  const getSummary = useCallback(() => loanAPI.getAdminSummary(), []);
  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = usePublicAPI(getSummary, []);

  // Format Rupiah
  const formatCurrency = (amount: string | number | bigint) => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericAmount);
  };

  // Badge untuk skor kredit
  const getCreditScoreBadge = (score: number) => {
    if (score >= 800)
      return <Badge className="bg-green-900 text-green-200">A+</Badge>;
    if (score >= 740)
      return <Badge className="bg-blue-900 text-blue-200">A</Badge>;
    if (score >= 670)
      return <Badge className="bg-yellow-900 text-yellow-200">B+</Badge>;
    return <Badge className="bg-red-900 text-red-200">B</Badge>;
  };

  // Penanganan detail aktivitas
  const getActivityDetail = (activity: {
    action: string;
    data: Record<string, any>;
  }) => {
    switch (activity.action) {
      case "PAYMENT_DISTRIBUTION":
        return (
          <>
            {activity.data.amount
              ? formatCurrency(activity.data.amount)
              : "Pembayaran"}{" "}
            {activity.data.loanId && (
              <span>
                untuk Loan ID:{" "}
                <Link
                  href={`/admin/applications/${activity.data.loanId}`}
                  className="text-blue-400 hover:underline"
                >
                  {activity.data.loanId}
                </Link>
              </span>
            )}
            {activity.data.paymentId &&
              ` (Payment ID: ${activity.data.paymentId})`}
          </>
        );
      case "LOAN_PAYMENT":
        return (
          <>
            {activity.data.amount
              ? formatCurrency(activity.data.amount)
              : "Pembayaran"}{" "}
            {activity.data.installmentNumber &&
              `(Cicilan ke-${activity.data.installmentNumber}) `}
            {activity.data.loanId && (
              <span>
                untuk Loan ID:{" "}
                <Link
                  href={`/admin/applications/${activity.data.loanId}`}
                  className="text-blue-400 hover:underline"
                >
                  {activity.data.loanId}
                </Link>
              </span>
            )}
          </>
        );
      case "LOAN_FUNDING":
        return (
          <>
            Pendanaan{" "}
            {activity.data.amount ? formatCurrency(activity.data.amount) : ""}{" "}
            {activity.data.loanId && (
              <span>
                untuk Loan ID:{" "}
                <Link
                  href={`/admin/applications/${activity.data.loanId}`}
                  className="text-blue-400 hover:underline"
                >
                  {activity.data.loanId}
                </Link>
              </span>
            )}
          </>
        );
      case "LOAN_FUNDS_RELEASE":
        return (
          <>
            Distribusi dana{" "}
            {activity.data.totalDistributed
              ? formatCurrency(activity.data.totalDistributed)
              : ""}{" "}
            ke {activity.data.recipient?.walletId || "penerima"}{" "}
            {activity.data.loanId && (
              <span>
                (Loan ID:{" "}
                <Link
                  href={`/admin/applications/${activity.data.loanId}`}
                  className="text-blue-400 hover:underline"
                >
                  {activity.data.loanId}
                </Link>
                )
              </span>
            )}
          </>
        );
      case "REPAYMENT_SCHEDULE_CREATION":
        return (
          <>
            Pembuatan jadwal pembayaran dengan{" "}
            {activity.data.installments || "N/A"} cicilan{" "}
            {activity.data.loanId && (
              <span>
                untuk Loan ID:{" "}
                <Link
                  href={`/admin/applications/${activity.data.loanId}`}
                  className="text-blue-400 hover:underline"
                >
                  {activity.data.loanId}
                </Link>
              </span>
            )}
          </>
        );
      case "ESCROW_RELEASE":
        return (
          <>
            Pelepasan escrow{" "}
            {activity.data.amount ? formatCurrency(activity.data.amount) : ""}{" "}
            ke {activity.data.recipientId || "penerima"}{" "}
            {activity.data.loanId && (
              <span>
                (Loan ID:{" "}
                <Link
                  href={`/admin/applications/${activity.data.loanId}`}
                  className="text-blue-400 hover:underline"
                >
                  {activity.data.loanId}
                </Link>
                )
              </span>
            )}
          </>
        );
      default:
        return activity.action;
    }
  };

  // Prepare data for role distribution chart
  const roleDistributionData = Object.entries(
    summaryData?.data?.data?.systemMetrics?.roleDistribution || {}
  ).map(([role, count]) => ({ name: role, value: count }));

  // Prepare data for loan status chart
  const loanStatusData = [
    {
      name: "Active",
      value: summaryData?.data?.data?.systemMetrics?.activeLoans || 0,
    },
    {
      name: "Pending",
      value: summaryData?.data?.data?.systemMetrics?.pendingLoans || 0,
    },
    {
      name: "Completed",
      value: summaryData?.data?.data?.systemMetrics?.completedLoans || 0,
    },
    {
      name: "Rejected",
      value: summaryData?.data?.data?.systemMetrics?.rejectedLoans || 0,
    },
  ];

  // Loading state
  if (summaryLoading) {
    return (
      <AdminDashboardLayout>
        <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-lg">Memuat dashboard...</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  // Error state
  if (summaryError) {
    return (
      <AdminDashboardLayout>
        <div className="flex flex-col items-center gap-4 p-6  rounded-lg max-w-md mx-auto mt-10 text-gray-200">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-red-400 font-medium">
            Gagal memuat dashboard: {summaryError || "Terjadi kesalahan"}
          </p>
          <Button
            onClick={refetchSummary}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Coba Lagi
          </Button>
        </div>
      </AdminDashboardLayout>
    );
  }

  const {
    systemMetrics,
    creditScoreDistribution,
    recentActivity,
    loansNeedingAttention,
  } = summaryData?.data?.data || {};

  return (
    <AdminDashboardLayout>
      <div className="container mx-auto p-6 space-y-8  text-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
            <p className="text-sm text-gray-400 mt-1">
              Ikhtisar dan pengelolaan platform pinjaman
            </p>
          </div>
          <Button
            onClick={refetchSummary}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Refresh Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Pinjaman",
              value: formatCurrency(systemMetrics?.totalLoanAmount || 0),
              subtext: `Dari ${systemMetrics?.totalLoans || 0} pinjaman`,
              icon: <DollarSign className="h-5 w-5 text-gray-400" />,
            },
            {
              title: "Pengguna Aktif",
              value: systemMetrics?.totalUsers || 0,
              subtext: `${systemMetrics?.verifiedUsers || 0} terverifikasi, ${
                systemMetrics?.pendingVerification || 0
              } menunggu`,
              icon: <Users className="h-5 w-5 text-gray-400" />,
            },
            {
              title: "Saldo Dompet",
              value: formatCurrency(systemMetrics?.totalWalletBalance || 0),
              subtext: `Biaya platform: ${formatCurrency(
                systemMetrics?.totalPlatformFees || 0
              )}`,
              icon: <DollarSign className="h-5 w-5 text-gray-400" />,
            },
            {
              title: "Skor Kredit Minimum",
              value: systemMetrics?.minimumCreditScore || 0,
              subtext: `Maksimum pinjaman: ${formatCurrency(
                systemMetrics?.maximumLoanAmount || 0
              )}`,
              icon: <PieChart className="h-5 w-5 text-gray-400" />,
            },
          ].map((item, index) => (
            <Card
              key={index}
              className=" border-gray-700 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {item.title}
                </CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-white">
                  {item.value}
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.subtext}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="aktivitasterbaru" className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2  p-1 rounded-lg">
            {[
              { label: "Aktivitas Terbaru", value: "aktivitasterbaru" },
              {
                label: "Distribusi Skor Kredit",
                value: "distribusiskorkredit",
              },
              { label: "Pengajuan Tertunda", value: "pengajuantertunda" },
              { label: "Distribusi Peran", value: "distribusiperan" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm font-medium py-2 px-4 data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-md text-gray-300"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Aktivitas Terbaru */}
          <TabsContent value="aktivitasterbaru" className="space-y-4">
            <Card className=" border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Aktivitas Terbaru
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Lihat aktivitas terkini di platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity?.length ? (
                  <div className="overflow-x-auto rounded-md border border-gray-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-700 text-gray-300 font-medium">
                          <th className="p-3 text-left">Aksi</th>
                          <th className="p-3 text-left">Pelaku</th>
                          <th className="p-3 text-left">Detail</th>
                          <th className="p-3 text-left">Waktu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {recentActivity.map((activity) => (
                          <tr
                            key={activity.recordId}
                            className="hover:bg-gray-700"
                          >
                            <td className="p-3">{activity.action}</td>
                            <td className="p-3">{activity.performedBy}</td>
                            <td className="p-3">
                              {getActivityDetail(activity)}
                            </td>
                            <td className="p-3 text-gray-400">
                              {new Date(activity.timestamp).toLocaleString(
                                "id-ID",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                  timeZone: "Asia/Jakarta",
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400">Tidak ada aktivitas terbaru.</p>
                )}
              </CardContent>
              {/* <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-400 hover:bg-blue-900"
                  asChild
                >
                  <Link
                    href="/admin/activity"
                    className="flex items-center justify-center gap-2"
                  >
                    Lihat Semua Aktivitas
                  </Link>
                </Button>
              </CardFooter> */}
            </Card>
          </TabsContent>

          {/* Distribusi Skor Kredit */}
          <TabsContent value="distribusiskorkredit" className="space-y-4">
            <Card className=" border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Distribusi Skor Kredit
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Ringkasan distribusi skor kredit pengguna
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(creditScoreDistribution || {}).length ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={Object.entries(creditScoreDistribution || {}).map(
                        ([range, count]) => ({ range, count })
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="range" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#E5E7EB",
                        }}
                      />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400">
                    Tidak ada data distribusi skor kredit.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pengajuan Tertunda */}
          <TabsContent value="pengajuantertunda" className="space-y-4">
            <Card className=" border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Pengajuan Pinjaman
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {loansNeedingAttention?.length
                    ? "Tinjau dan kelola pengajuan pinjaman tertunda"
                    : "Tidak ada pengajuan pinjaman tertunda saat ini"}
                </CardDescription>
              </CardHeader>
              {loansNeedingAttention?.length ? (
                <>
                  <CardContent>
                    <div className="overflow-x-auto rounded-md border border-gray-700">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-700 text-gray-300 font-medium">
                            <th className="p-3 text-left">Peminjam</th>
                            <th className="p-3 text-left">Jumlah</th>
                            <th className="p-3 text-left">Skor Kredit</th>
                            <th className="p-3 text-left">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {loansNeedingAttention.map((loan) => (
                            <tr key={loan.loanId} className="hover:bg-gray-700">
                              <td className="p-3">{loan.borrowerId}</td>
                              <td className="p-3">
                                {formatCurrency(loan.amount)}
                              </td>
                              <td className="p-3">
                                {getCreditScoreBadge(loan.creditScore || 700)}
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="border-blue-500 text-blue-400 hover:bg-blue-900"
                                >
                                  <Link
                                    href={`/admin/applications/${loan.loanId}`}
                                  >
                                    Tinjau
                                  </Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-blue-500 text-blue-400 hover:bg-blue-900"
                      asChild
                    >
                      <Link
                        href="/admin/applications"
                        className="flex items-center justify-center gap-2"
                      >
                        Lihat Semua Pengajuan
                      </Link>
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <CardContent>
                  <p className="text-gray-400">
                    Tidak ada pengajuan pinjaman tertunda saat ini.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-blue-500 text-blue-400 hover:bg-blue-900"
                    asChild
                  >
                    <Link href="/admin/applications">
                      Lihat Riwayat Pengajuan
                    </Link>
                  </Button>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Distribusi Peran */}
          <TabsContent value="distribusiperan" className="space-y-4">
            <Card className=" border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Distribusi Peran Pengguna
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Ringkasan distribusi peran pengguna di platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {roleDistributionData.length ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={roleDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#E5E7EB",
                        }}
                      />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400">
                    Tidak ada data distribusi peran.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Configuration */}
        <Card className=" border-gray-700 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Konfigurasi Sistem
            </CardTitle>
            <CardDescription className="text-gray-400">
              Informasi konfigurasi platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-gray-400">Biaya Platform</p>
                <p className="text-lg font-semibold text-white">
                  {((systemMetrics?.platformFeeRate ?? 0) * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Skor Kredit Minimum</p>
                <p className="text-lg font-semibold text-white">
                  {systemMetrics?.minimumCreditScore}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Maksimum Pinjaman</p>
                <p className="text-lg font-semibold text-white">
                  {formatCurrency(systemMetrics?.maximumLoanAmount || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
