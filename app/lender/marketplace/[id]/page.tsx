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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  BarChart3,
  Building,
  Calendar,
  Check,
  FileText,
  PieChart,
  RefreshCw,
  Shield,
  Star,
} from "lucide-react";
import { LenderDashboardLayout } from "@/components/lender-dashboard-layout";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useState,
} from "react";
import { loanAPI, walletAPI } from "@/api/apiServices";
import { useAPI, useMutation } from "@/hooks/useAPI";
import { useRouter } from "next/navigation";
import { PaymentDialog } from "@/components/payment-dialog";
import { InvestmentDialog } from "@/components/payment-investment";

interface Loan {
  loanId: string;
  // borrowerId: string;
  amount: number;
  term: number;
  purpose: string;
  interestRate: number;
  currentFunding: number;
  fundingTarget: number;
  creditScore: number;
  status: string;
  createdAt: string;
  description?: string;
  businessDetails?: {
    businessName: string;
    businessType: string;
    businessDuration: string;
  };
  financials?: Array<{
    year: string;
    revenue: number;
    profit: number;
  }>;
  repaymentSchedule?: Array<{
    month: number;
    principal: number;
    interest: number;
    total: number;
  }>;
  lenders?: Array<{
    name: string;
    lenderId: string;
    amount: number;
    investmentId: string;
    timestamp: string;
  }>;
  creditScoreBreakdown?: {
    baseCredit: number;
    amountsOwed: number;
    creditHistory: number;
    creditMix: number;
    newCredit: number;
    paymentHistory: number;
  };
}

