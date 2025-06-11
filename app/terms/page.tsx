import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Terms of Service
              </h1>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Last updated: May 22, 2025
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Welcome to SMELend, a P2P lending platform for SMEs with
                  blockchain-based credit scoring. These Terms of Service
                  ("Terms") govern your access to and use of the SMELend
                  platform, including our website, services, and applications
                  (collectively, the "Platform").
                </p>
                <p className="text-muted-foreground">
                  By accessing or using the Platform, you agree to be bound by
                  these Terms. If you do not agree to these Terms, you may not
                  access or use the Platform. Please read these Terms carefully
                  before using the Platform.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">2. Definitions</h2>
                <p className="text-muted-foreground">
                  In these Terms, the following definitions apply:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>"SMELend"</strong>, <strong>"we"</strong>,{" "}
                    <strong>"us"</strong>, or <strong>"our"</strong> refers to
                    the company operating the Platform.
                  </li>
                  <li>
                    <strong>"User"</strong>, <strong>"you"</strong>, or{" "}
                    <strong>"your"</strong> refers to any individual or entity
                    that accesses or uses the Platform.
                  </li>
                  <li>
                    <strong>"Borrower"</strong> refers to a User who applies for
                    or receives a loan through the Platform.
                  </li>
                  <li>
                    <strong>"Lender"</strong> refers to a User who provides
                    funds for loans through the Platform. refers to a User who
                    provides funds for loans through the Platform.
                  </li>
                  <li>
                    <strong>"Content"</strong> refers to all information, data,
                    text, software, graphics, and other materials on the
                    Platform.
                  </li>
                  <li>
                    <strong>"Loan Agreement"</strong> refers to the agreement
                    between a Borrower and Lender(s) for a specific loan
                    facilitated through the Platform.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">3. Eligibility</h2>
                <p className="text-muted-foreground">
                  To use the Platform, you must be at least 18 years old and
                  have the legal capacity to enter into binding contracts. If
                  you are using the Platform on behalf of a business entity, you
                  represent that you have the authority to bind that entity to
                  these Terms.
                </p>
                <p className="text-muted-foreground">
                  You must provide accurate, current, and complete information
                  during the registration process and keep your account
                  information updated. You are responsible for maintaining the
                  confidentiality of your account credentials and for all
                  activities that occur under your account.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">4. Platform Services</h2>
                <h3 className="text-xl font-semibold">4.1 For Borrowers</h3>
                <p className="text-muted-foreground">
                  The Platform allows eligible Borrowers to apply for loans. We
                  use our blockchain-based credit scoring system to evaluate
                  loan applications and determine eligibility, loan amounts,
                  interest rates, and terms. Approved loan requests are listed
                  on our marketplace for potential Lenders to fund.
                </p>
                <h3 className="text-xl font-semibold">4.2 For Lenders</h3>
                <p className="text-muted-foreground">
                  The Platform allows eligible Lenders to browse loan
                  opportunities and invest in loans. Lenders can review borrower
                  information, loan terms, risk ratings, and expected returns
                  before making investment decisions. Funds invested are
                  committed for the duration of the loan term, subject to our
                  secondary market provisions.
                </p>
                <h3 className="text-xl font-semibold">4.3 Loan Agreements</h3>
                <p className="text-muted-foreground">
                  All loans facilitated through the Platform are governed by
                  Loan Agreements. These agreements are executed as smart
                  contracts on our blockchain platform, ensuring transparent and
                  automated enforcement of terms. By using the Platform, you
                  agree to be bound by the terms of any Loan Agreement you enter
                  into.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">5. User Obligations</h2>
                <h3 className="text-xl font-semibold">
                  5.1 General Obligations
                </h3>
                <p className="text-muted-foreground">You agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Comply with these Terms and all applicable laws and
                    regulations
                  </li>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Use the Platform only for lawful purposes</li>
                  <li>
                    Not engage in any activity that disrupts or interferes with
                    the Platform
                  </li>
                </ul>
                <h3 className="text-xl font-semibold">
                  5.2 Borrower Obligations
                </h3>
                <p className="text-muted-foreground">
                  As a Borrower, you additionally agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Provide accurate financial information during the
                    application process
                  </li>
                  <li>Use loan funds for the stated purpose</li>
                  <li>Make repayments according to the agreed schedule</li>
                  <li>
                    Notify us promptly of any material changes to your financial
                    situation
                  </li>
                </ul>
                <h3 className="text-xl font-semibold">
                  5.3 Lender Obligations
                </h3>
                <p className="text-muted-foreground">
                  As a Lender, you additionally agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Conduct your own due diligence on loan opportunities</li>
                  <li>
                    Understand and accept the risks associated with P2P lending
                  </li>
                  <li>Comply with all applicable investment regulations</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">6. Fees and Payments</h2>
                <p className="text-muted-foreground">
                  We charge fees for our services as outlined in our Fee
                  Schedule, which is incorporated into these Terms. Fees may
                  include origination fees for Borrowers and service fees for
                  Lenders. All fees are transparently disclosed before any
                  transaction is completed.
                </p>
                <p className="text-muted-foreground">
                  Payments on the Platform are processed through our secure
                  payment system. By using the Platform, you authorize us to
                  process payments according to your instructions and the terms
                  of any Loan Agreement you enter into.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">7. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The Platform and all Content on it are owned by SMELend or its
                  licensors and are protected by intellectual property laws. You
                  may not use, reproduce, distribute, modify, or create
                  derivative works of the Platform or its Content without our
                  express written permission.
                </p>
                <p className="text-muted-foreground">
                  By submitting Content to the Platform, you grant us a
                  worldwide, non-exclusive, royalty-free license to use,
                  reproduce, modify, adapt, publish, and display such Content
                  for the purpose of providing and promoting our services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">8. Privacy</h2>
                <p className="text-muted-foreground">
                  Our{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  explains how we collect, use, and protect your personal
                  information. By using the Platform, you consent to our
                  collection and use of your information as described in the
                  Privacy Policy.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  9. Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, SMELend and its
                  officers, directors, employees, and agents shall not be liable
                  for any indirect, incidental, special, consequential, or
                  punitive damages, including but not limited to loss of
                  profits, data, or goodwill, arising out of or in connection
                  with your use of the Platform.
                </p>
                <p className="text-muted-foreground">
                  Our total liability for any claim arising out of or relating
                  to these Terms or the Platform shall not exceed the greater of
                  $100 or the amount you have paid us in the past 12 months.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">10. Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify, defend, and hold harmless SMELend and
                  its officers, directors, employees, and agents from and
                  against any claims, liabilities, damages, losses, and
                  expenses, including reasonable attorneys' fees, arising out of
                  or in any way connected with your access to or use of the
                  Platform or your violation of these Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">11. Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your access to the Platform
                  immediately, without prior notice or liability, for any
                  reason, including if you breach these Terms. Upon termination,
                  your right to use the Platform will immediately cease.
                </p>
                <p className="text-muted-foreground">
                  All provisions of these Terms which by their nature should
                  survive termination shall survive termination, including,
                  without limitation, ownership provisions, warranty
                  disclaimers, indemnity, and limitations of liability.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">12. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms at any time. We
                  will provide notice of significant changes by posting the
                  updated Terms on the Platform and updating the "Last updated"
                  date. Your continued use of the Platform after such changes
                  constitutes your acceptance of the new Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">13. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance
                  with the laws of [Jurisdiction], without regard to its
                  conflict of law provisions. Any dispute arising from or
                  relating to these Terms or the Platform shall be subject to
                  the exclusive jurisdiction of the courts in [Jurisdiction].
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">14. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us
                  at{" "}
                  <a
                    href="mailto:legal@smelend.com"
                    className="text-primary hover:underline"
                  >
                    legal@smelend.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
