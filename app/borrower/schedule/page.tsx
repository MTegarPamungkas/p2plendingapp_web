"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, FileText, Wallet } from "lucide-react"
import { BorrowerDashboardLayout } from "@/components/borrower-dashboard-layout"
import { PaymentDialog } from "@/components/payment-dialog"

export default function BorrowerSchedulePage() {
  const [selectedLoan, setSelectedLoan] = useState("L-2023-0012")
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  // Mock loans data
  const loans = [
    {
      id: "L-2023-0012",
      title: "Working Capital Loan",
      amount: 15000,
      interestRate: 8.5,
      term: 12,
      startDate: "2023-06-15",
      endDate: "2024-06-15",
      remainingBalance: 8750,
    },
    {
      id: "L-2023-0025",
      title: "Equipment Financing",
      amount: 25000,
      interestRate: 7.5,
      term: 24,
      startDate: "2023-08-01",
      endDate: "2025-08-01",
      remainingBalance: 21875,
    },
  ]

  // Get the selected loan
  const loan = loans.find((l) => l.id === selectedLoan) || loans[0]

  // Generate repayment schedule
  const generateRepaymentSchedule = (loan: any) => {
    const monthlyPayment = loan.amount / loan.term
    const startDate = new Date(loan.startDate)
    const schedule = []

    for (let i = 0; i < loan.term; i++) {
      const paymentDate = new Date(startDate)
      paymentDate.setMonth(startDate.getMonth() + i)

      const principal = monthlyPayment * 0.7
      const interest = monthlyPayment * 0.3
      const totalPayment = principal + interest

      const today = new Date()
      let status = "Scheduled"
      if (paymentDate < today && i < 5) {
        status = "Paid"
      } else if (i === 5) {
        status = "Upcoming"
      }

      schedule.push({
        number: i + 1,
        date: paymentDate.toISOString().split("T")[0],
        principal: principal,
        interest: interest,
        total: totalPayment,
        status: status,
      })
    }

    return schedule
  }

  const repaymentSchedule = generateRepaymentSchedule(loan)

  const handleMakePayment = (payment: any) => {
    setSelectedPayment(payment)
    setPaymentDialogOpen(true)
  }

  return (
    <BorrowerDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Repayment Schedule</h1>
          <p className="text-muted-foreground">View and manage your loan repayments</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Select value={selectedLoan} onValueChange={setSelectedLoan}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select loan" />
              </SelectTrigger>
              <SelectContent>
                {loans.map((loan) => (
                  <SelectItem key={loan.id} value={loan.id}>
                    {loan.title} ({loan.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" /> Download Schedule
            </Button>
            <Button size="sm">
              <Wallet className="mr-2 h-4 w-4" /> Make a Payment
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{loan.title}</CardTitle>
            <CardDescription>Loan #{loan.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Loan Amount</p>
                <p className="text-xl font-medium">${loan.amount.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Interest Rate</p>
                <p className="text-xl font-medium">{loan.interestRate}% p.a.</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Term</p>
                <p className="text-xl font-medium">{loan.term} months</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Remaining Balance</p>
                <p className="text-xl font-medium">${loan.remainingBalance.toLocaleString()}</p>
              </div>
            </div>

            <Separator />

            <div className="rounded-md bg-muted/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Next Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Due on{" "}
                    {new Date(repaymentSchedule.find((p) => p.status === "Upcoming")?.date || "").toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-medium">
                  $
                  {repaymentSchedule
                    .find((p) => p.status === "Upcoming")
                    ?.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <Button
                  size="sm"
                  onClick={() => handleMakePayment(repaymentSchedule.find((p) => p.status === "Upcoming"))}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Complete Repayment Schedule</CardTitle>
                <CardDescription>All scheduled payments for your loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="py-3 text-left font-medium">No.</th>
                        <th className="py-3 text-left font-medium">Date</th>
                        <th className="py-3 text-right font-medium">Principal</th>
                        <th className="py-3 text-right font-medium">Interest</th>
                        <th className="py-3 text-right font-medium">Total</th>
                        <th className="py-3 text-center font-medium">Status</th>
                        <th className="py-3 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repaymentSchedule.map((payment) => (
                        <tr key={payment.number} className="border-b border-border/50 last:border-0">
                          <td className="py-3 text-left">{payment.number}</td>
                          <td className="py-3 text-left">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="py-3 text-right">
                            ${payment.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 text-right">
                            ${payment.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 text-right">
                            ${payment.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 text-center">
                            <Badge
                              variant="outline"
                              className={
                                payment.status === "Paid"
                                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                                  : payment.status === "Upcoming"
                                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500"
                                    : "bg-muted/30 text-muted-foreground hover:bg-muted/30 hover:text-muted-foreground"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
                            {payment.status === "Paid" ? (
                              <Button variant="ghost" size="sm">
                                <Download className="mr-2 h-3 w-3" /> Receipt
                              </Button>
                            ) : payment.status === "Upcoming" ? (
                              <Button size="sm" onClick={() => handleMakePayment(payment)}>
                                Pay Now
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                Scheduled
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Showing {repaymentSchedule.length} payments</div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>Payments that are due soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="py-3 text-left font-medium">No.</th>
                        <th className="py-3 text-left font-medium">Date</th>
                        <th className="py-3 text-right font-medium">Principal</th>
                        <th className="py-3 text-right font-medium">Interest</th>
                        <th className="py-3 text-right font-medium">Total</th>
                        <th className="py-3 text-center font-medium">Status</th>
                        <th className="py-3 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repaymentSchedule
                        .filter((payment) => payment.status === "Upcoming" || payment.status === "Scheduled")
                        .slice(0, 5)
                        .map((payment) => (
                          <tr key={payment.number} className="border-b border-border/50 last:border-0">
                            <td className="py-3 text-left">{payment.number}</td>
                            <td className="py-3 text-left">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="py-3 text-right">
                              ${payment.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 text-right">
                              ${payment.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 text-right">
                              ${payment.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 text-center">
                              <Badge
                                variant="outline"
                                className={
                                  payment.status === "Upcoming"
                                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500"
                                    : "bg-muted/30 text-muted-foreground hover:bg-muted/30 hover:text-muted-foreground"
                                }
                              >
                                {payment.status}
                              </Badge>
                            </td>
                            <td className="py-3 text-right">
                              {payment.status === "Upcoming" ? (
                                <Button size="sm" onClick={() => handleMakePayment(payment)}>
                                  Pay Now
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" disabled>
                                  Scheduled
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="past" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Past Payments</CardTitle>
                <CardDescription>Your payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="py-3 text-left font-medium">No.</th>
                        <th className="py-3 text-left font-medium">Date</th>
                        <th className="py-3 text-right font-medium">Principal</th>
                        <th className="py-3 text-right font-medium">Interest</th>
                        <th className="py-3 text-right font-medium">Total</th>
                        <th className="py-3 text-center font-medium">Status</th>
                        <th className="py-3 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repaymentSchedule
                        .filter((payment) => payment.status === "Paid")
                        .map((payment) => (
                          <tr key={payment.number} className="border-b border-border/50 last:border-0">
                            <td className="py-3 text-left">{payment.number}</td>
                            <td className="py-3 text-left">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="py-3 text-right">
                              ${payment.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 text-right">
                              ${payment.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 text-right">
                              ${payment.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 text-center">
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                              >
                                {payment.status}
                              </Badge>
                            </td>
                            <td className="py-3 text-right">
                              <Button variant="ghost" size="sm">
                                <Download className="mr-2 h-3 w-3" /> Receipt
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {repaymentSchedule.filter((payment) => payment.status === "Paid").length} payments
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedPayment && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          loanId={loan.id}
          paymentAmount={selectedPayment.total}
          dueDate={selectedPayment.date}
        />
      )}
    </BorrowerDashboardLayout>
  )
}
