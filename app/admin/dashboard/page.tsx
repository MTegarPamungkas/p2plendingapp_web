"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, BarChart3, CheckCircle, Clock, DollarSign, FileText, PieChart, Shield, Users } from "lucide-react"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"

export default function AdminDashboardPage() {
  return (
    <AdminDashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.45M</div>
              <p className="text-xs text-muted-foreground">Across 142 active loans</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6,284</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">↑ 12%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Requiring review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.7%</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">Pending Applications</TabsTrigger>
            <TabsTrigger value="loans">Active Loans</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
          </TabsList>
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Loan Applications Requiring Review</CardTitle>
                <CardDescription>Review and approve pending loan applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b p-3 font-medium">
                    <div>Business</div>
                    <div>Amount</div>
                    <div>Purpose</div>
                    <div>Credit Score</div>
                    <div>Actions</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-5 items-center p-3">
                      <div>TechGrow Inc.</div>
                      <div>$50,000</div>
                      <div>Expansion</div>
                      <div className="flex items-center">
                        <Badge className="bg-primary/10 text-primary">A+</Badge>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/admin/applications/A-2023-0045">Review</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 items-center p-3">
                      <div>Fashion Forward Ltd.</div>
                      <div>$35,000</div>
                      <div>Inventory</div>
                      <div className="flex items-center">
                        <Badge className="bg-primary/10 text-primary">A</Badge>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/admin/applications/A-2023-0046">Review</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 items-center p-3">
                      <div>Gourmet Delights</div>
                      <div>$25,000</div>
                      <div>Equipment</div>
                      <div className="flex items-center">
                        <Badge className="bg-secondary/10 text-secondary">B+</Badge>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/admin/applications/A-2023-0047">Review</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 items-center p-3">
                      <div>Precision Parts Co.</div>
                      <div>$75,000</div>
                      <div>Expansion</div>
                      <div className="flex items-center">
                        <Badge className="bg-primary/10 text-primary">A</Badge>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/admin/applications/A-2023-0048">Review</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 items-center p-3">
                      <div>MediCare Solutions</div>
                      <div>$45,000</div>
                      <div>Equipment</div>
                      <div className="flex items-center">
                        <Badge className="bg-primary/10 text-primary">A-</Badge>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/admin/applications/A-2023-0049">Review</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/applications">
                    View All Applications <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="loans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Loans Overview</CardTitle>
                <CardDescription>Monitor and manage active loans on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Loan Status Distribution</p>
                  </div>
                  <div className="h-[200px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                    <PieChart className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Loan Status Chart</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 pt-4">
                    <div className="rounded-md bg-muted/30 p-3 text-center">
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-lg font-medium">112</p>
                    </div>
                    <div className="rounded-md bg-muted/30 p-3 text-center">
                      <p className="text-sm text-muted-foreground">Funding</p>
                      <p className="text-lg font-medium">24</p>
                    </div>
                    <div className="rounded-md bg-muted/30 p-3 text-center">
                      <p className="text-sm text-muted-foreground">Late</p>
                      <p className="text-lg font-medium">6</p>
                    </div>
                    <div className="rounded-md bg-muted/30 p-3 text-center">
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-lg font-medium">87</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Recent Loan Activity</p>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 border-b p-3 font-medium">
                      <div>Loan ID</div>
                      <div>Business</div>
                      <div>Status</div>
                      <div>Last Activity</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>L-2023-0045</div>
                        <div>TechGrow Inc.</div>
                        <div>
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Payment received (2 hours ago)</div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>L-2023-0046</div>
                        <div>Fashion Forward Ltd.</div>
                        <div>
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Payment received (1 day ago)</div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>L-2023-0047</div>
                        <div>Gourmet Delights</div>
                        <div>
                          <Badge className="bg-yellow-500/10 text-yellow-500">Late</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Payment reminder sent (3 days ago)</div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>L-2023-0048</div>
                        <div>Precision Parts Co.</div>
                        <div>
                          <Badge className="bg-blue-500/10 text-blue-500">Funding</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">New investor (5 hours ago)</div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>L-2023-0049</div>
                        <div>MediCare Solutions</div>
                        <div>
                          <Badge className="bg-blue-500/10 text-blue-500">Funding</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">New investor (12 hours ago)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/loans">
                    View All Loans <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">User Growth</p>
                  </div>
                  <div className="h-[200px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">User Growth Chart</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="rounded-md bg-muted/30 p-3 text-center">
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-lg font-medium">6,284</p>
                    </div>
                    <div className="rounded-md bg-muted/30 p-3 text-center">
                      <p className="text-sm text-muted-foreground">Borrowers</p>
                      <p className="text-lg font-medium">1,245</p>
                    </div>
                    <div className="rounded-md bg-muted/30 p-3 text-center">
                      <p className="text-sm text-muted-foreground">Lenders</p>
                      <p className="text-lg font-medium">5,039</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Recent User Activity</p>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 border-b p-3 font-medium">
                      <div>User</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div>Last Activity</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>john.doe@example.com</div>
                        <div>Lender</div>
                        <div>
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Made investment (1 hour ago)</div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>techgrow@example.com</div>
                        <div>Borrower</div>
                        <div>
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Made payment (3 hours ago)</div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>sarah.smith@example.com</div>
                        <div>Lender</div>
                        <div>
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Updated profile (5 hours ago)</div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>newuser@example.com</div>
                        <div>Lender</div>
                        <div>
                          <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Registered (1 day ago)</div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-3">
                        <div>precision@example.com</div>
                        <div>Borrower</div>
                        <div>
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Applied for loan (2 days ago)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/users">
                    Manage Users <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Monitor the health and performance of the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <p className="font-medium">All Systems Operational</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Last updated: 10 minutes ago</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Blockchain Network</p>
                        <p className="text-sm font-medium">100%</p>
                      </div>
                      <Progress value={100} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">API Services</p>
                        <p className="text-sm font-medium">99.8%</p>
                      </div>
                      <Progress value={99.8} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Database</p>
                        <p className="text-sm font-medium">99.9%</p>
                      </div>
                      <Progress value={99.9} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Web Application</p>
                        <p className="text-sm font-medium">99.7%</p>
                      </div>
                      <Progress value={99.7} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Authentication Services</p>
                        <p className="text-sm font-medium">100%</p>
                      </div>
                      <Progress value={100} className="h-1.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Recent System Events</p>
                  <div className="rounded-md border">
                    <div className="divide-y">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="font-medium">Database Backup Completed</p>
                            <p className="text-sm text-muted-foreground">Scheduled backup completed successfully</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="font-medium">System Update Deployed</p>
                            <p className="text-sm text-muted-foreground">Version 2.4.5 deployed successfully</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">1 day ago</p>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="font-medium">Security Audit Completed</p>
                            <p className="text-sm text-muted-foreground">No critical issues found</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">3 days ago</p>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="font-medium">Smart Contract Update</p>
                            <p className="text-sm text-muted-foreground">Updated loan processing contracts</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">5 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/system">
                    View System Logs <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  )
}
