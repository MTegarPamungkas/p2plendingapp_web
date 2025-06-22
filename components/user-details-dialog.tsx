"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, UserCheck, Ban, Lock, Shield, XCircle } from "lucide-react";
import { User } from "@/types";
import { format } from "date-fns";

interface UserDetailsDialogProps {
  user: User;
  onApproveUser: (user: User) => void;
  onRejectUser: (user: User) => void;
}

export function UserDetailsDialog({
  user,
  onApproveUser,
  onRejectUser,
}: UserDetailsDialogProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      case "suspended":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details - {user.username}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p>{user.profile?.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Number</p>
                <p>{user.profile?.idNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p>
                  {user.profile?.dateOfBirth
                    ? format(new Date(user.profile.dateOfBirth), "PPP")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p>{user.profile?.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusBadgeClass(user.status)}>
                  {user.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="outline">{user.role}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p>{user.verified ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Join Date</p>
                <p>{format(new Date(user.createdAt), "PPP p")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Active</p>
                <p>
                  {user.lastLogin
                    ? format(new Date(user.lastLogin), "PPP p")
                    : format(new Date(user.createdAt), "PPP p")}
                </p>
              </div>
              {/* {user.status.toLowerCase() === "rejected" &&
                user.rejectionReason && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Rejection Reason
                    </p>
                    <p>{user.rejectionReason}</p>
                  </div>
                )} */}
            </div>
          </div>

          {/* Bank Accounts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bank Accounts</h3>
            {user.bankAccounts?.length > 0 ? (
              <div className="space-y-2">
                {user.bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="border rounded-md p-4 space-y-2"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Bank Name
                        </p>
                        <p>{account.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Account Number
                        </p>
                        <p>{account.accountNumber}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Primary</p>
                      <p>{account.isPrimary ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Created At
                      </p>
                      <p>{format(new Date(account.createdAt), "PPP p")}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No bank accounts registered
              </p>
            )}
          </div>

          {/* Business Profile */}
          {user.businessProfile && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Business Name</p>
                  <p>{user.businessProfile.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Type</p>
                  <p>{user.businessProfile.businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Business Duration
                  </p>
                  <p>{user.businessProfile.businessDuration} months</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p>
                    {format(new Date(user.businessProfile.createdAt), "PPP p")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documents</h3>
            {user.documents?.length > 0 ? (
              <div className="space-y-2">
                {user.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-md p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Document Type
                      </p>
                      <p>{doc.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Uploaded At
                      </p>
                      <p>{format(new Date(doc.uploadedAt), "PPP p")}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Document
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No documents uploaded</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {user.status.toLowerCase() === "pending" && (
            <>
              <Button
                onClick={() => onApproveUser(user)}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Approve User
              </Button>
              <Button
                onClick={() => onRejectUser(user)}
                className="bg-red-600 hover:bg-red-700"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject User
              </Button>
            </>
          )}
          {/* {user.status.toLowerCase() === "active" && (
            <Button variant="destructive">
              <Ban className="mr-2 h-4 w-4" />
              Suspend User
            </Button>
          )}
          {user.status.toLowerCase() === "suspended" && (
            <Button className="bg-green-600 hover:bg-green-700">
              <UserCheck className="mr-2 h-4 w-4" />
              Reactivate User
            </Button>
          )} */}
          {/* <Button variant="outline">
            {user.verified ? (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Reset Password
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verify Identity
              </>
            )}
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
