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
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  LockKeyhole,
  Shield,
  Wallet,
} from "lucide-react";

import { usePublicAPI, useMutation } from "../hooks/useAPI";
import { userAPI, systemAPI } from "../api/apiServices";
import { useCallback } from "react";

export default function Home() {
  const getMetrics = useCallback(() => systemAPI.getSystemMetrics(), []);
  const {
    data: metricsData,
    loading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = usePublicAPI(getMetrics, []);

  // Mutation hooks
  //  const { mutate: deleteUserMutation, loading: deleteUserLoading } = useMutation<void, string>();
  //  const { mutate: createPostMutation, loading: createPostLoading } = useMutation();
  // const handleDeleteUser = async (userId: string): Promise<void> => {
  //   if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

  //   const result = await deleteUserMutation(userAPI.deleteUser, userId);
  //   if (result.data) {
  //     refetchUsers(); // Refresh data setelah delete
  //   } else {
  //     alert('Gagal menghapus user: ' + result.error);
  //   }
  // };

  // const handleCreatePost = async (): Promise<void> => {
  //   if (!user) return;

  //   const newPost = {
  //     title: 'Post Baru',
  //     content: 'Konten post baru',
  //     userId: user.id
  //   };

  //   const result = await createPostMutation(postAPI.createPost, newPost);
  //   if (result.data) {
  //     refetchPosts(); // Refresh data setelah create
  //   } else {
  //     alert('Gagal membuat post: ' + result.error);
  //   }
  // };

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="hexagon-pattern absolute inset-0 z-0"></div>
        <div className="container relative z-10 py-20 md:py-32">
          <div className="grid gap-8 px-4 md:grid-cols-2 md:gap-12 items-center">
            <div className="space-y-6">
              <Badge className="px-3 py-1 text-sm" variant="secondary">
                Blockchain-Powered
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                P2P Lending for <span className="text-gradient">SMEs</span> with
                Blockchain Credit Scoring
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect SMEs with investors through a secure, transparent, and
                efficient lending platform powered by Hyperledger Fabric
                blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/borrower/apply">Apply for Funding</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/lender/marketplace">Start Investing</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative  mx-auto aspect-square max-w-md overflow-hidden  rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 p-2 shadow-xl glow">
                <div className="grid-pattern absolute  inset-0 "></div>
                <div className="relative z-10 h-full rounded-md bg-card/80 p-6 backdrop-blur-sm">
                  <div className="md:space-y-6 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Credit Score</h3>
                        <p className="text-sm text-muted-foreground">
                          Blockchain Verified
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary"
                      >
                        A+
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Good</span>
                        <span>750/850</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-xs text-muted-foreground">
                          Base Credit
                        </div>
                        <div className="text-lg font-medium">300</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-xs text-muted-foreground">
                          Amounts Owed
                        </div>
                        <div className="text-lg font-medium">160</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-xs text-muted-foreground">
                          Payment History
                        </div>
                        <div className="text-lg font-medium">150</div>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <div className="text-xs text-muted-foreground">
                          New Credit
                        </div>
                        <div className="text-lg font-medium">27,5</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Verified by
                        </div>
                        <div className="text-sm font-medium">
                          Hyperledger Fabric
                        </div>
                      </div>
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-20 px-4">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4" variant="outline">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Blockchain-Powered P2P Lending
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform leverages Hyperledger Fabric blockchain technology to
              create a secure, transparent, and efficient lending ecosystem.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Smart Loan Contracts</CardTitle>
                <CardDescription>
                  Automated loan agreements with built-in compliance and
                  enforcement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Self-executing loan terms</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Transparent repayment tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Automated disbursements</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  asChild
                >
                  <Link href="/how-it-works">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Decentralized Marketplace</CardTitle>
                <CardDescription>
                  Connect SMEs with investors in a secure and transparent
                  environment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Verified business profiles</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Risk-based loan matching</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Diversified investment options</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  asChild
                >
                  <Link href="/lender/marketplace">
                    Explore marketplace <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Fast Processing</CardTitle>
                <CardDescription>
                  Streamlined application and approval process for quick
                  funding.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>24-hour application review</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Automated verification checks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Same-day fund disbursement</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  asChild
                >
                  <Link href="/borrower/apply">
                    Apply now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4" variant="outline">
              Process
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our blockchain-powered platform simplifies the lending process for
              both SMEs and investors.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="space-y-12">
              <h3 className="text-xl font-bold">For Borrowers</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">Apply</h4>
                    <p className="text-muted-foreground">
                      Complete our streamlined application process and submit
                      your business documentation.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">Get Scored</h4>
                    <p className="text-muted-foreground">
                      Our blockchain-based algorithm analyzes your business data
                      to generate a transparent credit score.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">Receive Funding</h4>
                    <p className="text-muted-foreground">
                      Once approved, your loan is listed on our marketplace
                      where lenders can fund your request.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    4
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">Repay</h4>
                    <p className="text-muted-foreground">
                      Make scheduled repayments through our platform, building
                      your credit history on the blockchain.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button asChild>
                  <Link href="/borrower/apply">Apply for a Loan</Link>
                </Button>
              </div>
            </div>
            <div className="space-y-12">
              <h3 className="text-xl font-bold">For Lenders</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    1
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">Register</h4>
                    <p className="text-muted-foreground">
                      Create an account and complete our KYC process to start
                      investing.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    2
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">
                      Browse Opportunities
                    </h4>
                    <p className="text-muted-foreground">
                      Explore our marketplace of verified SMEs with transparent
                      blockchain-verified credit scores.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    3
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">Invest</h4>
                    <p className="text-muted-foreground">
                      Fund loans partially or fully based on your investment
                      strategy and risk tolerance.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    4
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">Earn Returns</h4>
                    <p className="text-muted-foreground">
                      Receive principal and interest payments automatically as
                      borrowers make repayments.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button asChild>
                  <Link href="/lender/marketplace">Start Investing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4" variant="outline">
              Platform Stats
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Growing Ecosystem
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join our thriving community of SMEs and investors.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 px-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold">
                  {metricsData ? `${metricsData.totalLoanAmount}+` : "N/A"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-lg">
                  Total Loans Funded
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold">
                  {metricsData ? `${metricsData.activeLoans}+` : "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Total Active Loans
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold">
                  {metricsData ? `${metricsData.totalUsers}+` : "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Total Verified Users
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold">
                  {metricsData ? `${metricsData.completedLoans}+` : "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Total Completed Loans
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 p-8 md:p-12 lg:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Transform SME Financing?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join our blockchain-powered P2P lending platform today and
                experience the future of SME financing.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">Create an Account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
