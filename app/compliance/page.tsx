import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, CheckCircle, FileText, Lock, Shield } from "lucide-react"

export default function CompliancePage() {
  return (
    <main className="container py-12 space-y-8">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Compliance & Security</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Our platform is built on Hyperledger Fabric blockchain technology, ensuring the highest levels of security,
          transparency, and regulatory compliance.
        </p>
      </div>

      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compliance">Regulatory Compliance</TabsTrigger>
          <TabsTrigger value="security">Security Measures</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Technology</TabsTrigger>
        </TabsList>
        <TabsContent value="compliance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Framework</CardTitle>
              <CardDescription>Our comprehensive approach to regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Anti-Money Laundering (AML)</h3>
                      <p className="text-sm text-muted-foreground">
                        Our platform implements robust AML procedures to prevent financial crimes and ensure all
                        transactions are legitimate.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Know Your Customer (KYC)</h3>
                      <p className="text-sm text-muted-foreground">
                        All users undergo a thorough KYC verification process to confirm their identity before
                        participating in the platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Data Protection</h3>
                      <p className="text-sm text-muted-foreground">
                        We comply with global data protection regulations to safeguard user information and maintain
                        privacy.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Financial Regulations</h3>
                      <p className="text-sm text-muted-foreground">
                        Our platform adheres to all applicable financial regulations and lending laws to ensure legal
                        compliance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Audit Trails</h3>
                      <p className="text-sm text-muted-foreground">
                        All platform activities are recorded with immutable audit trails on the blockchain for
                        regulatory oversight.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Regular Compliance Reviews</h3>
                      <p className="text-sm text-muted-foreground">
                        We conduct regular compliance reviews and updates to stay current with evolving regulatory
                        requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="rounded-md bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Regulatory Partnerships</h3>
                    <p className="text-sm text-muted-foreground">
                      We work closely with regulatory bodies and financial institutions to ensure our platform meets the
                      highest standards of compliance and transparency. Our team includes compliance experts who
                      continuously monitor regulatory changes and update our systems accordingly.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Documentation</CardTitle>
              <CardDescription>Essential documents related to our regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-md border border-border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Terms of Service</h3>
                      <p className="text-sm text-muted-foreground">Last updated: November 2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/terms">View</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Privacy Policy</h3>
                      <p className="text-sm text-muted-foreground">Last updated: November 2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/privacy">View</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">AML Policy</h3>
                      <p className="text-sm text-muted-foreground">Last updated: October 2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">KYC Procedures</h3>
                      <p className="text-sm text-muted-foreground">Last updated: October 2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Infrastructure</CardTitle>
              <CardDescription>Enterprise-grade security measures to protect your data and assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">End-to-End Encryption</h3>
                      <p className="text-sm text-muted-foreground">
                        All data transmitted through our platform is protected with military-grade encryption to prevent
                        unauthorized access.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Multi-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Additional layers of security through multi-factor authentication to verify user identity.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Secure Smart Contracts</h3>
                      <p className="text-sm text-muted-foreground">
                        All loan agreements are executed through secure, audited smart contracts on the Hyperledger
                        Fabric blockchain.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Regular Security Audits</h3>
                      <p className="text-sm text-muted-foreground">
                        Our systems undergo regular security audits by independent third-party experts to identify and
                        address vulnerabilities.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Distributed Architecture</h3>
                      <p className="text-sm text-muted-foreground">
                        Our platform utilizes a distributed architecture to eliminate single points of failure and
                        enhance security.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">24/7 Monitoring</h3>
                      <p className="text-sm text-muted-foreground">
                        Continuous monitoring of our systems to detect and respond to security threats in real-time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="rounded-md bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Security Certifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Our platform has obtained industry-standard security certifications, including ISO 27001 for
                      information security management. We also comply with SOC 2 Type II standards, ensuring our systems
                      meet rigorous security, availability, and confidentiality requirements.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Protection</CardTitle>
              <CardDescription>How we protect your sensitive information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Secure Data Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      All sensitive data is stored in encrypted form using industry-standard encryption algorithms.
                      Access to this data is strictly controlled and monitored.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Data Minimization</h3>
                    <p className="text-sm text-muted-foreground">
                      We collect only the data necessary for the platform's operation, reducing the risk of exposure in
                      the event of a security incident.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Secure Access Controls</h3>
                    <p className="text-sm text-muted-foreground">
                      Strict access controls ensure that only authorized personnel can access sensitive data, with
                      comprehensive audit logs tracking all access attempts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Data Breach Response Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      We maintain a comprehensive data breach response plan to quickly address and mitigate any
                      potential security incidents, including prompt notification to affected users.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hyperledger Fabric Technology</CardTitle>
              <CardDescription>The blockchain foundation of our platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Permissioned Blockchain</h3>
                      <p className="text-sm text-muted-foreground">
                        Hyperledger Fabric is a permissioned blockchain, ensuring that only verified participants can
                        access and interact with the network.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Smart Contracts (Chaincode)</h3>
                      <p className="text-sm text-muted-foreground">
                        Our platform utilizes Hyperledger Fabric's chaincode to create secure, automated smart contracts
                        for loan agreements and repayments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Immutable Ledger</h3>
                      <p className="text-sm text-muted-foreground">
                        All transactions and credit scoring data are recorded on an immutable ledger, ensuring
                        transparency and preventing fraud.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Consensus Mechanism</h3>
                      <p className="text-sm text-muted-foreground">
                        Our implementation uses a practical Byzantine fault tolerance consensus mechanism to validate
                        transactions efficiently and securely.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Private Data Collections</h3>
                      <p className="text-sm text-muted-foreground">
                        Sensitive data is stored in private data collections, ensuring that only authorized parties can
                        access specific information.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Scalable Architecture</h3>
                      <p className="text-sm text-muted-foreground">
                        Our blockchain implementation is designed for high performance and scalability to handle growing
                        transaction volumes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="rounded-md bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Why Hyperledger Fabric?</h3>
                    <p className="text-sm text-muted-foreground">
                      We chose Hyperledger Fabric for our platform because it offers enterprise-grade security, privacy,
                      and performance without the environmental impact of proof-of-work blockchains. Unlike public
                      blockchains associated with cryptocurrencies, Hyperledger Fabric is specifically designed for
                      business applications requiring secure, private transactions between known participants.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credit Scoring on Blockchain</CardTitle>
              <CardDescription>Our innovative approach to credit assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Transparent Scoring Algorithm</h3>
                    <p className="text-sm text-muted-foreground">
                      Our credit scoring algorithm evaluates multiple factors including financial history, business
                      performance, and market conditions, with the methodology transparently documented on the
                      blockchain.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Immutable Credit History</h3>
                    <p className="text-sm text-muted-foreground">
                      All credit-related data and scoring history are recorded on the blockchain, creating an immutable
                      and verifiable credit history for borrowers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Real-time Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Credit scores are updated in real-time as new data becomes available, providing lenders with the
                      most current risk assessment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Data Privacy</h3>
                    <p className="text-sm text-muted-foreground">
                      While credit scores are transparent, the underlying sensitive data remains private and is only
                      shared with authorized parties through secure channels.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button asChild>
                  <Link href="/how-it-works">
                    Learn More About Our Technology <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 p-8 md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Experience Secure P2P Lending?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join our blockchain-powered platform today and benefit from our secure, transparent, and compliant lending
            ecosystem.
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
    </main>
  )
}
