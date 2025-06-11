import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find answers to common questions about our P2P lending platform
                for SMEs.
              </p>
              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for answers..."
                    className="w-full appearance-none bg-background pl-8 shadow-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="general" className="mx-auto max-w-4xl">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="borrowers">For Borrowers</TabsTrigger>
                <TabsTrigger value="lenders">For Lenders</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is SMELend?</AccordionTrigger>
                    <AccordionContent>
                      SMELend is a P2P lending platform that connects small and
                      medium enterprises (SMEs) with investors using
                      blockchain-based credit scoring. Our platform enables SMEs
                      to access affordable financing while providing investors
                      with opportunities to earn competitive returns by
                      supporting real businesses.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      How is SMELend different from traditional lending?
                    </AccordionTrigger>
                    <AccordionContent>
                      Unlike traditional lending institutions, SMELend uses
                      blockchain technology to create a more transparent,
                      efficient, and inclusive lending ecosystem. Our platform
                      eliminates intermediaries, reduces costs, and leverages
                      alternative data sources for credit scoring, allowing us
                      to serve SMEs that might be overlooked by traditional
                      banks while offering competitive returns to lenders.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is SMELend regulated?</AccordionTrigger>
                    <AccordionContent>
                      Yes, SMELend operates in compliance with all applicable
                      financial regulations in the jurisdictions where we
                      operate. We maintain appropriate licenses and
                      registrations, implement robust KYC/AML procedures, and
                      adhere to data protection regulations to ensure a secure
                      and compliant platform for all users.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      How do you ensure security on the platform?
                    </AccordionTrigger>
                    <AccordionContent>
                      We implement multiple layers of security, including
                      encryption of sensitive data, secure authentication
                      mechanisms, regular security audits, and blockchain
                      technology for immutable record keeping. Our platform is
                      built on Hyperledger Fabric, a permissioned blockchain
                      framework that provides enterprise-grade security and
                      privacy controls.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      What fees does SMELend charge?
                    </AccordionTrigger>
                    <AccordionContent>
                      For borrowers, we charge an origination fee ranging from
                      1-3% of the loan amount, depending on the loan term and
                      risk profile. For lenders, we charge a service fee of 1%
                      on repayments received. All fees are transparently
                      disclosed before any transaction is completed, and there
                      are no hidden charges.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              <TabsContent value="borrowers" className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Who can apply for a loan on SMELend?
                    </AccordionTrigger>
                    <AccordionContent>
                      SMELend serves small and medium enterprises (SMEs) that
                      have been in operation for at least 6 months. Eligible
                      businesses must be legally registered, have a business
                      bank account, and be able to provide basic financial
                      information. We welcome businesses from various industries
                      and focus on their growth potential rather than just
                      traditional credit metrics.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      What loan amounts and terms are available?
                    </AccordionTrigger>
                    <AccordionContent>
                      Loan amounts range from $5,000 to $250,000, with terms
                      from 3 months to 36 months. The specific amount and term
                      you qualify for will depend on your business's credit
                      score, cash flow, and other factors assessed during our
                      application process. Interest rates are competitive and
                      based on your risk profile.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How long does the application process take?
                    </AccordionTrigger>
                    <AccordionContent>
                      The initial application takes about 15-20 minutes to
                      complete. Once submitted, our blockchain-based credit
                      scoring system analyzes your information, typically within
                      24-48 hours. If approved, your loan is listed on our
                      marketplace, where it can be funded by lenders in as
                      little as a few hours or up to 7 days, depending on the
                      loan amount and investor interest.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      What information do I need to provide for a loan
                      application?
                    </AccordionTrigger>
                    <AccordionContent>
                      You'll need to provide basic business information
                      (registration details, industry, etc.), financial
                      information (bank statements, financial statements if
                      available), and information about the business owner(s).
                      You'll also need to specify your loan requirements and how
                      you plan to use the funds. We may request additional
                      information based on your specific situation.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How do repayments work?</AccordionTrigger>
                    <AccordionContent>
                      Repayments are made on a monthly basis according to your
                      agreed repayment schedule. You can make repayments through
                      bank transfers, direct debits, or from your SMELend
                      wallet. Our platform sends reminders before each payment
                      is due, and you can view your complete repayment schedule
                      in your dashboard. Early repayments are allowed with no
                      penalties.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              <TabsContent value="lenders" className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Who can become a lender on SMELend?
                    </AccordionTrigger>
                    <AccordionContent>
                      Individuals and institutions who meet our eligibility
                      criteria can become lenders on SMELend. This includes
                      passing our KYC/AML verification process and meeting
                      minimum investment requirements. Lenders must be of legal
                      age in their jurisdiction and comply with all applicable
                      laws regarding investment activities.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      What returns can I expect as a lender?
                    </AccordionTrigger>
                    <AccordionContent>
                      Returns vary based on the risk profile of the loans you
                      invest in, typically ranging from 5% to 15% annually.
                      Higher-risk loans offer higher potential returns. It's
                      important to note that all investments carry risk, and
                      returns are not guaranteed. We recommend diversifying your
                      investments across multiple loans to manage risk.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How do I choose which loans to fund?
                    </AccordionTrigger>
                    <AccordionContent>
                      Our marketplace provides detailed information about each
                      loan opportunity, including the borrower's industry, loan
                      purpose, credit score, risk rating, and expected returns.
                      You can filter loans based on various criteria to match
                      your investment preferences. We also offer auto-invest
                      features that automatically allocate your funds based on
                      your predefined criteria.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      What happens if a borrower defaults on a loan?
                    </AccordionTrigger>
                    <AccordionContent>
                      If a borrower misses a payment, we initiate our recovery
                      process, which includes reminders, rescheduling options,
                      and ultimately legal collection procedures if necessary.
                      Our blockchain-based smart contracts include provisions
                      for default scenarios, and we work diligently to recover
                      funds for lenders. However, there is always a risk of loss
                      in P2P lending, which is why diversification is important.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      Can I withdraw my investment early?
                    </AccordionTrigger>
                    <AccordionContent>
                      Once you've invested in a loan, your funds are committed
                      for the duration of the loan term. However, we offer a
                      secondary market where you can sell your loan parts to
                      other lenders, subject to availability of buyers. A small
                      fee applies to secondary market transactions. This
                      provides a potential exit option, though liquidity is not
                      guaranteed.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
              <TabsContent value="technical" className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      How does blockchain-based credit scoring work?
                    </AccordionTrigger>
                    <AccordionContent>
                      Our credit scoring system analyzes traditional financial
                      data alongside alternative data sources to create a
                      comprehensive credit profile. This data is securely
                      recorded on the Hyperledger Fabric blockchain, creating an
                      immutable and transparent credit history. Our proprietary
                      algorithm assesses various risk factors to generate a
                      credit score that more accurately reflects the borrower's
                      creditworthiness than traditional scoring methods.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      What is Hyperledger Fabric and why do you use it?
                    </AccordionTrigger>
                    <AccordionContent>
                      Hyperledger Fabric is an enterprise-grade, permissioned
                      blockchain framework that allows for private transactions
                      and confidential contracts. We use it because it provides
                      the security, scalability, and privacy controls needed for
                      financial applications. Unlike public blockchains,
                      Hyperledger Fabric allows us to control who can access
                      sensitive financial data while still maintaining the
                      benefits of blockchain technology such as immutability and
                      transparency.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How do smart contracts work on your platform?
                    </AccordionTrigger>
                    <AccordionContent>
                      Smart contracts on our platform are self-executing
                      contracts with the terms directly written into code. They
                      automatically enforce loan agreements, manage fund
                      disbursements, process repayments, and handle default
                      scenarios according to predefined rules. This automation
                      reduces operational costs, eliminates human error, and
                      ensures transparent execution of all contractual terms.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      Is my data secure on the blockchain?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, your data is highly secure. Hyperledger Fabric uses
                      advanced cryptography to protect data, and our
                      permissioned blockchain ensures that only authorized
                      parties can access specific information. Sensitive
                      personal and financial data is encrypted and stored
                      off-chain with only cryptographic references on the
                      blockchain. We comply with all relevant data protection
                      regulations, including GDPR where applicable.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      Do I need to understand blockchain to use the platform?
                    </AccordionTrigger>
                    <AccordionContent>
                      No, you don't need any technical knowledge of blockchain
                      to use our platform. We've designed the user interface to
                      be intuitive and user-friendly, hiding the technical
                      complexity behind a simple experience. While blockchain
                      powers our platform behind the scenes, users interact with
                      a familiar web interface that's accessible to everyone,
                      regardless of technical background.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Still Have Questions?
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our support team is here to help you with any questions you may
                have about our platform.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/contact">
                  <Button size="lg">Contact Support</Button>
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
