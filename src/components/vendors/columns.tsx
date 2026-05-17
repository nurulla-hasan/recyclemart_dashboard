
"use client";

import { useState } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Check, X, Ban, LockOpen, Loader2, Eye, MapPin, Calendar, FileText, User, Phone, Mail, Trash2 } from "lucide-react";
import { formatDate, SuccessToast, ErrorToast } from "@/lib/utils";
import { Vendor } from "@/types/vendors.type";
import { approveVendor, rejectVendor, blockVendor, unblockVendor, deleteVendor } from "@/services/vendors";

const VendorActions = ({ vendor }: { vendor: Vendor }) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | "block" | "unblock" | "delete" | "view" | null>(null);
  const [reason, setReason] = useState("");

  const isOpen = (currentAction: typeof action) => action === currentAction;
  
  const resetState = () => {
    setAction(null);
    setReason("");
    setLoading(false);
  };

  const handleAction = async () => {
    setLoading(true);
    try {
      let res;
      if (action === "approve") {
        res = await approveVendor(vendor._id);
      } else if (action === "unblock") {
        res = await unblockVendor(vendor._id, reason);
      } else if (action === "reject") {
        if (!reason.trim()) {
           ErrorToast("Reason is required");
           setLoading(false);
           return;
        }
        res = await rejectVendor(vendor._id, reason);
      } else if (action === "block") {
         if (!reason.trim()) {
           ErrorToast("Reason is required");
           setLoading(false);
           return;
        }
        res = await blockVendor(vendor._id, reason);
      } else if (action === "delete") {
        res = await deleteVendor(vendor._id);
      }

      if (res?.success) {
        SuccessToast(action === "delete" ? "Vendor deleted successfully" : `Vendor ${action}ed successfully`);
        resetState();
      } else {
        ErrorToast(res?.message || "Something went wrong");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAction("view")}>
            <Eye className="h-4 w-4 text-blue-500" /> View Details
          </DropdownMenuItem>
          {vendor.status === "PENDING" && (
            <>
              <DropdownMenuItem onClick={() => setAction("approve")}>
                <Check className="text-green-500" /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAction("reject")}>
                <X className="text-destructive" /> Reject
              </DropdownMenuItem>
            </>
          )}
          {vendor.status === "APPROVED" && !vendor.blocked && (
            <DropdownMenuItem onClick={() => setAction("block")}>
              <Ban className="text-destructive" /> Block
            </DropdownMenuItem>
          )}
          {vendor.blocked && (
            <DropdownMenuItem onClick={() => setAction("unblock")}>
              <LockOpen className="text-blue-500" /> Unblock
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setAction("delete")}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="text-destructive" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Vendor Details Dialog */}
      <Dialog open={isOpen("view")} onOpenChange={(open) => !open && resetState()}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Vendor Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive information about {vendor.storeName}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Store Banner/Image */}
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted group">
              {vendor.storeImage ? (
                <Image 
                  src={vendor.storeImage} 
                  alt={vendor.storeName}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/5">
                  <span className="text-4xl font-bold text-primary/20">
                    {vendor.storeName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                <h4 className="text-white font-bold text-xl">{vendor.storeName}</h4>
                <Badge className="w-fit bg-primary hover:bg-primary text-white border-none px-3 py-0.5">
                  {vendor.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-1">Store Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Name:</span> {vendor.storeName}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span> {vendor.storeLocation}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Trade License:</span> {vendor.tradeLicenseNumber}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Joined:</span> {formatDate(vendor.createdAt)}
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-1">Owner Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Name:</span> {vendor.user.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span> {vendor.user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Phone:</span> {vendor.user.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Documents */}
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-lg border-b pb-1">Verification Documents</h3>
              <div className="p-4 border rounded-lg bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Trade License Document</p>
                    <p className="text-xs text-muted-foreground">Verification document provided by vendor</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={vendor.tradeLicense} target="_blank" rel="noopener noreferrer">View Document</a>
                </Button>
              </div>
            </div>

            {/* Block Info if applicable */}
            {vendor.blocked && (
              <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5 space-y-2">
                <div className="flex items-center gap-2 text-destructive font-semibold">
                  <Ban className="h-4 w-4" />
                  Blocked Information
                </div>
                <p className="text-sm text-destructive/80">
                  <span className="font-medium">Reason:</span> {vendor.blockReason || "No reason provided"}
                </p>
                {vendor.blockedAt && (
                  <p className="text-xs text-destructive/60">
                    Blocked on {formatDate(vendor.blockedAt)}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="p-6 pt-2">
            <Button onClick={resetState}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation */}
      <AlertDialog open={isOpen("approve")} onOpenChange={(open) => !open && resetState()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Vendor?</AlertDialogTitle>
            <AlertDialogDescription>
              This will allow the vendor to list products and operate on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleAction(); }} disabled={loading} className="bg-green-600 hover:bg-green-700">
               {loading && <Loader2 className="animate-spin" />} Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock Confirmation */}
      <AlertDialog open={isOpen("unblock")} onOpenChange={(open) => !open && resetState()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock Vendor?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the vendor&apos;s access to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleAction(); }} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading && <Loader2 className="animate-spin" />} Unblock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isOpen("delete")} onOpenChange={(open) => !open && resetState()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the vendor profile, remove the owner from dashboard user lists, and archive their ads.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleAction();
              }}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading && <Loader2 className="animate-spin" />} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for Reject/Block with Reason */}
      <Dialog open={isOpen("reject") || isOpen("block")} onOpenChange={(open) => !open && resetState()}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="capitalize">{action} Vendor</DialogTitle>
               <DialogDescription>
                  Please provide a reason for {action}ing this vendor.
               </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea 
                     id="reason" 
                     placeholder={`Why are you ${action}ing this vendor?`} 
                     value={reason} 
                     onChange={(e) => setReason(e.target.value)}
                  />
               </div>
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={resetState} disabled={loading}>Cancel</Button>
               <Button onClick={handleAction} disabled={loading} variant="destructive">
                  {loading && <Loader2 className="animate-spin" />} Confirm {action && action.charAt(0).toUpperCase() + action.slice(1)}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </>
  );
};

export const vendorsColumns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "storeName",
    header: "Store",
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={vendor.storeImage} alt={vendor.storeName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {vendor.storeName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{vendor.storeName}</span>
            <span className="text-xs text-muted-foreground md:hidden">{vendor.storeLocation}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: "Owner",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "user.phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.user.phone || "N/A"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isBlocked = row.original.blocked;
      
      if (isBlocked) {
          return <Badge variant="destructive">BLOCKED</Badge>;
      }

      return (
        <Badge
          variant={
            status === "APPROVED"
              ? "default"
              : status === "REJECTED"
              ? "destructive"
              : "secondary"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "listingsUsed",
    header: "Listings",
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("listingsUsed")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue("createdAt"))}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <div className="text-right"><VendorActions vendor={row.original} /></div>,
  },
];