export default function LenderMarketplaceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isInvesting, setIsInvesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loanId, setLoanId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setLoanId(resolvedParams.id);
    }
    getParams();
  }, [params]);

  const getLoanDetails = useCallback(() => {
    if (!loanId) return Promise.resolve(null);
    return loanAPI.getLoanDetailById(loanId);
  }, [loanId]);

  const getLogsLoan = useCallback(() => {
    if (!loanId) return Promise.resolve(null);
    return loanAPI.getLogsLoan(loanId);
  }, [loanId]);

  const {
    data: loanData,
    loading: loanLoading,
    error: loanError,
    refetch: refetchLoan,
  } = useAPI(getLoanDetails, [loanId]);
  const {
    data: logsLoanData,
    loading: logsLoanLoading,
    error: logsLoanError,
    refetch: refetchLogsLoan,
  } = useAPI(getLogsLoan, [loanId]);

  const loan = loanData?.data;

  const getWallet = useCallback(() => walletAPI.getWallet(), []);
  const {
    data: walletData,
    loading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useAPI(getWallet, []);

  const walletDatas = walletData?.data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCreditRating = (creditScore: number) => {
    if (creditScore >= 850) return "A+";
    if (creditScore >= 800) return "A";
    if (creditScore >= 750) return "A-";
    if (creditScore >= 700) return "B+";
    if (creditScore >= 650) return "B";
    if (creditScore >= 600) return "B-";
    if (creditScore >= 550) return "C+";
    if (creditScore >= 500) return "C";
    return "D";
  };

  const { mutateAsync: investInLoanMutation, loading: investInLoanLoading } =
    useMutation();

  const handleInvest = async (amount: number) => {
    try {
      if (loanId) {
        await investInLoanMutation(() => loanAPI.investInLoan(loanId, amount));
        setPaymentDialogOpen(false);
        refetchLoan();
        refetchLogsLoan();
        setIsInvesting(true);
        setShowSuccess(true);
      } else {
        throw new Error("Loan ID is missing");
      }
    } catch (error) {
      console.error("Error investing in loan:", error);
      throw error;
    }
  };

  if (loanLoading) {
    return (
      <LenderDashboardLayout>
        <div className="flex flex-col items-center justify-center p-12">
          <p className="text-muted-foreground">Memuat detail pinjaman...</p>
        </div>
      </LenderDashboardLayout>
    );
  }

  if (loanError || !loan) {
    return (
      <LenderDashboardLayout>
        <div className="flex flex-col items-center justify-center p-12">
          <p className="text-red-500 mb-4">Gagal memuat detail pinjaman</p>
          <Button variant="outline" asChild>
            <Link href="/lender/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Marketplace
            </Link>
          </Button>
        </div>
      </LenderDashboardLayout>
    );
  }

  // if (loan?.status === "ACTIVE") {
  //   router.replace("/lender/marketplace");
  //   return null;
  // }

  const remainingAmount = loan.fundingTarget - loan.currentFunding;
  const progress = Math.round((loan.currentFunding / loan.fundingTarget) * 100);
  const loanTitle = loan.purpose + " Loan";
  const companyName = loan.businessDetails?.businessName || "N/A";

  return (
    <LenderDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/lender/marketplace">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{loanTitle}</h1>
              <p className="text-muted-foreground flex items-center gap-1">
                <Building className="h-3 w-3" /> {}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* <Badge className="bg-primary/10 text-primary">{creditRating}</Badge> */}
            <Badge
              className={
                loan.status === "PENDING_APPROVAL"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : ""
              }
            >
              {loan.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ikhtisar Pinjaman</CardTitle>
                <CardDescription>Detail peluang investasi ini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Jumlah Pinjaman
                    </p>
                    <p className="text-xl font-medium">
                      {formatCurrency(loan.amount)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Suku Bunga</p>
                    <p className="text-xl font-medium">
                      {(loan.interestRate * 100).toFixed(2)}% p.a.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Jangka Waktu
                    </p>
                    <p className="text-xl font-medium">{loan.term} bulan</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Tanggal Mulai
                    </p>
                    <p className="text-xl font-medium">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Tanggal Selesai
                    </p>
                    <p className="text-xl font-medium">
                      {new Date(
                        new Date(loan.createdAt).setMonth(
                          new Date(loan.createdAt).getMonth() + loan.term
                        )
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tujuan</p>
                    <p className="text-xl font-medium">{loan.purpose}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Progres Pendanaan</p>
                    <p className="font-medium">{progress}%</p>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>Terdanai: {formatCurrency(loan.currentFunding)}</p>
                    <p>Sisa: {formatCurrency(remainingAmount)}</p>
                  </div>
                </div>

                {/* <div className="rounded-md bg-muted/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Batas Waktu Pendanaan</p>
                      <p className="text-sm text-muted-foreground">
                        7 hari tersisa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <p className="font-medium">
                      {(loan.creditScore / 170).toFixed(1)}/5 Rating
                    </p>
                  </div>
                </div> */}

                {loan.description && (
                  <div className="space-y-2">
                    <p className="font-medium">Deskripsi Bisnis</p>
                    <p className="text-sm text-muted-foreground">
                      {loan.description}
                    </p>
                  </div>
                )}

                {/* <div className="flex items-center justify-between rounded-md border border-border/50 bg-muted/30 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Bisnis Terverifikasi Blockchain</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Lihat Verifikasi
                  </Button>
                </div> */}
              </CardContent>
            </Card>

            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="business">Business Details</TabsTrigger>
                <TabsTrigger value="credit">Credit Score</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="business" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Bisnis</CardTitle>
                    <CardDescription>
                      Informasi tentang {companyName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loan.businessDetails ? (
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Nama</p>
                          <p className="font-medium">
                            {loan.businessDetails.businessName}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Industri
                          </p>
                          <p className="font-medium">
                            {loan.businessDetails.businessType}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Durasi Bisnis
                          </p>
                          <p className="font-medium">
                            {loan.businessDetails.businessDuration}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-8 text-muted-foreground">
                        <p>Detail bisnis tidak tersedia</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="credit" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rincian Skor Kredit</CardTitle>
                    <CardDescription>
                      Komponen yang membentuk skor kredit peminjam
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loan.creditScoreBreakdown ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              Skor Kredit Keseluruhan
                            </p>
                            <p className="font-medium text-green-600">
                              {loan.creditScore}/850
                            </p>
                          </div>
                          <Progress value={loan.creditScore} className="h-2" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Kredit Dasar:
                            </span>
                            <span>
                              {loan.creditScoreBreakdown.baseCredit ?? 300}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Jumlah Terhutang:
                            </span>
                            <span>{loan.creditScoreBreakdown.amountsOwed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Riwayat Kredit:
                            </span>
                            <span>
                              {loan.creditScoreBreakdown.creditHistory}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Campuran Kredit:
                            </span>
                            <span>{loan.creditScoreBreakdown.creditMix}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Kredit Baru:
                            </span>
                            <span>{loan.creditScoreBreakdown.newCredit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Riwayat Pembayaran:
                            </span>
                            <span>
                              {loan.creditScoreBreakdown.paymentHistory}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center p-8 text-muted-foreground">
                        <p>Data rincian skor kredit tidak tersedia</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="logs" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Riwayat Aktivitas Pinjaman
                    </CardTitle>
                    <CardDescription>
                      Lihat semua aktivitas terkait pinjaman Anda yang telah
                      diverifikasi di blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {logsLoanLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                          <p className="text-muted-foreground">
                            Memuat riwayat aktivitas...
                          </p>
                        </div>
                      ) : logsLoanError ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                          <div className="text-center">
                            <p className="text-red-500 font-medium mb-2">
                              Gagal memuat riwayat aktivitas
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Silakan coba lagi nanti
                            </p>
                          </div>
                          <Button
                            onClick={refetchLogsLoan}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Coba Lagi
                          </Button>
                        </div>
                      ) : !logsLoanData.data?.length ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="rounded-full bg-muted p-3 mb-4">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground font-medium">
                            Belum ada riwayat aktivitas
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Aktivitas pinjaman akan muncul di sini
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {logsLoanData.data.map(
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
                                            {log.data.scheduleId.substring(
                                              0,
                                              12
                                            )}
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
                                                    (log.data.creditScore /
                                                      850) *
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
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            {loan.status !== "COMPLETED" && !showSuccess ? (
              <Card>
                <CardHeader>
                  <CardTitle>Investasi di Pinjaman Ini</CardTitle>
                  <CardDescription>Danai peluang bisnis ini</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="investment-amount">Jumlah Investasi</Label>
                    <Input
                      id="investment-amount"
                      type="number"
                      value={investmentAmount}
                      onChange={(e) =>
                        setInvestmentAmount(Number(e.target.value))
                      }
                      min={500}
                      max={remainingAmount}
                      step={100}
                    />
                    <div className="space-y-4">
                      <Slider
                        value={[investmentAmount]}
                        min={500}
                        max={remainingAmount}
                        step={100}
                        onValueChange={(value) => setInvestmentAmount(value[0])}
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatCurrency(500)}</span>
                        <span>
                          {formatCurrency(Math.round(remainingAmount / 2))}
                        </span>
                        <span>{formatCurrency(remainingAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Jumlah Investasi</p>
                      <p className="font-medium">
                        {formatCurrency(investmentAmount)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Suku Bunga Bulanan</p>
                      <p className="font-medium">
                        {(loan.interestRate * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Jangka Waktu</p>
                      <p className="font-medium">{loan.term} bulan</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Perkiraan Pengembalian
                      </p>
                      <p className="font-medium text-primary">
                        {formatCurrency(
                          Math.round(
                            investmentAmount * (loan.interestRate * loan.term)
                          )
                        )}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Total Pembayaran Kembali
                      </p>
                      <p className="font-medium">
                        {formatCurrency(
                          investmentAmount +
                            Math.round(
                              investmentAmount * (loan.interestRate * loan.term)
                            )
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => setPaymentDialogOpen(true)}
                    disabled={isInvesting || investInLoanLoading}
                  >
                    {isInvesting || investInLoanLoading
                      ? "Memproses..."
                      : "Investasi Sekarang"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Dengan berinvestasi, Anda menyetujui syarat dan ketentuan
                    kami. Semua investasi diamankan dan diverifikasi di
                    blockchain.
                  </p>
                </CardFooter>
              </Card>
            ) : null}

            {showSuccess && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                      Investasi Berhasil!
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Investasi Anda telah diproses dan dicatat di blockchain.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-muted/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Jumlah Investasi</p>
                      <p className="font-medium">
                        {formatCurrency(investmentAmount)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">ID Transaksi</p>
                      <p className="font-medium text-xs">0x8f2e54...</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Status</p>
                      <Badge className="bg-green-500/10 text-green-500">
                        Terkonfirmasi
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/lender/marketplace">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke
                      Marketplace
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/lender/investments">Lihat Investasi Saya</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Verifikasi Blockchain</CardTitle>
                <CardDescription>Aman dan transparan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Bisnis Terverifikasi</p>
                    <p className="text-sm text-muted-foreground">
                      Identitas dan kredensial diverifikasi
                    </p>
                  </div>
                </div> */}
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Kontrak Pintar Aman</p>
                    <p className="text-sm text-muted-foreground">
                      Ketentuan pinjaman dan pembayaran otomatis
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Rekaman Tidak Berubah</p>
                    <p className="text-sm text-muted-foreground">
                      Semua transaksi dicatat di blockchain
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <InvestmentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        loanId={loanId}
        loanTitle={loanTitle}
        interestRate={loan.interestRate}
        loanTerm={loan.term}
        initialAmount={investmentAmount}
        minimumInvestment={1}
        maximumInvestment={remainingAmount}
        remainingAmount={remainingAmount}
        wallet={walletDatas}
        onInvestmentSuccess={handleInvest}
        onInvestmentAmountChange={setInvestmentAmount}
      />
    </LenderDashboardLayout>
  );
}
