"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Percent,
} from "lucide-react";
import { formatCurrency } from "@/utils/utils";

interface InvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string | null;
  loanTitle: string;
  interestRate: number;
  loanTerm: number;
  minimumInvestment: number;
  maximumInvestment: number;
  initialAmount: number;
  remainingAmount: number;
  wallet: { walletId: string; userId: string; balance: number } | null;
  onInvestmentSuccess: (amount: number) => Promise<void>;
  onInvestmentAmountChange?: (amount: number) => void;
}

export function InvestmentDialog({
  open,
  onOpenChange,
  loanId,
  loanTitle,
  interestRate,
  loanTerm,
  initialAmount,
  minimumInvestment,
  maximumInvestment,
  remainingAmount,
  wallet,
  onInvestmentSuccess,
  onInvestmentAmountChange,
}: InvestmentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [investmentAmount, setInvestmentAmount] =
    useState<number>(initialAmount);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [transactionId, setTransactionId] = useState<string>("");

  // Sinkronkan investmentAmount dengan initialAmount
  useEffect(() => {
    setInvestmentAmount(initialAmount);
  }, [initialAmount]);

  // Validation checks
  const hasInsufficientBalance =
    !wallet || !wallet.balance || wallet.balance < investmentAmount;
  const isBelowMinimum = investmentAmount < minimumInvestment;
  const isAboveMaximum = investmentAmount > maximumInvestment;
  const isAboveRemaining = investmentAmount > remainingAmount;
  const isAboveWalletBalance =
    !wallet || investmentAmount > (wallet?.balance || 0);

  // Calculate expected returns
  const monthlyReturn = investmentAmount * interestRate;
  const totalReturn = monthlyReturn * loanTerm;
  const totalReceived = investmentAmount + totalReturn;

  // Mock payment methods (based on wallet)
  const paymentMethods = wallet
    ? [
        {
          id: wallet.walletId,
          type: "wallet",
          name: wallet.userId,
          balance: wallet.balance,
          primary: true,
        },
      ]
    : [];

  // Auto-select payment method if only one exists
  useEffect(() => {
    if (paymentMethods.length === 1 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id);
    }
  }, [paymentMethods, paymentMethod]);

  // Validate investment amount
  useEffect(() => {
    const newErrors: string[] = [];

    if (!loanId) {
      newErrors.push("Loan ID is missing.");
    }
    if (isBelowMinimum) {
      newErrors.push(
        `Minimum investment amount is ${formatCurrency(minimumInvestment)}.`
      );
    }
    if (isAboveMaximum) {
      newErrors.push(
        `Maximum investment amount is ${formatCurrency(maximumInvestment)}.`
      );
    }
    if (isAboveRemaining) {
      newErrors.push(
        `Cannot exceed remaining loan amount of ${formatCurrency(
          remainingAmount
        )}.`
      );
    }
    if (isAboveWalletBalance) {
      newErrors.push(
        `Insufficient wallet balance. Available: ${formatCurrency(
          wallet?.balance || 0
        )}.`
      );
    }
    if (!wallet) {
      newErrors.push(
        "No wallet connected. Please connect a wallet to proceed."
      );
    }
    if (interestRate <= 0) {
      newErrors.push("Invalid interest rate.");
    }

    setErrors(newErrors);
  }, [
    investmentAmount,
    minimumInvestment,
    maximumInvestment,
    remainingAmount,
    wallet,
    isAboveWalletBalance,
    isBelowMinimum,
    isAboveMaximum,
    isAboveRemaining,
    loanId,
    interestRate,
  ]);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleInvestmentAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setInvestmentAmount(value);
    onInvestmentAmountChange?.(value);
  };

  const handleSubmit = async () => {
    // Double check validasi sebelum submit
    if (!isFormValid) {
      console.log("Form tidak valid:", {
        loanId: !!loanId,
        wallet: !!wallet,
        paymentMethod: !!paymentMethod,
        investmentAmount,
        isBelowMinimum,
        isAboveMaximum,
        isAboveRemaining,
        hasInsufficientBalance,
        errorsCount: errors.length,
      });
      return;
    }

    setIsProcessing(true);

    try {
      await onInvestmentSuccess(investmentAmount);
      setTransactionId(`0x${Math.random().toString(16).slice(2, 10)}...`);
      setIsProcessing(false);
      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setInvestmentAmount(initialAmount);
        setPaymentMethod(
          paymentMethods.length === 1 ? paymentMethods[0].id : ""
        );
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      setErrors(["Investment failed. Please try again later."]);
      console.error("Investment failed:", error);
    }
  };

  // Fixed form validation logic - lebih ketat
  const isFormValid =
    !!loanId && // harus ada loan ID
    !!wallet && // harus ada wallet
    !!paymentMethod && // harus pilih payment method
    investmentAmount > 0 && // amount harus > 0
    !isBelowMinimum && // tidak boleh di bawah minimum
    !isAboveMaximum && // tidak boleh di atas maximum
    !isAboveRemaining && // tidak boleh melebihi remaining
    !hasInsufficientBalance && // balance harus cukup
    interestRate > 0 && // interest rate harus valid
    errors.length === 0; // tidak boleh ada error

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Investment Successful!</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Your investment of {formatCurrency(investmentAmount)} has been
              processed successfully.
            </p>
            <div className="mt-4 rounded-md bg-muted/30 p-4 w-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm">Transaction ID</p>
                <p className="font-medium text-xs">{transactionId}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Status</p>
                <p className="font-medium text-green-600">Confirmed</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Invest in {loanTitle}</DialogTitle>
              <DialogDescription>Loan ID: {loanId || "N/A"}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Loan Information */}
              <div className="rounded-md bg-muted/30 p-4">
                <p className="text-sm font-medium mb-2">Loan Details</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Interest Rate (Monthly)
                    </p>
                    <p className="font-medium flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      {(interestRate * 100).toFixed(2)}% per month
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Loan Term</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {loanTerm} months
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Remaining Amount
                    </p>
                    <p className="font-medium">
                      {formatCurrency(remainingAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Investment Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="investment-amount">Investment Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="investment-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={investmentAmount}
                    onChange={handleInvestmentAmountChange}
                    className="pl-9"
                    min={minimumInvestment}
                    max={Math.min(
                      maximumInvestment,
                      remainingAmount,
                      wallet?.balance || Infinity
                    )}
                    step={100}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {formatCurrency(minimumInvestment)}</span>
                  <span>
                    Max:{" "}
                    {formatCurrency(
                      Math.min(maximumInvestment, remainingAmount)
                    )}
                  </span>
                </div>
              </div>

              {/* Validation Errors */}
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                {paymentMethods.length > 0 ? (
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-2 rounded-md border p-3 ${
                          hasInsufficientBalance
                            ? "border-destructive/50 bg-destructive/5"
                            : "border-border/50"
                        }`}
                      >
                        <RadioGroupItem
                          value={method.id}
                          id={method.id}
                          disabled={!!hasInsufficientBalance}
                        />
                        <Label
                          htmlFor={method.id}
                          className={`flex flex-1 items-center gap-3 font-normal ${
                            hasInsufficientBalance ? "opacity-60" : ""
                          }`}
                        >
                          <Wallet className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p>{method.name}</p>
                            <p
                              className={`text-sm ${
                                hasInsufficientBalance
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                              }`}
                            >
                              Balance: {formatCurrency(method.balance)}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <p className="text-sm text-destructive">
                    No payment methods available.
                  </p>
                )}
              </div>

              <Separator />

              {/* Investment Summary */}
              <div className="rounded-md bg-muted/30 p-4">
                <p className="text-sm font-medium mb-3">Investment Summary</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Investment Amount
                    </p>
                    <p className="font-medium">
                      {formatCurrency(investmentAmount)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Monthly Return
                    </p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(monthlyReturn)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Total Return
                    </p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(totalReturn)}
                    </p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Total Received</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(totalReceived)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className="text-xs font-medium text-green-600">
                      {investmentAmount > 0
                        ? ((totalReturn / investmentAmount) * 100).toFixed(2)
                        : "0.00"}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isProcessing}
                className={`${
                  !isFormValid || isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isProcessing
                  ? "Processing..."
                  : `Invest ${formatCurrency(investmentAmount)}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
