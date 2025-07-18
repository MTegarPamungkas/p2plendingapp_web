"use client";
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
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Shield,
  Wallet,
  Eye,
  RefreshCw,
} from "lucide-react";
import { BorrowerDashboardLayout } from "@/components/borrower-dashboard-layout";
import { PaymentDialog } from "@/components/payment-dialog";
import { loanAPI, walletAPI } from "@/api/apiServices";
import { useAPI, useMutation } from "@/hooks/useAPI";
import { formatCurrency } from "@/utils/utils";

export default function BorrowerLoanDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [loanId, setLoanId] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<
    {
      id: string;
      name: string;
      type: string;
      filePath: string;
      blockchainDocumentId: string;
      userId: string;
      uploadedAt: string;
    }[]
  >([]);
  const { mutateAsync: makePaymentMutation, loading: makePaymentLoading } =
    useMutation();

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

  // Only call repayment schedule API if loan is ACTIVE
  const getRepaymentSchedule = useCallback(() => {
    if (
      !loanId ||
      !loanData?.data ||
      (loanData.data.status !== "ACTIVE" &&
        loanData.data.status !== "COMPLETED")
    ) {
      return Promise.resolve(null);
    }
    return loanAPI.getRepaymentScheduleById(loanId);
  }, [loanId, loanData?.data?.status]);

  const {
    data: repaymentScheduleData,
    loading: repaymentScheduleLoading,
    error: repaymentScheduleError,
    refetch: refetchRepaymentSchedule,
  } = useAPI(getRepaymentSchedule, [loanId, loanData?.data?.status]);

  const getWallet = useCallback(() => walletAPI.getWallet(), []);
  const {
    data: walletData,
    loading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useAPI(getWallet, []);

  // Fetch document details for each supporting document
  useEffect(() => {
    async function fetchDocuments() {
      if (loanData?.data?.supportingDocuments?.length) {
        const docPromises = loanData.data.supportingDocuments.map(
          (docId: string) => loanAPI.getDocumentDetails(docId)
        );
        try {
          const docResponses = await Promise.all(docPromises);
          const fetchedDocs = docResponses.map((res: any) => ({
            id: res.data.id,
            name: res.data.name,
            type: res.data.type,
            filePath: res.data.filePath,
            blockchainDocumentId: res.data.blockchainDocumentId,
            userId: res.data.userId,
            uploadedAt: res.data.uploadedAt,
          }));
          setDocuments(fetchedDocs);
        } catch (error) {}
      }
    }
    fetchDocuments();
  }, [loanData]);

  const loanDatas = loanData?.data;
  const repaymentScheduleDatas = repaymentScheduleData?.data;

  console.log("Repayment Schedule Data:", repaymentScheduleData);
  const walletDatas = walletData?.data;

  const handleMakePayment = async (amount: any) => {
    try {
      const response = await makePaymentMutation(() =>
        walletAPI.makePayment(loanId!, amount)
      );
      if (response) {
        refetchRepaymentSchedule();
        refetchLoan();
        refetchLogsLoan();
        refetchWallet();
      }
    } catch (error) {}
  };

  // Show loading state
  if (loanLoading) {
    return (
      <BorrowerDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Loading loan details...</p>
          </div>
        </div>
      </BorrowerDashboardLayout>
    );
  }

  // Show error state
  if (loanError || !loanDatas) {
    return (
      <BorrowerDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500">Error loading loan details</p>
            <Button onClick={refetchLoan} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </BorrowerDashboardLayout>
    );
  }

  // Process API data
  const loan = {
    id: loanDatas.loanId,
    title: `${loanDatas.purpose} Loan`,
    status: loanDatas.status,
    amount: loanDatas.amount,
    interestRate: loanDatas.interestRate * 100,
    term: loanDatas.term,
    startDate: loanDatas.loanStartDate,
    remainingBalance: loanDatas.amount,
    nextPaymentAmount: Math.round(loanDatas.amount / loanDatas.term),
    purpose: loanDatas.purpose,
    description: `This loan was approved for ${loanDatas.purpose.toLowerCase()} with a credit score of ${
      loanDatas.creditScore
    }/100.`,
    creditScore: loanDatas.creditScore,
    creditScoreBreakdown: loanDatas.creditScoreBreakdown,
    currentFunding: loanDatas.currentFunding,
    fundingTarget: loanDatas.fundingTarget,
    repaymentScheduleId: loanDatas.repaymentScheduleId,
    escrowId: loanDatas.escrowId,
    approvedBy: loanDatas.approvedBy,
    approvedAt: loanDatas.approvedAt,
    fundedAt: loanDatas.fundedAt,
    fundsReleasedAt: loanDatas.fundsReleasedAt,
    lenders:
      loanDatas.applications?.map((app: any, index: number) => ({
        name: `Investor ${String.fromCharCode(65 + index)}`,
        amount: app.amount,
        lenderId: app.lenderId,
        investmentId: app.investmentId,
        timestamp: app.timestamp,
      })) || [],
    supportingDocuments: loanDatas.supportingDocuments,
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-500";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500";
      case "COMPLETED":
        return "bg-blue-500/10 text-blue-500";
      case "DEFAULTED":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  // Check if loan status allows payments
  const canMakePayment =
    loan.status === "ACTIVE" &&
    repaymentScheduleDatas?.installments?.find(
      (i: any) => i.status === "PENDING"
    );

  return (
    <BorrowerDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/borrower/loans">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {loan.title}
              </h1>
              <p className="text-muted-foreground">Loan #{loan.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusBadgeStyle(loan.status)}>
              {loan.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Overview</CardTitle>
                <CardDescription>Details of your current loan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="text-xl font-medium">
                      {formatCurrency(loan.amount)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Interest Rate
                    </p>
                    <p className="text-xl font-medium">
                      {loan.interestRate}% p.a.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Term</p>
                    <p className="text-xl font-medium">{loan.term} months</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="text-xl font-medium">
                      {new Date(loan.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="text-xl font-medium">{loan.purpose}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Credit Score</p>
                      <p className="font-medium text-green-600">
                        {loan.creditScore}/850
                      </p>
                    </div>
                    <Progress value={loan.creditScore} className="h-2" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Base Credit:
                      </span>
                      <span>{loan.creditScoreBreakdown.baseCredit ?? 300}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Amounts Owed:
                      </span>
                      <span>{loan.creditScoreBreakdown.amountsOwed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Credit History:
                      </span>
                      <span>{loan.creditScoreBreakdown.creditHistory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credit Mix:</span>
                      <span>{loan.creditScoreBreakdown.creditMix}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New Credit:</span>
                      <span>{loan.creditScoreBreakdown.newCredit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Payment History:
                      </span>
                      <span>{loan.creditScoreBreakdown.paymentHistory}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Funding Progress</p>
                    <p className="font-medium">
                      {Math.round(
                        (loan.currentFunding / loan.fundingTarget) * 100
                      )}
                      %
                    </p>
                  </div>
                  <Progress
                    value={(loan.currentFunding / loan.fundingTarget) * 100}
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                      Funded:
                      {formatCurrency(loan.currentFunding)}
                    </p>
                    <p>
                      Target:
                      {formatCurrency(loan.fundingTarget)}
                    </p>
                  </div>
                </div>

                {canMakePayment && (
                  <div className="rounded-md bg-muted/30 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Next Payment</p>
                        <p className="text-sm text-muted-foreground">
                          Due on{" "}
                          {new Date(
                            repaymentScheduleDatas?.installments?.find(
                              (i: any) => i.status === "PENDING"
                            )?.dueDate || ""
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xl font-medium text-right">
                        {formatCurrency(
                          repaymentScheduleDatas?.installments?.find(
                            (i: any) => i.status === "PENDING"
                          )?.totalAmount || 0
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="font-medium">Loan Description</p>
                  <p className="text-sm text-muted-foreground">
                    {loan.description}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div className="space-y-2">
                    <p className="font-medium">Funding Details</p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>
                        Approved:{" "}
                        {loan.approvedAt
                          ? new Date(loan.approvedAt).toLocaleString()
                          : "Not yet approved"}
                      </p>
                      <p>
                        Funded:{" "}
                        {loan.fundedAt
                          ? new Date(loan.fundedAt).toLocaleString()
                          : "Not yet funded"}
                      </p>
                      <p>
                        Funds Released:{" "}
                        {loan.fundsReleasedAt
                          ? new Date(loan.fundsReleasedAt).toLocaleString()
                          : "Not yet released"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">References</p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Escrow ID: {loan.escrowId || "N/A"}</p>
                      <p>Schedule ID: {loan.repaymentScheduleId || "N/A"}</p>
                      <p>Approved by: {loan.approvedBy || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="repayments" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="repayments">Repayment Schedule</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="repayments" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Repayment Schedule</CardTitle>
                    <CardDescription>
                      Your scheduled loan repayments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {repaymentScheduleLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <p className="text-muted-foreground">
                            Loading repayment schedule...
                          </p>
                        </div>
                      ) : repaymentScheduleError ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-2">
                          <p className="text-red-500">
                            Jadwal pembayaran belum tersedia, harap coba lagi
                            nanti!
                          </p>
                          <Button
                            onClick={refetchRepaymentSchedule}
                            size="sm"
                            variant="outline"
                          >
                            Retry
                          </Button>
                        </div>
                      ) : (
                        repaymentScheduleDatas?.installments?.map(
                          (installment: any) => (
                            <div
                              key={installment.installmentNumber}
                              className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                            >
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {new Date(
                                    installment.dueDate
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Payment #{installment.installmentNumber}
                                </p>
                                {installment.paidDate && (
                                  <p className="text-xs text-green-500">
                                    Paid on{" "}
                                    {new Date(
                                      installment.paidDate
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {formatCurrency(installment.totalAmount)}
                                </p>
                                <div className="flex gap-2 justify-end">
                                  <Badge
                                    variant={
                                      installment.status === "PAID_ON_TIME"
                                        ? "outline"
                                        : installment.status === "PENDING" &&
                                          new Date(installment.dueDate) <
                                            new Date()
                                        ? "destructive"
                                        : "secondary"
                                    }
                                    className={
                                      installment.status === "PAID_ON_TIME"
                                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                                        : installment.status === "PENDING" &&
                                          new Date(installment.dueDate) <
                                            new Date()
                                        ? "bg-red-500/10 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                        : ""
                                    }
                                  >
                                    {installment.status === "PAID_ON_TIME"
                                      ? "Paid"
                                      : new Date(installment.dueDate) <
                                        new Date()
                                      ? "Overdue"
                                      : "Pending"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Principal:
                                  {formatCurrency(installment.principalAmount)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Interest:
                                  {formatCurrency(installment.interestAmount)}
                                </p>
                              </div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Documents</CardTitle>
                    <CardDescription>
                      Access your loan-related documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documents.length === 0 &&
                      !loan.supportingDocuments?.length ? (
                        <p className="text-muted-foreground">
                          No documents available.
                        </p>
                      ) : documents.length === 0 ? (
                        <p className="text-muted-foreground">
                          Loading documents...
                        </p>
                      ) : (
                        documents.map((document, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <div className="space-y-1">
                                <p className="font-medium">{document.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Type: {document.type}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Added on{" "}
                                  {new Date(
                                    document.uploadedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`http://localhost:5000/${document.filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Eye className="mr-2 h-4 w-4" /> Lihat Dokumen
                              </a>
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
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
                                {/* Header Section */}
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

                                {/* Timestamp */}
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

                                {/* Transaction Details */}
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

                                  {/* Distribution Details */}
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
            {canMakePayment ? (
              <Card>
                <CardHeader>
                  <CardTitle>Make a Payment</CardTitle>
                  <CardDescription>
                    Pay your upcoming installment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Next Payment</p>
                        <p className="text-sm text-muted-foreground">
                          Due on{" "}
                          {new Date(
                            repaymentScheduleDatas.installments.find(
                              (i: any) => i.status === "PENDING"
                            )?.dueDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xl font-medium">
                        {formatCurrency(
                          repaymentScheduleDatas.installments.find(
                            (i: any) => i.status === "PENDING"
                          )?.totalAmount
                        )}
                      </p>
                    </div>
                    <div className="mt-2 text-sm">
                      <p className="text-muted-foreground">
                        Principal:
                        {formatCurrency(
                          repaymentScheduleDatas.installments.find(
                            (i: any) => i.status === "PENDING"
                          )?.principalAmount
                        )}
                      </p>
                      <p className="text-muted-foreground">
                        Interest:
                        {formatCurrency(
                          repaymentScheduleDatas.installments.find(
                            (i: any) => i.status === "PENDING"
                          )?.interestAmount
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    <Wallet className="mr-2 h-4 w-4" /> Make Payment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Make a Payment</CardTitle>
                  <CardDescription>Payment status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-green-500/10 p-4 text-center">
                    <p
                      className={`font-medium ${
                        loan.status === "COMPLETED"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {loan.status === "COMPLETED"
                        ? "All payments completed!"
                        : "No payments available for this loan status."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Contact our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you have any questions or need assistance with your loan,
                  our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>

      {canMakePayment && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          loanId={loan.id!}
          paymentAmount={
            repaymentScheduleDatas?.installments?.find(
              (i: any) => i.status === "PENDING"
            )?.totalAmount || 0
          }
          dueDate={
            repaymentScheduleDatas?.installments?.find(
              (i: any) => i.status === "PENDING"
            )?.dueDate || ""
          }
          interestAmount={
            repaymentScheduleDatas?.installments?.find(
              (i: any) => i.status === "PENDING"
            )?.interestAmount || 0
          }
          principalAmount={
            repaymentScheduleDatas?.installments?.find(
              (i: any) => i.status === "PENDING"
            )?.principalAmount || 0
          }
          wallet={walletDatas}
          onPaymentSuccess={handleMakePayment}
        />
      )}
    </BorrowerDashboardLayout>
  );
}
