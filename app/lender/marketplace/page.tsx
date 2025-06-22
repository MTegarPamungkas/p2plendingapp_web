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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Building, Shield, Star, Loader2 } from "lucide-react";
import { LenderDashboardLayout } from "@/components/lender-dashboard-layout";
import { useCallback, useState } from "react";
import { loanAPI } from "@/api/apiServices";
import { useAPI } from "@/hooks/useAPI";
import { PaymentDialog } from "@/components/payment-dialog";

interface Loan {
  loanId: string;
  amount: number;
  term: number;
  purpose: string;
  interestRate: number;
  currentFunding: number;
  fundingTarget: number;
  creditScore: number;
  creditScoreBreakdown: any;
  status: string;
  createdAt: string;
  applications: any[];
  payments: any[];
}

export default function LenderMarketplacePage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCreditRating = (creditScore: number) => {
    const config = {
      interestRateMin: 0.05, // Example: 5%, adjust as needed
      interestRateMax: 0.15, // Example: 15%, adjust as needed
    };

    let riskCategory: string;
    let recommendedInterestRate: number;
    let color: string;

    if (creditScore >= 800) {
      riskCategory = "EXCELLENT";
      recommendedInterestRate = config.interestRateMin;
      color = "bg-green-100 text-green-800";
    } else if (creditScore >= 740) {
      riskCategory = "VERY_GOOD";
      recommendedInterestRate = config.interestRateMin + 0.02;
      color = "bg-green-100 text-green-800";
    } else if (creditScore >= 670) {
      riskCategory = "GOOD";
      recommendedInterestRate =
        (config.interestRateMin + config.interestRateMax) / 2;
      color = "bg-blue-100 text-blue-800";
    } else if (creditScore >= 580) {
      riskCategory = "FAIR";
      recommendedInterestRate = config.interestRateMax - 0.02;
      color = "bg-yellow-100 text-yellow-800";
    } else {
      riskCategory = "POOR";
      recommendedInterestRate = config.interestRateMax;
      color = "bg-red-100 text-red-800";
    }

    return { rating: riskCategory, color, recommendedInterestRate };
  };

  const calculateProgress = (currentFunding: number, fundingTarget: number) => {
    return Math.round((currentFunding / fundingTarget) * 100);
  };

  const generateCompanyName = (borrowerId: string) => {
    // Generate a mock company name based on borrowerId
    const companies = [
      "TechGrow Inc.",
      "Fashion Forward Ltd.",
      "Gourmet Delights",
      "Precision Parts Co.",
      "MediCare Solutions",
      "Digital Trends Shop",
      "Green Energy Corp.",
      "Smart Solutions Ltd.",
      "Innovation Hub Inc.",
      "Future Tech Co.",
    ];
    const index = parseInt(borrowerId.slice(-1)) % companies.length;
    return companies[index] || "Business Enterprise";
  };

  const getLoans = useCallback(() => loanAPI.getAvailableLoansForFunding(), []);
  const {
    data: loansData,
    loading: loansLoading,
    error: loansError,
    refetch: refetchLoans,
  } = useAPI(getLoans, []);

  const loans = loansData?.data || [];

  if (loansLoading) {
    return (
      <LenderDashboardLayout>
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading loan opportunities...</p>
        </div>
      </LenderDashboardLayout>
    );
  }

  if (loansError) {
    return (
      <LenderDashboardLayout>
        <div className="flex flex-col items-center justify-center p-12">
          <p className="text-red-500 mb-4">Failed to load loan opportunities</p>
          <Button onClick={refetchLoans} variant="outline">
            Try Again
          </Button>
        </div>
      </LenderDashboardLayout>
    );
  }

  return (
    <LenderDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Loan Marketplace
            </h1>
            <p className="text-muted-foreground">
              Browse verified loan opportunities with blockchain-backed credit
              scores
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">Loans ({loans.length})</TabsTrigger>
              </TabsList>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="interest-high">
                    Highest Interest
                  </SelectItem>
                  <SelectItem value="interest-low">Lowest Interest</SelectItem>
                  <SelectItem value="amount-high">Highest Amount</SelectItem>
                  <SelectItem value="amount-low">Lowest Amount</SelectItem>
                  <SelectItem value="term-short">Shortest Term</SelectItem>
                  <SelectItem value="term-long">Longest Term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="all" className="mt-6">
              {loans.length === 0 ? (
                <div className="flex items-center justify-center p-12 text-muted-foreground">
                  <p>No loan opportunities available at the moment.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {loans.map((loan: Loan) => {
                      const creditRating = getCreditRating(loan.creditScore);
                      const progress = calculateProgress(
                        loan.currentFunding,
                        loan.fundingTarget
                      );
                      const companyName = generateCompanyName(loan.purpose);
                      const loanTitle = loan.purpose + " Loan";

                      return (
                        <Card key={loan.loanId}>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle>{loanTitle}</CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                  <Building className="h-3 w-3" /> {companyName}
                                </CardDescription>
                              </div>
                              <Badge className={creditRating.color}>
                                {loan.creditScore} ({creditRating.rating})
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Loan Amount
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
                                  {loan.interestRate}% p.a.
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
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Purpose
                                </span>
                                <span className="font-medium">
                                  {loan.purpose}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>Funding Progress</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                  {formatCurrency(loan.currentFunding)} funded
                                </span>
                                <span>
                                  {formatCurrency(
                                    loan.fundingTarget - loan.currentFunding
                                  )}{" "}
                                  remaining
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-border/50 bg-muted/30 p-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3 text-primary" />
                                <span>Blockchain Verified</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span>
                                  {(loan.creditScore / 170).toFixed(1)}/5
                                </span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" asChild>
                              <Link href={`/lender/marketplace/${loan.loanId}`}>
                                View Opportunity
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>

                  {/* {loans.length > 0 && (
                    <div className="mt-6 flex items-center justify-center">
                      <Button variant="outline">
                        Load More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )} */}
                </>
              )}
            </TabsContent>

            <TabsContent value="new" className="mt-6">
              <div className="flex items-center justify-center p-12 text-muted-foreground">
                <p>Loading new listings...</p>
              </div>
            </TabsContent>

            <TabsContent value="popular" className="mt-6">
              <div className="flex items-center justify-center p-12 text-muted-foreground">
                <p>Loading popular listings...</p>
              </div>
            </TabsContent>

            <TabsContent value="ending" className="mt-6">
              <div className="flex items-center justify-center p-12 text-muted-foreground">
                <p>Loading ending soon listings...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </LenderDashboardLayout>
  );
}
