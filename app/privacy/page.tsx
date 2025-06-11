import type { Metadata } from "next"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy Policy | BlockLend",
  description: "Privacy Policy for BlockLend P2P Lending Platform",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: May 22, 2025</p>
        </div>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              At BlockLend, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website and use our P2P lending platform.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
              please do not access the site.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Personal Data</h3>
              <p>We may collect personal identification information, including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name, email address, and phone number</li>
                <li>Date of birth and national identification numbers</li>
                <li>Business information for SME borrowers</li>
                <li>Financial information necessary for credit assessment</li>
                <li>Blockchain wallet addresses</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Usage Data</h3>
              <p>We may also collect information on how the service is accessed and used. This data may include:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Computer's Internet Protocol address (IP address)</li>
                <li>Browser type and version</li>
                <li>Pages of our service that you visit</li>
                <li>Time and date of your visit</li>
                <li>Time spent on those pages</li>
                <li>Device identifiers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Use of Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the information we collect for various purposes, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis to improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To fulfill any other purpose for which you provide it</li>
              <li>To carry out our obligations and enforce our rights</li>
              <li>To evaluate creditworthiness and risk profiles</li>
              <li>To facilitate blockchain-based transactions</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Blockchain Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Please note that blockchain transactions are public by nature. While we implement privacy-preserving
              techniques within our Hyperledger Fabric implementation, certain transaction data may be visible to
              participants in the network. We take measures to ensure sensitive personal and financial information is
              encrypted and protected.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Disclosure of Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We may disclose your personal information in the following situations:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets.
              </li>
              <li>
                <strong>To Affiliates:</strong> We may share your information with our affiliates, in which case we will
                require those affiliates to honor this Privacy Policy.
              </li>
              <li>
                <strong>To Business Partners:</strong> We may share your information with our business partners to offer
                you certain products, services, or promotions.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with
                your consent.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information where required to do so by law or
                in response to valid requests by public authorities.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Security of Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The security of your data is important to us, but remember that no method of transmission over the
              Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable
              means to protect your personal information, we cannot guarantee its absolute security.
            </p>
            <p>
              For more information about our security practices, please visit our{" "}
              <Link href="/security" className="text-primary hover:underline">
                Security
              </Link>{" "}
              page.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Your Data Protection Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The right to access, update, or delete your information</li>
              <li>The right to rectification</li>
              <li>The right to object to processing</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p>To exercise any of these rights, please contact us at privacy@blocklend.com.</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-black/5 dark:bg-white/5">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>By email: privacy@blocklend.com</li>
              <li>By phone: +1 (555) 123-4567</li>
              <li>By mail: 123 Blockchain Avenue, Suite 500, San Francisco, CA 94107</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
