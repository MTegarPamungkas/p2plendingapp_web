import type { Metadata } from "next"
import { Shield, Lock, Server, Database, FileCheck, AlertTriangle, Clock, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Security | BlockLend",
  description: "Security measures and practices for BlockLend P2P Lending Platform",
}

export default function SecurityPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Security</h1>
          <p className="text-muted-foreground">How we protect your data and assets on the BlockLend platform</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none bg-black/5 dark:bg-white/5">
            <CardHeader className="flex flex-row items-center gap-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Blockchain Security</CardTitle>
                <CardDescription>Hyperledger Fabric implementation</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Our platform is built on Hyperledger Fabric, a permissioned blockchain framework that provides enhanced
                security through private channels, role-based access control, and cryptographic verification of all
                transactions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-black/5 dark:bg-white/5">
            <CardHeader className="flex flex-row items-center gap-4">
              <Lock className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Data Encryption</CardTitle>
                <CardDescription>End-to-end protection</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                All sensitive data is encrypted both in transit and at rest using industry-standard AES-256 encryption.
                Private keys are never stored on our servers and are only accessible to authorized users.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-black/5 dark:bg-white/5">
            <CardHeader className="flex flex-row items-center gap-4">
              <Server className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Infrastructure Security</CardTitle>
                <CardDescription>Secure cloud architecture</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Our platform is hosted on enterprise-grade cloud infrastructure with multiple redundancies, DDoS
                protection, and 24/7 monitoring. We implement network segmentation and firewalls to prevent unauthorized
                access.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-black/5 dark:bg-white/5">
            <CardHeader className="flex flex-row items-center gap-4">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Smart Contract Audits</CardTitle>
                <CardDescription>Rigorous code verification</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                All smart contracts and chaincode are thoroughly audited by independent security firms before
                deployment. We conduct regular security assessments and penetration testing to identify and address
                potential vulnerabilities.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Security Certifications & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>BlockLend maintains the highest standards of security and compliance:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                <span>SOC 2 Type II Certified</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                <span>PCI DSS Compliant</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                <span>AML/KYC Procedures</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                <span>Regular Security Audits</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Multi-Factor Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We require multi-factor authentication for all accounts to provide an additional layer of security. Users
              can choose from various authentication methods:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>SMS verification codes</li>
              <li>Authenticator apps (Google Authenticator, Authy)</li>
              <li>Hardware security keys (YubiKey)</li>
              <li>Biometric authentication (where supported)</li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none bg-black/5 dark:bg-white/5">
            <CardHeader className="flex flex-row items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Fraud Prevention</CardTitle>
                <CardDescription>Advanced detection systems</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Our platform employs machine learning algorithms to detect suspicious activities and prevent fraud. We
                monitor transactions in real-time and implement strict verification procedures for high-value
                transactions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-black/5 dark:bg-white/5">
            <CardHeader className="flex flex-row items-center gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Continuous Monitoring</CardTitle>
                <CardDescription>24/7 security operations</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Our security team monitors the platform around the clock for potential threats. We use advanced threat
                intelligence and automated alerting systems to respond quickly to security incidents.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Bug Bounty Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We maintain an active bug bounty program to encourage security researchers to responsibly disclose
              potential vulnerabilities. This collaborative approach helps us continuously improve our security posture.
            </p>
            <p>If you believe you've found a security vulnerability, please report it to security@blocklend.com.</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Security Best Practices for Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We recommend the following security practices to all BlockLend users:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use a strong, unique password for your BlockLend account</li>
              <li>Enable multi-factor authentication</li>
              <li>Keep your recovery phrases and private keys secure and offline</li>
              <li>Be vigilant about phishing attempts - we will never ask for your password or private keys</li>
              <li>Keep your devices and software up to date</li>
              <li>Review your account activity regularly</li>
              <li>Set up transaction notifications to monitor account activity</li>
            </ul>
          </CardContent>
        </Card>

        <div className="bg-black/5 dark:bg-white/5 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <Users className="h-16 w-16 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Have a security concern?</h3>
            <p className="mb-4">
              Our dedicated security team is available to address any concerns you may have about the security of your
              account or our platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Contact Security Team
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                Report a Vulnerability
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
