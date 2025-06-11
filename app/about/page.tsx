import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  About SMELend
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Revolutionizing SME Financing Through Blockchain Technology
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SMELend is a pioneering P2P lending platform dedicated to
                  empowering small and medium enterprises with accessible
                  financing through blockchain-based credit scoring.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] overflow-hidden rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full bg-primary">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary-foreground">
                          P2P
                        </span>
                      </div>
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
                Our Mission & Vision
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We're on a mission to bridge the financing gap for SMEs by
                leveraging blockchain technology to create a transparent,
                secure, and efficient lending ecosystem.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Our Mission</h3>
                    <p className="text-muted-foreground">
                      To democratize access to capital for small and medium
                      enterprises by creating a transparent, secure, and
                      efficient P2P lending platform powered by blockchain
                      technology.
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>
                          Provide affordable financing options for underserved
                          SMEs
                        </p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>
                          Create investment opportunities with competitive
                          returns for lenders
                        </p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>
                          Leverage blockchain for transparent and secure
                          transactions
                        </p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Our Vision</h3>
                    <p className="text-muted-foreground">
                      To become the leading global platform for SME financing,
                      where businesses can access capital quickly and investors
                      can support real economic growth with confidence.
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>
                          A world where all viable SMEs have access to fair and
                          transparent financing
                        </p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>
                          Blockchain-based credit scoring that eliminates bias
                          and reduces risk
                        </p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>
                          A global community of lenders and borrowers driving
                          economic growth
                        </p>
                      </li>
                    </ul>
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
                Our Team
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Meet the passionate experts behind SMELend who are dedicated to
                transforming SME financing.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                    <span className="text-4xl font-bold">JD</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Jane Doe</h3>
                  <p className="text-sm text-muted-foreground">
                    CEO & Co-Founder
                  </p>
                  <p className="text-sm">
                    Former fintech executive with 15+ years of experience in
                    financial inclusion initiatives.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                    <span className="text-4xl font-bold">JS</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">John Smith</h3>
                  <p className="text-sm text-muted-foreground">
                    CTO & Co-Founder
                  </p>
                  <p className="text-sm">
                    Blockchain architect with expertise in Hyperledger Fabric
                    and distributed systems.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                    <span className="text-4xl font-bold">AK</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Alice Kim</h3>
                  <p className="text-sm text-muted-foreground">
                    Chief Risk Officer
                  </p>
                  <p className="text-sm">
                    Risk management specialist with background in credit scoring
                    and financial analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Values
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The core principles that guide everything we do at SMELend.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Transparency</h3>
                    <p className="text-muted-foreground">
                      We believe in complete transparency in all our operations,
                      from credit scoring to fee structures. Our blockchain
                      technology ensures all transactions are verifiable and
                      immutable.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Innovation</h3>
                    <p className="text-muted-foreground">
                      We continuously push the boundaries of what's possible in
                      P2P lending by leveraging cutting-edge blockchain
                      technology and data science to create better outcomes for
                      all stakeholders.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Inclusion</h3>
                    <p className="text-muted-foreground">
                      We're committed to financial inclusion, providing access
                      to capital for viable SMEs that may be overlooked by
                      traditional financial institutions due to outdated credit
                      assessment methods.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Security</h3>
                    <p className="text-muted-foreground">
                      We prioritize the security of our platform and user data,
                      implementing robust measures to protect against threats
                      and ensure compliance with regulatory requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Community</h3>
                    <p className="text-muted-foreground">
                      We foster a community of borrowers and lenders who share
                      our vision of creating economic opportunities through fair
                      and transparent financing.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Integrity</h3>
                    <p className="text-muted-foreground">
                      We conduct our business with the highest ethical
                      standards, ensuring that all stakeholders are treated
                      fairly and with respect.
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
                Our Technology
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Powered by Hyperledger Fabric, our platform leverages blockchain
                technology to revolutionize SME financing.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">
                      Blockchain-Based Credit Scoring
                    </h3>
                    <p className="text-muted-foreground">
                      Our proprietary credit scoring system leverages blockchain
                      technology to create a comprehensive and tamper-proof
                      credit profile for SMEs, incorporating traditional and
                      alternative data sources.
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>Immutable record of financial transactions</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>Integration with multiple data sources</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>AI-powered risk assessment</p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold">Smart Contracts</h3>
                    <p className="text-muted-foreground">
                      Our platform utilizes smart contracts to automate loan
                      agreements, repayments, and collections, reducing
                      operational costs and ensuring transparent execution of
                      terms.
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>Automated loan disbursement and repayments</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>Transparent terms and conditions</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <p>Reduced operational costs</p>
                      </li>
                    </ul>
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
                Join Our Journey
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Be part of the financial revolution that's empowering SMEs and
                creating opportunities for investors.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline">
                    Learn More
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
