"use client";

import { JSX, useCallback, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  Landmark,
  Wallet,
  Lock,
} from "lucide-react";
import { LenderDashboardLayout } from "@/components/lender-dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { walletAPI } from "@/api/apiServices";
import { useAPI, useMutation } from "@/hooks/useAPI";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function LenderWalletPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const getWallet = useCallback(() => walletAPI.getWallet(), []);
  const {
    data: walletData,
    loading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useAPI(getWallet, []);

  const { mutateAsync: depositMutation, loading: depositLoading } =
    useMutation();

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) < 100000) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is Rp100,000",
        variant: "destructive",
      });
      return;
    }

    setIsDepositing(true);
    try {
      await depositMutation(() => walletAPI.deposit(parseInt(depositAmount)));
      toast({
        title: "Deposit Successful",
        description: `${formatCurrency(
          parseFloat(depositAmount)
        )} has been deposited to your wallet`,
      });
      setDepositAmount("");
      refetchWallet();
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    // if (!withdrawAmount || parseFloat(withdrawAmount) < 100000) {
    //   toast({
    //     title: "Invalid Amount",
    //     description: "Minimum withdrawal amount is Rp100,000",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    if (
      walletData?.data &&
      parseFloat(withdrawAmount) > walletData?.data.balance
    ) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      await walletAPI.withdraw(parseFloat(withdrawAmount));
      toast({
        title: "Withdrawal Successful",
        description: `${formatCurrency(
          parseFloat(withdrawAmount)
        )} withdrawal has been initiated`,
      });
      setWithdrawAmount("");
      refetchWallet();
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatTransactionType = (type: string) => {
    return type.toLowerCase().replace("_", " ");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = (type: string): JSX.Element => {
    switch (type) {
      case "DEPOSIT":
      case "PAYMENT_DISTRIBUTION":
        return <ArrowDown className="h-5 w-5 text-green-500" />;
      case "WITHDRAWAL":
        return <ArrowUp className="h-5 w-5 text-red-500" />;
      case "ESCROW_LOCK":
        return <Lock className="h-5 w-5 text-blue-500" />;
      case "ESCROW_RELEASE":
        return <Wallet className="h-5 w-5 text-green-500" />;
      case "LOAN_PAYMENT":
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <Wallet className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTransactionColor = (type: string): string => {
    switch (type) {
      case "DEPOSIT":
      case "PAYMENT_DISTRIBUTION":
        return "bg-green-500/10";
      case "WITHDRAWAL":
        return "bg-red-500/10";
      case "ESCROW_LOCK":
        return "bg-blue-500/10";
      case "ESCROW_RELEASE":
        return "bg-green-500/10";
      case "LOAN_PAYMENT":
        return "bg-purple-500/10";
      default:
        return "bg-yellow-500/10";
    }
  };

  const getAmountColor = (type: string): string => {
    switch (type) {
      case "DEPOSIT":
      case "PAYMENT_DISTRIBUTION":
      case "ESCROW_RELEASE":
        return "text-green-500";
      case "WITHDRAWAL":
      case "ESCROW_LOCK":
      case "LOAN_PAYMENT":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getAmountPrefix = (type: string): string => {
    const positiveTypes = ["DEPOSIT", "PAYMENT_DISTRIBUTION", "ESCROW_RELEASE"];
    const negativeTypes = ["WITHDRAWAL", "ESCROW_LOCK", "LOAN_PAYMENT"];
    return positiveTypes.includes(type)
      ? "+"
      : negativeTypes.includes(type)
      ? "-"
      : "";
  };

  const getTransactionDetails = (transaction: any): string => {
    if (transaction.sourceDetails) {
      const { type, loanId, paymentId, installmentNumber } =
        transaction.sourceDetails;
      switch (type) {
        case "LOAN_FUNDING":
          return `Loan ID: ${loanId}`;
        case "LOAN_DISBURSEMENT":
          return `Loan ID: ${loanId}`;
        case "INSTALLMENT_PAYMENT":
          return `Loan ID: ${loanId}, Installment #${installmentNumber}`;
        case "LOAN_REPAYMENT":
          return `Loan ID: ${loanId}, Payment ID: ${paymentId}`;
        default:
          return "";
      }
    }
    return "";
  };

  if (walletLoading) {
    return (
      <LenderDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading wallet...</p>
          </div>
        </div>
      </LenderDashboardLayout>
    );
  }

  if (walletError || !walletData?.data) {
    return (
      <LenderDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive">Error loading wallet data</p>
            <Button onClick={refetchWallet} className="mt-2">
              Try Again
            </Button>
          </div>
        </div>
      </LenderDashboardLayout>
    );
  }

  return (
    <LenderDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your funds and transactions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Balance Overview</CardTitle>
              <CardDescription>
                Your current wallet balance and funds allocation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-muted/50 p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Balance
                </p>
                <p className="text-4xl font-bold">
                  {formatCurrency(walletData?.data.balance)}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
                <div className="rounded-lg border border-border/50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Available
                    </p>
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatCurrency(walletData?.data.balance)}
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Wallet ID
                    </p>
                    <Wallet className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="mt-2 text-sm font-mono truncate">
                    {walletData?.data.walletId}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  className="flex-1"
                  onClick={() => setActiveTab("deposit")}
                >
                  <ArrowDown className="mr-2 h-4 w-4" /> Deposit Funds
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setActiveTab("withdraw")}
                >
                  <ArrowUp className="mr-2 h-4 w-4" /> Withdraw Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Your linked payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.bankAccounts.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.bankName}</p>
                        {method.isPrimary && (
                          <Badge variant="outline">Primary</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.accountNumber}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Recent Transactions</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent wallet activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {walletData?.data.transactionHistory &&
                  walletData?.data.transactionHistory.length > 0 ? (
                    walletData?.data.transactionHistory
                      .sort(
                        (
                          a: { timestamp: string | number | Date },
                          b: { timestamp: string | number | Date }
                        ) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      )
                      .map((transaction: any) => (
                        <div
                          key={transaction.transactionId}
                          className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${getTransactionColor(
                                transaction.type
                              )}`}
                            >
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.description ||
                                  formatTransactionType(transaction.type)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  transaction.timestamp
                                ).toLocaleDateString()}
                                {getTransactionDetails(transaction) &&
                                  ` • ${getTransactionDetails(transaction)}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${getAmountColor(
                                transaction.type
                              )}`}
                            >
                              {getAmountPrefix(transaction.type)}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                            >
                              completed
                            </Badge>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No transactions yet
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="deposit" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>Add money to your wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="amount"
                      placeholder="0"
                      className="pl-10"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      type="number"
                      min="100000"
                    />
                  </div>
                  {/* <p className="text-sm text-muted-foreground">
                    Minimum deposit: Rp100,000
                  </p> */}
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup defaultValue="pm-001" className="space-y-3">
                    {user?.bankAccounts.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-2 rounded-md border border-border/50 p-3"
                      >
                        <RadioGroupItem
                          value={method.id.toLowerCase()}
                          checked={method.isPrimary}
                          id={method.id.toLowerCase()}
                        />
                        <Label
                          htmlFor={method.id.toLowerCase()}
                          className="flex flex-1 items-center gap-3 font-normal"
                        >
                          <div>
                            <p>{method.bankName}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.accountNumber}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="rounded-md bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Deposit Summary</p>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          {formatCurrency(parseFloat(depositAmount) || 0)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Processing Fee
                        </p>
                        <p className="font-medium">{formatCurrency(0)}</p>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Total</p>
                        <p className="font-medium">
                          {formatCurrency(parseFloat(depositAmount) || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleDeposit}
                    disabled={
                      isDepositing ||
                      !depositAmount ||
                      parseFloat(depositAmount) < 100000
                    }
                  >
                    {isDepositing ? "Processing..." : "Deposit Funds"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="withdraw" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                  Transfer money to your bank account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Available Balance</p>
                    <p className="font-medium">
                      {formatCurrency(walletData?.data.balance)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">Amount</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="withdraw-amount"
                      placeholder="0"
                      className="pl-10"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      type="number"
                      min="0"
                      max={walletData?.data.balance}
                    />
                  </div>
                  <div className="flex justify-between">
                    {/* <p className="text-sm text-muted-foreground">
                      Minimum withdrawal: Rp100,000
                    </p> */}
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm"
                      onClick={() =>
                        setWithdrawAmount(walletData?.data.balance.toString())
                      }
                    >
                      Withdraw All
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Destination Account</Label>
                  <Select
                    defaultValue={
                      user?.bankAccounts
                        .find((method) => method.isPrimary)
                        ?.id.toLowerCase() ||
                      user?.bankAccounts[0]?.id.toLowerCase() ||
                      ""
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank account" />
                    </SelectTrigger>
                    <SelectContent>
                      {user?.bankAccounts.map((method) => (
                        <SelectItem
                          key={method.id}
                          value={method.id.toLowerCase()}
                        >
                          {method.bankName} ({method.accountNumber})
                        </SelectItem>
                      ))}
                      {/* <SelectItem value="new">Add New Bank Account</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="rounded-md bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Withdrawal Summary</p>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          {formatCurrency(parseFloat(withdrawAmount) || 0)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Processing Fee
                        </p>
                        <p className="font-medium">{formatCurrency(0)}</p>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Total</p>
                        <p className="font-medium">
                          {formatCurrency(parseFloat(withdrawAmount) || 0)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Estimated Arrival
                        </p>
                        <p className="text-sm">1-3 Business Days</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleWithdraw}
                    disabled={
                      isWithdrawing ||
                      !withdrawAmount ||
                      // parseFloat(withdrawAmount) < 100000 ||
                      parseFloat(withdrawAmount) > walletData?.data.balance
                    }
                  >
                    {isWithdrawing ? "Processing..." : "Withdraw Funds"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LenderDashboardLayout>
  );
}
