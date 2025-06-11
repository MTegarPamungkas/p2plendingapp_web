"use client";

import type React from "react";

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
  CreditCard,
  Landmark,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "@/utils/utils";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string;
  paymentAmount: number;
  interestAmount?: number;
  principalAmount?: number;
  wallet: any;
  onPaymentSuccess?: (amount: number) => void;
  dueDate: string;
}

export function PaymentDialog({
  open,
  onOpenChange,
  loanId,
  paymentAmount,
  interestAmount,
  principalAmount,
  wallet,
  dueDate,
  onPaymentSuccess,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if wallet has sufficient balance
  const hasInsufficientBalance = wallet?.balance < paymentAmount;

  // Mock payment methods
  const paymentMethods = [
    {
      id: wallet?.walletId,
      type: "wallet",
      name: wallet?.userId,
      balance: wallet?.balance,
      primary: true,
    },
  ];

  // Auto-select payment method when there's only one option
  useEffect(() => {
    if (paymentMethods.length === 1) {
      setPaymentMethod(paymentMethods[0].id);
    }
  }, [wallet?.walletId]); // Re-run when wallet changes

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleSubmit = async () => {
    // Prevent payment if insufficient balance
    if (hasInsufficientBalance) {
      return;
    }

    setIsProcessing(true);

    try {
      // Panggil onPaymentSuccess dengan amount (yang akan trigger handleMakePayment)
      if (onPaymentSuccess) {
        await onPaymentSuccess(paymentAmount);
      }

      setIsProcessing(false);
      setIsSuccess(true);

      onOpenChange(false);
    } catch (error) {
      setIsProcessing(false);
      // Handle error - bisa tambahkan state untuk error
      console.error("Payment failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium">Payment Successful!</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Your payment of {formatCurrency(paymentAmount)} has been processed
              successfully.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="px-0 pt-0">
              <DialogTitle>Make a Payment</DialogTitle>
              <DialogDescription>
                Pay your loan installment for {loanId}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 overflow-y-auto pr-1">
              <div className="rounded-md bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="font-medium">
                    {new Date(dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm font-medium">Amount Due</p>
                  <p className="font-medium">{formatCurrency(paymentAmount)}</p>
                </div>
              </div>

              {/* Insufficient Balance Alert */}
              {hasInsufficientBalance && (
                <Alert className="border-destructive/50 text-destructive dark:border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient balance. You need{" "}
                    {formatCurrency(paymentAmount - wallet?.balance)} more to
                    complete this payment. Please top up your wallet first.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Payment Method</Label>
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
                        disabled={hasInsufficientBalance}
                      />
                      <Label
                        htmlFor={method.id}
                        className={`flex flex-1 items-center gap-3 font-normal ${
                          hasInsufficientBalance ? "opacity-60" : ""
                        }`}
                      >
                        {method.type === "bank" ? (
                          <Landmark className="h-5 w-5 text-primary" />
                        ) : method.type === "card" ? (
                          <CreditCard className="h-5 w-5 text-primary" />
                        ) : (
                          <Wallet className="h-5 w-5 text-primary" />
                        )}
                        <div className="flex-1">
                          <p>{method.name}</p>
                          {method.type === "wallet" ? (
                            <p
                              className={`text-sm ${
                                hasInsufficientBalance
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                              }`}
                            >
                              Balance: {formatCurrency(method.balance)}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {/* Account number is not available for this payment method */}
                            </p>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="rounded-md bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Payment Summary</p>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Principal</p>
                    <p className="font-medium">
                      {formatCurrency(principalAmount || 0)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Interest</p>
                    <p className="font-medium">
                      {formatCurrency(interestAmount || 0)}
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
                    <p className="font-medium">Total Payment</p>
                    <p className="font-medium">
                      {formatCurrency(paymentAmount || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="px-0 pb-0">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isProcessing || hasInsufficientBalance}
                className={
                  hasInsufficientBalance ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                {isProcessing ? "Processing..." : "Make Payment"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
