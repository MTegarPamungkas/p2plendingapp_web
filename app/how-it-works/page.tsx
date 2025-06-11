import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  How It Works
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Transforming SME Financing Through Blockchain Technology
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover how our P2P lending platform connects SMEs with
                  investors using blockchain-based credit scoring for secure,
                  transparent, and efficient financing.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="space-y-2 text-center">
                      <div className="text-4xl font-bold">P2P Lending</div>
                      <div className="text-xl">Powered by Blockchain</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                The SMELend Process
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform simplifies the lending process while ensuring
                security and transparency for all parties.
              </p>
            </div>

            <Tabs defaultValue="borrowers" className="mx-auto max-w-5xl py-12">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="borrowers">For Borrowers</TabsTrigger>
                <TabsTrigger value="lenders">For Lenders</TabsTrigger>
              </TabsList>
              <TabsContent value="borrowers" className="mt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-bold">Apply</h3>
                        <p className="text-muted-foreground">
                          Complete our streamlined application process,
                          providing basic information about your business and
                          financing needs.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-bold">Get Scored</h3>
                        <p className="text-muted-foreground">
                          Our blockchain-based credit scoring system analyzes
                          your business data to create a fair and comprehensive
                          credit profile.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">3</span>
                        </div>
                        <h3 className="text-xl font-bold">Receive Funding</h3>
                        <p className="text-muted-foreground">
                          Once approved, your loan request is listed on our
                          marketplace where lenders can fund your business.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">4</span>
                        </div>
                        <h3 className="text-xl font-bold">Manage Loan</h3>
                        <p className="text-muted-foreground">
                          Track your loan details, make repayments, and monitor
                          your credit score through our intuitive dashboard.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">5</span>
                        </div>
                        <h3 className="text-xl font-bold">Build Credit</h3>
                        <p className="text-muted-foreground">
                          As you repay your loan, you build a positive credit
                          history on the blockchain, improving your future
                          borrowing terms.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">6</span>
                        </div>
                        <h3 className="text-xl font-bold">Grow Business</h3>
                        <p className="text-muted-foreground">
                          Use the capital to grow your business and return for
                          additional funding as needed with improved terms.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8 flex justify-center">
                  <Link href="/borrower/apply">
                    <Button size="lg">Apply for a Loan</Button>
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value="lenders" className="mt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-bold">Register</h3>
                        <p className="text-muted-foreground">
                          Create an account and complete our verification
                          process to become a lender on our platform.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-bold">Fund Account</h3>
                        <p className="text-muted-foreground">
                          Deposit funds into your secure wallet to start
                          investing in SME loans on our marketplace.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">3</span>
                        </div>
                        <h3 className="text-xl font-bold">
                          Browse Opportunities
                        </h3>
                        <p className="text-muted-foreground">
                          Explore loan opportunities in our marketplace, with
                          transparent risk profiles and blockchain-verified
                          credit scores.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">4</span>
                        </div>
                        <h3 className="text-xl font-bold">Invest</h3>
                        <p className="text-muted-foreground">
                          Choose loans to fund based on your investment criteria
                          and diversify your portfolio across multiple
                          businesses.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">5</span>
                        </div>
                        <h3 className="text-xl font-bold">Track Returns</h3>
                        <p className="text-muted-foreground">
                          Monitor your investments, track repayments, and view
                          your portfolio performance through our intuitive
                          dashboard.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xl font-bold">6</span>
                        </div>
                        <h3 className="text-xl font-bold">Reinvest</h3>
                        <p className="text-muted-foreground">
                          As you receive repayments, reinvest your returns to
                          compound your growth and support more SMEs.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8 flex justify-center">
                  <Link href="/register">
                    <Button size="lg">Become a Lender</Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Blockchain-Based Credit Scoring
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our proprietary credit scoring system leverages blockchain
                technology to create a fair, transparent, and comprehensive
                assessment of SME creditworthiness.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">
                      Traditional Data Sources
                    </h3>
                    <p className="text-muted-foreground">
                      We incorporate traditional financial data while addressing
                      the limitations of conventional credit scoring systems.
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <p>Financial statements and cash flow</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <p>Banking transaction history</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <p>Tax filings and compliance records</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <p>Existing credit history where available</p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">
                      Alternative Data Sources
                    </h3>
                    <p className="text-muted-foreground">
                      We analyze alternative data sources to create a more
                      holistic view of business health and creditworthiness.
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <p>Digital footprint and online presence</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <p>Supply chain relationships and transactions</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <p>Industry-specific performance metrics</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <p>Business growth indicators and milestones</p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Blockchain Advantages</h3>
                    <p className="text-muted-foreground">
                      Our use of Hyperledger Fabric blockchain technology
                      provides significant advantages over traditional credit
                      scoring systems.
                    </p>
                    <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <h4 className="font-medium">Immutability</h4>
                        <p className="text-sm text-muted-foreground">
                          All data points are recorded on the blockchain,
                          creating an immutable credit history that cannot be
                          tampered with.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Transparency</h4>
                        <p className="text-sm text-muted-foreground">
                          The scoring process is transparent, with clear
                          criteria and verifiable data sources, while
                          maintaining privacy.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Security</h4>
                        <p className="text-sm text-muted-foreground">
                          Advanced cryptography ensures that sensitive business
                          data remains secure and is only shared with explicit
                          permission.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Portability</h4>
                        <p className="text-sm text-muted-foreground">
                          Businesses own their credit data and can choose to
                          share it with other financial institutions, creating a
                          portable credit identity.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Real-time Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Credit scores are updated in real-time as new data
                          becomes available, providing a current view of
                          creditworthiness.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Reduced Bias</h4>
                        <p className="text-sm text-muted-foreground">
                          Our algorithm reduces human bias in credit decisions,
                          focusing on objective data points and business
                          performance.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Smart Contracts
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform utilizes smart contracts to automate and secure the
                lending process, ensuring transparency and efficiency.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold">Loan Agreements</h3>
                    <p className="text-muted-foreground">
                      Smart contracts encode loan terms, including interest
                      rates, repayment schedules, and collateral requirements,
                      ensuring all parties agree to the same conditions.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Automated Disbursements
                    </h3>
                    <p className="text-muted-foreground">
                      Once funding goals are met, smart contracts automatically
                      disburse funds to borrowers, eliminating delays and
                      reducing operational costs.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold">Repayment Processing</h3>
                    <p className="text-muted-foreground">
                      Repayments are processed automatically according to the
                      agreed schedule, with funds distributed to lenders
                      proportionally to their investment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our platform today and be part of the future of SME
                financing.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/borrower/apply">
                  <Button size="lg">Apply for a Loan</Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline">
                    Become a Lender
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
